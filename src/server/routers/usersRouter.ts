import { Router } from "express";
import loginUser from "../controllers/userControllers";

const usersRouter = Router();

usersRouter.post("/login", loginUser);

export default usersRouter;
