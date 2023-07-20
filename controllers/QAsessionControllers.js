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
        questionTags: req.body.questionTags,
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
          question: item.questionHeading,
          questionId: item._id,
          userName: item.userId.userName,
          userMail: item.userId.email,
          comments: item.comments.length,
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
        .populate("comments.author", ["userName", "email", "profile"]);

      res.status(200).json({
        status: true,
        details: {
          votes: data.votes.length,
          email: data.userId.email,
          questionPage: data.question,
          userName: data.userId.userName,
          question: data.questionHeading,
          questionTags: data.questionTags,
          comments: data.comments.reverse(),
          haveVoted: data.votes.includes(req.headers.req_email),
        },
      });
    } catch (error) {
      res.status(301).json({ status: false, message: statusMessages[0] });
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
      res.status(301).json({ status: false, message: `couldn't create` });
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
        console.log("Answer");
      }
    } catch (error) {
      res.status(301).json({ status: false, message: `something wen't wrong` });
    }
  },
};
