import type mongoose from "mongoose";

export interface UserData {
  username: string;
  email: string;
  password: string;
}

export interface PostData {
  projectTitle: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  stack: string;
  technologies: string[];
  yearsOfExperience: string;
}

export interface PostDataWithId extends PostData {
  _id: mongoose.Types.ObjectId;
}

export type UserCredentials = Pick<UserData, "email" | "password">;
