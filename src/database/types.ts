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
  username: string;
}

export type UserCredentials = Pick<UserData, "email" | "password">;
