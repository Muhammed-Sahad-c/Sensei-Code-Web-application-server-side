import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  email: { type: String },
  userName: { type: String },
  password: { type: String },
  followers: { type: [String] },
  bio: { type: String, Default: "" },
  about: { type: String, Default: "" },
  profile: { type: String, default: null },
  google: { type: Boolean, default: false },
  reputation: {
    type: Number,
    default: 0,
  },
});

export const userModel = mongoose.model("users", usersSchema);
