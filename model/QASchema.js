import mongoose, { Schema } from "mongoose";
import { userModel } from "./userSchema.js";

const qaSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    question: { type: String },
    questionHeading: { type: String },
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        comment: String,
        time: Array,
      },
    ],
  },
  { timestamps: true }
);

export const qaModel = mongoose.model("questions", qaSchema);
