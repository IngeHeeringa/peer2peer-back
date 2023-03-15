import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import Post from "../../../database/models/Post.js";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({}).populate("creator").exec();

    if (posts.length === 0) {
      const getPostsError = new CustomError(
        "Sorry, we could not get any posts",
        500,
        "Sorry, we could not get any posts"
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
    const { idPost } = req.params;

    const post = await Post.findByIdAndDelete(idPost).exec();

    res.status(200).json({ post });
  } catch (error) {
    const deletePostError = new CustomError(
      error.message as string,
      500,
      "The requested post could not be deleted"
    );

    next(deletePostError);
  }
};
