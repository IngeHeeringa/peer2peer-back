import { model, Schema } from "mongoose";

export const postSchema = new Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
    required: true,
  },
  technologies: {
    type: [],
    required: true,
  },
  yearsOfExperience: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

export const Post = model("Post", postSchema, "posts");

export default Post;
