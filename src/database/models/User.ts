import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
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
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  backupAvatar: {
    type: String,
  },
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
  },
});

export const User = model("User", userSchema, "users");

export default User;
