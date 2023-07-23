import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
    answer: { type: String },
    votes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const answerModel = mongoose.model("answers", answerSchema);
