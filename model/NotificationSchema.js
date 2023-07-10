import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  userMail: { type: String },
  notifications: [
    {
      NotificationType: String,
      content: Object,
      status: { type: Boolean, default: false },
      time: String,
    },
  ],
});

export const notificationModel = mongoose.model(
  "notifications",
  notificationSchema
);
