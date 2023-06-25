import { qaModel } from "../model/QASchema.js";
import { userModel } from "../model/userSchema.js";

export const qasectionControllers = {
  submitQuestion: async (req, res) => {
    try {
      const data = {
        userId: req.body.id,
        question: req.body.question,
        questionHeading: req.body.questionHeading,
      };
      const response = await qaModel.create(data);
      res.json({ status: true });
    } catch (error) {
      res.json({ status: false, message: "something went wrong!" });
    }
  },
  getAllQuestions: async (req, res) => {
    try {
      const questions = await qaModel
        .find()
        .populate("userId", ["userName", "email"]);
      const response = [];
      for (let item of questions) {
        response.push({
          question: item.questionHeading,
          userName: item.userId.userName,
          userMail: item.userId.email,
          time: item.createdAt.toString().split(" "),
        });
      }

      res.json({ status: true, questions: response });
    } catch (error) {
      res.json({ status: false, message: "something went wrong!" });
      throw error;
    }
  },
};
