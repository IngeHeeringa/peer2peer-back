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
    const posts = await Post.find({}).exec();

    res.status(200).json({ posts });
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

    const imageBuffer = await fs.readFile(path.join("uploads", imageName!));

    const optimizedImage = await sharp(imageBuffer)
      .resize(465, 383, { fit: "cover" })
      .webp()
      .toBuffer();

    await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(imageName!, optimizedImage);

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(imageName!);

    await Post.create({
      ...newPost,
      image: imageName,
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
