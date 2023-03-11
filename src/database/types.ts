export interface UserData {
  username: string;
  email: string;
  password: string;
}

export type UserCredentials = Pick<UserData, "email" | "password">;
