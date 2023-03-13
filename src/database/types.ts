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
  stack: Stack;
  technologies: string[];
  yearsOfExperience: string;
  username: string;
}

export enum Stack {
  frontEnd,
  backEnd,
  fullStack,
}

export type UserCredentials = Pick<UserData, "email" | "password">;
