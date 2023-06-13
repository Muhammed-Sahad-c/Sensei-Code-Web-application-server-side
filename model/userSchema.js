import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  profile: { type: String, default: null },
  google: { type: Boolean, default: false },
});

export const userModel = mongoose.model("users", usersSchema);
 