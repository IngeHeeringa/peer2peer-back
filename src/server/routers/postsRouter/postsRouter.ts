import { Router } from "express";
import { getPosts } from "../../controllers/postsController.ts/postsController.js";

const postsRouter = Router();

postsRouter.get("/posts", getPosts);

export default postsRouter;
