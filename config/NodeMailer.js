import nodemailer from "nodemailer";
import {} from "dotenv/config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 630,
  secure: true,
  auth: {
    user: process.env.DEV_EMAIL,
    pass: process.env.PASSWORD,
  },
});
