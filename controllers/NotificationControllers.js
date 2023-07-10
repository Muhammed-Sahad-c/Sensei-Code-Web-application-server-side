import { notificationModel } from "../model/NotificationSchema.js";

export const notificationControllers = {
  getUnreadedNotifications: async (req, res) => {
    try {
      const notifications = await notificationModel.findOne({
        userMail: req.headers.email,
      });
      if (!notifications) {
        res
          .status(200)
          .json({ status: null, message: `No unreaded notifications` });
      } else {
        res
          .status(200)
          .json({ status: true, notifications: notifications.notifications });
      }
    } catch (error) {
      throw error;
    }
  },
};
