import { Router } from "express";
import {
  deletePostById,
  getPosts,
} from "../../controllers/postsController/postsController.js";

const postsRouter = Router();

postsRouter.get("/posts", getPosts);
postsRouter.delete("/posts/delete/:id", deletePostById);

export default postsRouter;
