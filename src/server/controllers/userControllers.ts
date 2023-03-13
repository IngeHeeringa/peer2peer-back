import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../database/models/User.js";
import { CustomError } from "../../CustomError/CustomError.js";
import { type UserData, type UserCredentials } from "../../database/types.js";

export const loginUser = async (
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

      throw authError;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const authError = new CustomError(
        "Wrong password",
        401,
        "Wrong credentials"
      );

      throw authError;
    }

    const jwtPayload = {
      sub: user?._id,
      email: user?.email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.status(200).json({ email, token });
  } catch (error: unknown) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserData>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    const message = "User registered successfully";

    res.status(201).json({ message });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Couldn't register the user"
    );

    next(customError);
  }
};
