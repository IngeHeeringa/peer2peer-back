import { Router } from "express";
import { validate } from "express-validation";
import loginUser from "../controllers/userControllers.js";
import loginSchema from "../schemas/loginSchema.js";

const usersRouter = Router();

usersRouter.post(
  "/login",
  validate(loginSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
