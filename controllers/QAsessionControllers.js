import { qaModel } from "../model/QASchema.js";
import { userModel } from "../model/userSchema.js";
import { answerModel } from "../model/AnswerSchema.js";
import { statusMessages } from "../constants/StatusMessages.js";
import { notificationModel } from "../model/NotificationSchema.js";

export const qasectionControllers = {
  submitQuestion: async (req, res) => {
    try {
      const data = {
        userId: req.body.id,
        question: req.body.question,
        questionTags: req.body.questionTags,
        questionHeading: req.body.questionHeading,
      };
      const response = await qaModel.create(data);
      res.json({ status: true });
    } catch (error) {
      res.json({ status: false, message: "something went wrong!" });
      throw error;
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
          questionId: item._id,
          userMail: item.userId.email,
          question: item.questionHeading,
          userName: item.userId.userName,
          comments: item.comments.length,
          questionTags: item.questionTags,
          answersCount: item.answers.length,
          acceptedAnswer: item.acceptedAnswer,
          votesCount: item.support.length || 0,
          time: item.createdAt.toString().split(" "),
        });
      }

      res.status(200).json({ status: true, questions: response });
    } catch (error) {
      res.status(401).json({ status: false, message: statusMessages[0] });
      throw error;
    }
  },

  getQuestionDetails: async (req, res, next) => {
    try {
      const data = await qaModel
        .findOne({ _id: req.headers.questionid })
        .populate("userId", ["userName", "email"])
        .populate("comments.author", ["userName", "email", "profile"]);
      res.status(200).json({
        status: true,
        details: {
          oppose: data.oppose,
          support: data.support,
          comments: data.comments,
          email: data.userId.email,
          createdAt: data.createdAt,
          questionPage: data.question,
          userName: data.userId.userName,
          question: data.questionHeading,
          questionTags: data.questionTags,
          acceptedAnswer: data.acceptedAnswer,
        },
      });
    } catch (error) {
      res.status(401).json({ status: false, message: statusMessages[0] });
      throw error;
    }
  },

  addNewComment: async (req, res) => {
    try {
      const { userMail, comment, time, questionId, author, ownerEmail, id } =
        req.body;
      const updatedDetails = await qaModel.findOneAndUpdate(
        { _id: questionId },
        {
          $push: {
            comments: {
              author: id,
              comment: comment,
              time: new Date().toString(),
            },
          },
        }
      );

      //updating it to notifications
      if (userMail !== ownerEmail) {
        const pushNotification = await notificationModel.findOneAndUpdate(
          { userMail: ownerEmail },
          {
            $push: {
              notifications: {
                NotificationType: `COMMENT`,
                status: true,
                content: {
                  id: questionId,
                  comment: comment,
                  commentedUser: author,
                  time: new Date().toString(),
                },
              },
            },
          }
        );
      }
      res.status(201).json({ status: true });
    } catch (error) {
      res.status(301).json({ status: false, message: statusMessages[0] });
      throw error;
    }
  },

  addNewVote: async (req, res) => {
    try {
      const { doc_id, type, email } = req.body;
      if (type === "QUESTION") {
        const updateNewVote = await qaModel.updateOne(
          { _id: doc_id },
          { $push: { votes: email } }
        );
        res.status(201).json({ status: true });
      } else if (type === "ANSWER") {
        const updateVoteInAnswer = await answerModel.updateOne(
          { _id: doc_id },
          { $push: { votes: email } }
        );
        res.status(201).json({ status: true });
      }
    } catch (error) {
      res.status(301).json({ status: false, message: statusMessages[0] });
    }
  },

  submitUserAnswer: async (req, res) => {
    try {
      const { questionId, answer, id } = req.body;
      const data = {
        answer,
        questionId,
        userId: id,
      };
      const updateAnswer = await answerModel.create(data);
      const updateAnswerInQuestions = await qaModel.updateOne(
        { _id: questionId },
        { $push: { answers: updateAnswer._id } }
      );
      const userData = await userModel.findOne({ _id: data.userId });
      userData.points += 10;
      const updatePoints = await userData.save();
      const question = await qaModel
        .findOne({ _id: questionId })
        .populate("userId", ["userName", "email"]);
      const createNotification = await notificationModel.findOneAndUpdate(
        { userMail: question.userId.email },
        {
          $push: {
            notifications: {
              NotificationType: `ANSWER`,
              status: true,
              content: {
                id: data.questionId,
                user: question.userId.userName,
                time: new Date().toString(),
              },
            },
          },
        }
      );
      res.status(201).json({ status: true });
    } catch (error) {
      res.status(301).json({ status: false, message: statusMessages[0] });
    }
  },

  getAllAnswersForTheQuestion: async (req, res) => {
    try {
      const answers = await answerModel
        .find({
          questionId: req.headers.questionid,
        })
        .populate("userId", ["userName", "email", "profile"]);
      res.status(200).json({ status: true, answers: answers });
    } catch (error) {
      res.status(301).json({ status: false, message: statusMessages[0] });
    }
  },

  updateUserSupportVote: async (req, res) => {
    try {
      const { doc_id, email, id, reputation_owner_email, isOpposed } = req.body;
      if (req.body.type === "QUESTION") {
        const updateSupportInDb = await qaModel.updateOne(
          { _id: doc_id },
          { $push: { support: email }, $pull: { oppose: email } }
        );
        const userData = await userModel.findOne({
          email: reputation_owner_email,
        });
        userData.reputation += isOpposed ? 7 : 5;
        const updatePoints = await userData.save();
        res.status(201).json({ status: true });
      } else {
        const updateUserAnswerSupportInDb = await answerModel.updateOne(
          { _id: doc_id },
          { $push: { support: email }, $pull: { oppose: email } }
        );
        const userData = await userModel.findOne({
          email: reputation_owner_email,
        });
        userData.reputation += isOpposed ? 7 : 5;
        const updatePoints = await userData.save();
        res.status(201).json({ status: true });
      }
    } catch (error) {
      res.status(401).json({ status: false, message: statusMessages[0] });
      throw error;
    }
  },

  updateUserOpposeVote: async (req, res) => {
    try {
      if (req.body.type === "QUESTION") {
        const { doc_id, email, reputation_owner_email, isSupported, id } =
          req.body;
        const updateOpposeVoteInDb = await qaModel.updateOne(
          { _id: doc_id },
          { $push: { oppose: email }, $pull: { support: email } }
        );
        const userData = await userModel.findOne({
          email: reputation_owner_email,
        });
        userData.reputation -= isSupported ? 7 : 2;
        const updatePoints = await userData.save();
        res.status(201).json({ status: true });
      } else {
        const { type, doc_id, reputation_owner_email, email, isSupported, id } =
          req.body;
        const updateOpposeVoteInDb = await answerModel.updateOne(
          { _id: doc_id },
          { $push: { oppose: email }, $pull: { support: email } }
        );
        const userData = await userModel.findOne({
          email: reputation_owner_email,
        });
        userData.reputation -= isSupported ? 7 : 2;
        const updatePoints = await userData.save();
        res.status(201).json({ status: true });
      }
    } catch (error) {
      res.status(401).json({ status: false, message: statusMessages[0] });
      throw error;
    }
  },

  updateAcceptedAnswer: async (req, res) => {
    try {
      const { newAnswerId, oldAnswerId, id, questionId, userName } = req.body;

      if (oldAnswerId !== "") {
        const udpateAnswer = await answerModel.updateOne(
          { _id: oldAnswerId },
          { accepted: false }
        );
      }
      const udpateAnswer = await answerModel.updateOne(
        { _id: newAnswerId },
        { accepted: true }
      );
      const updateQuestion = await qaModel.updateOne(
        { _id: questionId },
        { acceptedAnswer: newAnswerId }
      );
      res
        .status(201)
        .json({ status: true, message: `accepted ${userName}'s answer` });
    } catch (error) {
      res.status(401).json({ status: false, message: statusMessages[1] });
      throw error;
    }
  },

  removeAcceptedAnswer: async (req, res) => {
    try {
      const { newAnswerId, questionId } = req.body;
      const udpateAnswer = await answerModel.updateOne(
        { _id: newAnswerId },
        { accepted: false }
      );
      const updateQuestion = await qaModel.updateOne(
        { _id: questionId },
        { acceptedAnswer: "" }
      );
      res.status(201).json({ status: true });
    } catch (error) {
      res.status(401).json({ status: false, message: statusMessages[1] });
      throw error;
    }
  },
};
