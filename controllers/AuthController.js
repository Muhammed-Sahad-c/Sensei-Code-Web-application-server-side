import bcrypt from "bcrypt";
import {} from "dotenv/config";
import jwt from "jsonwebtoken";
import { userModel } from "../model/userSchema.js";
import { transporter } from "../config/NodeMailer.js";
import { notificationModel } from "../model/NotificationSchema.js";

const saltRounds = 10;
const wrongMessage = `something went' wrong!`;

const createToken = (id, expiryTime) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: expiryTime });
};

const otpGenerator = () => {
  return Math.floor(Math.random() * 9000) + 1000;
};

export const authControllers = {
  signupWithGoogleDataSubmission: async (req, res) => {
    try {
      const { email } = req.body;
      const alreadyUser = await userModel.findOne({ email: email });
      if (alreadyUser)
        res.json({ status: false, message: `email already registered` });
      else {
        const user = await userModel.create(req.body);
        const token = createToken(user._id, "1d");
        res.status(200).json({ status: true, token: token });
      }
    } catch (error) {
      res.json({ status: false, message: wrongMessage });
    }
  },

  signupDataSubmission: async (req, res) => {
    try {
      const { email } = req.body;
      const alreadyUser = await userModel.findOne({ email: email });
      if (alreadyUser)
        res.json({ status: false, message: `email already registered` });
      else {
        let otp = otpGenerator();
        const token = createToken({ user: req.body, otp: otp }, "1d");
        let info = await transporter.sendMail({
          from: process.env.DEV_EMAIL,
          to: email,
          subject: "Your OTP for registration is:",
          html:
            "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            otp +
            "</h1>",
        });
        res.status(200).json({ status: true, token: token });
      }
    } catch (error) {
      res.json({ status: false, message: `couldn't sent otp` });
      throw error;
    }
  },

  verifyOtp: async (req, res) => {
    try {
      let userDetails = req.body.userDetails.id;
      if (req.headers.client_otp == userDetails.otp) {
        userDetails = userDetails.user;
        bcrypt.hash(userDetails.password, saltRounds, async (err, hash) => {
          if (err) res.json({ status: false, message: wrongMessage });
          else {
            userDetails.password = hash;
            const user = await userModel.create(userDetails);
            const token = createToken(user._id, "1d");
            res.status(200).json({ status: true, token: token });
          }
        });
      } else res.json({ status: false, message: "invalid otp" });
    } catch (error) {
      res.json({ status: false, message: wrongMessage });
    }
  },

  signinDataValidation: async (req, res) => {
    try {
      const { email, password } = req.headers;
      const userDetails = await userModel.findOne({ email: email });
      if (userDetails) {
        if (userDetails.google === false) {
          const passwordResult = await bcrypt.compare(
            password,
            userDetails.password
          );
          if (passwordResult) {
            const token = createToken(userDetails._id, "1d");
            const isHaveNotification = await notificationModel.findOne({
              userMail: email,
            });
            if (!isHaveNotification) {
              const newNotification = {
                userMail: email,
                notifications: [
                  {
                    NotificationType: "LOGIN",
                    content: { message: "Login success full" },
                    status: true,
                    time: new Date().toString(),
                  },
                ],
              };
              const createNotification = await notificationModel.create(
                newNotification
              );
            } else {
              const pushNotification = await notificationModel.findOneAndUpdate(
                { userMail: email },
                {
                  $push: {
                    notifications: {
                      NotificationType: "LOGIN",
                      content: { message: "Login success full" },
                      status: true,
                      time: new Date().toString(),
                    },
                  },
                }
              );
            }
            res.json({ status: true, token });
          } else
            res.json({ status: false, message: `email or password incurrect` });
        } else
          res.json({ status: false, message: `email or password incurrect` });
      } else res.json({ status: false, message: `couldn't find email` });
    } catch (error) {
      res.json({ status: false, message: wrongMessage });
    }
  },

  signinWithGoogleDataValidation: async (req, res) => {
    try {
      const { email } = req.headers;
      const userDetails = await userModel.findOne({ email: email });
      if (userDetails && userDetails.google === true) {
        const token = createToken(userDetails._id, "1d");
        const isHaveNotification = await notificationModel.findOne({
          userMail: email,
        });
        if (!isHaveNotification) {
          const newNotification = {
            userMail: email,
            notifications: [
              {
                NotificationType: "LOGIN",
                content: { message: "Login success full" },
                status: true,
                time: new Date().toString(),
              },
            ],
          };
          const createNotification = await notificationModel.create(
            newNotification
          );
        } else {
          const pushNotification = await notificationModel.findOneAndUpdate(
            { userMail: email },
            {
              $push: {
                notifications: {
                  NotificationType: "LOGIN",
                  content: { message: "Login success full" },
                  status: true,
                  time: new Date().toString(),
                },
              },
            }
          );
        }
        res.json({ status: true, token });
      } else res.json({ status: false, message: `couldn't find email` });
    } catch (error) {
      res.json({ status: false, message: wrongMessage });
      throw error;
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const userDetails = await userModel.findOne({ _id: req.body.id });
      const { userName, email, profile, bio, about } = userDetails;
      res.json({
        status: true,
        message: "succesfull",
        userInfo: { userName, email, profile, bio, about },
      });
    } catch (error) {
      res.json({ staus: false, message: wrongMessage });
    }
  },

  getDetailsForOtp: (req, res) => {
    if (userDetails !== null) res.json(true);
    else res.json(false);
  },
};
