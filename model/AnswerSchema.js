import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
  {
    answer: { type: String },
    oppose: { type: [String], default: [] },
    support: { type: [String], default: [] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
    accepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const answerModel = mongoose.model("answers", answerSchema);
