import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import Post from "../../../database/models/Post.js";
import { type PostData } from "../../../database/types.js";
import { supabase } from "../../middlewares/imageBackup/imageBackup.js";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .skip((+req.query.page! - 1) * 8)
      .exec();

    const totalPosts = await Post.countDocuments({}).exec();

    res.status(200).json({ posts, totalPosts });
  } catch (error: unknown) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).exec();
    res.status(200).json({ post });
  } catch (error) {
    const getPostError = new CustomError(
      error.message as string,
      404,
      "Post not found"
    );

    next(getPostError);
  }
};

export const deletePostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id).exec();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    const deletePostError = new CustomError(
      error.message as string,
      500,
      "Post could not be deleted"
    );

    next(deletePostError);
  }
};

export const createPost = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, PostData>,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost: PostData = {
      ...req.body,
      technologies: (req.body.technologies as string).includes(",")
        ? (req.body.technologies as string).split(",")
        : req.body.technologies,
    };

    const imageName = req.file?.filename;

    const width = 465;
    const height = 383;
    const imageQuality = 100;

    const optimizedImageName = `${imageName!}.webp`;

    await sharp(path.join("uploads", imageName!))
      .resize(width, height, { fit: "cover" })
      .webp({ quality: imageQuality })
      .toFormat("webp")
      .toFile(path.join("uploads", optimizedImageName));

    const backupImage = await fs.readFile(
      path.join("uploads", optimizedImageName)
    );

    await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(optimizedImageName, backupImage);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(optimizedImageName);

    await Post.create({
      ...newPost,
      image: optimizedImageName,
      backupImage: publicUrl,
    });

    res
      .status(201)
      .json({ message: "Post created successfully", imageUrl: publicUrl });
  } catch (error) {
    const customError = new CustomError(
      error.message as string,
      500,
      "Post could not be created"
    );

    next(customError);
  }
};
