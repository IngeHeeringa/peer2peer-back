import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../database/models/User.js";
import { CustomError } from "../../CustomError/CustomError.js";
import { type UserCredentials } from "../../database/types.js";
const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();

    if (!user) {
      const authError = new CustomError(
        "User does not exist",
        401,
        "Wrong credentials"
      );

      next(authError);
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const authError = new CustomError(
        "Wrong password",
        401,
        "Wrong credentials"
      );

      next(authError);
      return;
    }

    const jwtPayload = {
      sub: user?._id,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Internal server error"
    );

    next(customError);
  }
};

export default loginUser;
