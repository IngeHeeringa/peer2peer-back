import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import {
  createPost,
  deletePostById,
  getPosts,
} from "../../controllers/postsControllers/postsControllers.js";

const postsRouter = Router();

const multerConfig = {
  storage: multer.diskStorage({
    destination: "uploads/",
    filename(req, file, callback) {
      const suffix = crypto.randomUUID();
      const extension = path.extname(file.originalname);
      const basename = path.basename(file.originalname, extension);
      callback(null, `${basename}-${suffix}${extension}`);
    },
  }),
};

const upload = multer({
  ...multerConfig,
  limits: { fileSize: 1024 * 1024 * 8 },
});

postsRouter.get("/posts", getPosts);
postsRouter.delete("/posts/delete/:id", deletePostById);
postsRouter.post("/posts/create", upload.single("image"), createPost);

export default postsRouter;
