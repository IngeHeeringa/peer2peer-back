import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import Post from "../../../database/models/Post.js";
import { type PostData } from "../../../database/types.js";

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

    await Post.create({ ...newPost, image });

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    const customError = new CustomError(
      error.message as string,
      500,
      "Post could not be created"
    );

    next(customError);
  }
};
