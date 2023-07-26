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
      console.log(error);
      throw error;
    }
  },
  deleteNotifications: async (req, res) => {
    try {
      const deleteNotification = await notificationModel.updateOne(
        {
          userMail: req.body.email,
        },
        {
          $pull: {
            notifications: { _id: req.body.notificationId },
          },
        }
      );
      res.status(201).json({ status: true });
    } catch (error) {
      res
        .status(401)
        .json({ status: false, message: "Cannot delete something went wrong" });
      throw error;
    }
  },
};
