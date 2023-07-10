import { notificationModel } from "../model/NotificationSchema.js";

export const dashboardControllers = {
  getNotificationCounts: async (req, res) => {
    try {
      if (req.headers.email !== undefined) {
        const notificationCounts = await notificationModel.aggregate([
          {
            $match: {
              userMail:req.headers.email,
            },
          },
          {
            $project: {
              _id: 0,
              notificationCount: {
                $size: {
                  $filter: {
                    input: "$notifications",
                    as: "notification",
                    cond: { $eq: ["$$notification.status", true] },
                  },
                },
              },
            },
          },
        ]);
        res.status(200).json({
          status: true,
          counts: {
            notificationCount: notificationCounts[0].notificationCount,
            chatCounts: 0,
          },
        });
      } else
        res.status(200).json({ status: false, message: `user not logged in` });
    } catch (error) {
      res
        .status(301)
        .json({ status: false, message: `something went wrong..` });
    }
  },
};
