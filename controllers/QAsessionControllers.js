import { qaModel } from "../model/QASchema.js";
import { userModel } from "../model/userSchema.js";
import { statusMessages } from "../constants/statusMessages.js";
import { notificationModel } from "../model/NotificationSchema.js";

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
          questionId: item._id,
          userName: item.userId.userName,
          userMail: item.userId.email,
          time: item.createdAt.toString().split(" "),
        });
      }

      res.json({ status: true, questions: response });
    } catch (error) {
      res.json({ status: false, message: statusMessages[0] });
      throw error;
    }
  },

  getQuestionDetails: async (req, res, next) => {
    try {
      const data = await qaModel
        .findOne({ _id: req.headers.questionid })
        .populate("userId", ["userName", "email"])
        .populate("comments.author", ["userName", "email"]);

      res.status(200).json({
        status: true,
        details: {
          userName: data.userId.userName,
          email: data.userId.email,
          question: data.questionHeading,
          questionPage: data.question,
          comments: data.comments.reverse(),
        },
      });
    } catch (error) {
      res.status(301).json({ status: false, message: statusMessages[0] });
      throw err;
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

      // //updating it to notifications
      // if (userMail !== ownerEmail) {
      //   const pushNotification = await notificationModel.findOneAndUpdate(
      //     { userMail: ownerEmail },
      //     {
      //       $push: {
      //         notifications: {
      //           NotificationType: `COMMENT`,
      //           status: true,
      //           content: {
      //             commentedUser: author,
      //             comment: comment,
      //             id: questionId,
      //             time: new Date().toString(),
      //           },
      //         },
      //       },
      //     }
      //   );
      // }
      res.status(201).json({ status: true });
    } catch (error) {
      res.status(301).json({ status: false, message: `couldn't create` });
      throw error;
    }
  },
};
