import { userModel } from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/NodeMailer.js";
import {} from "dotenv/config";

let userDetails = {
  user: null,
  otp: null,
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: "1d" });
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
        // const token = createToken(user._id);
        res.status(200).json({ status: true });
      }
    } catch (error) {
      res.json({ status: false, message: `Something went wront try again!` });
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
        userDetails = { user: req.body, otp: otp };
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
        res.status(200).json({ status: true });
      }
    } catch (error) {
      res.json({ status: false, message: `couldn't sent otp` });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      if (req.headers.client_otp != userDetails.otp)
        res.json({ status: false, message: `invalid otp` });
      else {
        const user = await userModel.create(userDetails.user);
        const token = createToken(user._id);
        userDetails = null;
        res.status(200).json({ status: true, token: token });
      }
    } catch (error) {
      res.json({ status: false, message: "something went wrong" });
    }
  },

  signinDataValidation: async (req, res) => {
    try {
      const { email, password } = req.headers;
      const userDetails = await userModel.findOne({ email: email });
      if (userDetails) {
        if (userDetails.google === false && password === userDetails.password) {
          const token = createToken(userDetails._id);
          res.json({ status: true, token });
        } else
          res.json({ status: false, message: `email or password incurrect` });
      } else res.json({ status: false, message: `couldn't find email` });
    } catch (error) {
      res.json({ status: false, message: "something went wrong" });
    }
  },

  signinWithGoogleDataValidation: async (req, res) => {
    try {
      const { email } = req.headers;
      const userDetails = await userModel.findOne({ email: email });
      if (userDetails && userDetails.google === true) {
        const token = createToken(userDetails._id);
        res.json({ status: true, token });
      } else res.json({ status: false, message: `couldn't find email` });
    } catch (error) {
      res.json({ status: false, message: "something went wrong" });
    }
  }, 
};
