import { model, Schema } from "mongoose";

export const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 20,
    required: true,
  },
  avatar: {
    type: String,
  },
  backupAvatar: {
    type: String,
  },
});

export const User = model("User", userSchema, "users");

export default User;
