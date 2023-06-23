import { userModel } from "../model/userSchema.js";

export const profileControllers = {
  getRandomUserDetails: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.headers.email });
      const { userName, email, bio, about, profile } = user;
      res.status(200).json({
        status: true,
        userDetails: { userName, email, bio, about, profile },
      });
    } catch (error) {
      res.json({ status: false, message: `couldn't find user` });
    }
  },
};
