import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import Post from "../../database/models/Post.js";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find().exec();
    res.status(200).json({ posts });
  } catch (error: unknown) {
    const getPostsError = new CustomError(
      (error as Error).message,
      500,
      "Sorry, we could not get any posts"
    );

    next(getPostsError);
  }
};
