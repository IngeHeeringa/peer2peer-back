import jwt from "jsonwebtoken";
import { type NextFunction, type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError.js";
import { type CustomJwtPayload, type CustomRequest } from "../../types.js";

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.header("Authorization")) {
      const authError = new CustomError(
        "Missing authorization header",
        403,
        "Missing token"
      );

      throw authError;
    }

    if (!req.header("Authorization")?.includes("Bearer")) {
      const authError = new CustomError(
        "Missing authorization header",
        403,
        "Missing token"
      );

      throw authError;
    }

    const token = req.header("Authorization")?.replace(/^Bearer\s*/i, "");

    const { sub: userId } = jwt.verify(
      token!,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;

    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
