import mongoose, { Schema } from "mongoose";
import { userModel } from "./userSchema.js";

const qaSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    question: { type: String },
    questionHeading: { type: String },
    questionTags: { type: [String], default: [] },
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        comment: String,
        time: Array,
      },
    ],
    support: { type: [String], default: [] },
    oppose: { type: [String], default: [] },
    answers: {
      type: [String],
      default: [],
    },
    acceptedAnswer: { type: String, default: "" },
  },
  { timestamps: true }
);

export const qaModel = mongoose.model("questions", qaSchema);
