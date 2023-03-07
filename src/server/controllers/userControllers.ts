import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../database/models/User.js";
import { CustomError } from "../../CustomError/CustomError.js";
import { type UserCredentialsStructure } from "../../database/types.js";

const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentialsStructure
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).exec();

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const authError = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );

    next(authError);
  }

  const jwtPayload = {
    sub: user?._id,
    username,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.status(200).json({ token });
};

export default loginUser;
