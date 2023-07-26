import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  profile: { type: String, default: null },
  google: { type: Boolean, default: false },
  about: { type: String, Default: "" },
  bio: { type: String, Default: "" },
  followers: {
    type: [String],
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
});

export const userModel = mongoose.model("users", usersSchema);
