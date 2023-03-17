import fs from "fs/promises";
import path from "path";
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

    if (posts.length === 0) {
      const getPostsError = new CustomError(
        "No posts found",
        500,
        "No posts found"
      );

      throw getPostsError;
    }

    res.status(200).json({ posts });
  } catch (error: unknown) {
    next(error);
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
    const newPost = req.body;

    const image = req.file?.filename;

    if (image) {
      const imageBuffer = await fs.readFile(path.join("uploads", image));

      await supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .upload(image, imageBuffer);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(image!);

    await Post.create({ ...newPost, image, backupImage: publicUrl });

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
