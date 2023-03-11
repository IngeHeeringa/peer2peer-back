import { Router } from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../controllers/userControllers.js";
import loginSchema from "../schemas/loginSchema.js";
import registerSchema from "../schemas/registerSchema.js";

const usersRouter = Router();

usersRouter.post(
  "/login",
  validate(loginSchema, {}, { abortEarly: false }),
  loginUser
);
usersRouter.post(
  "/register",
  validate(registerSchema, {}, { abortEarly: false }),
  registerUser
);

export default usersRouter;
