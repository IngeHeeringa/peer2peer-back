export interface UserData {
  username: string;
  email: string;
  password: string;
  avatar: string;
  backupAvatar: string;
}

export type UserCredentials = Pick<UserData, "email" | "password">;
