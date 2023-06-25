import fs from "fs";
import cloudinary from "../config/Cloudinary.js";
import { userModel } from "../model/userSchema.js";

const updateErrorMessage = `oops! couldin't create!`;

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

  updateEditedUserDetails: async (req, res) => {
    try {
      const { email, editedInfo } = req.body;
      const isUpdate = await userModel.updateOne({ email: email }, editedInfo);
      const updatedInfo = await userModel.findOne({ email: email });
      res.status(201).json({ status: true, updatedUserDetails: updatedInfo });
    } catch (error) {
      res.statsu(301).json({ status: false, message: updateErrorMessage });
    }
  },

  updateUserProfilePicture: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        format: "WebP",
        // transformation: [{ width: 195, height: 195 }],
      });
      const userProfileUpdate = await userModel.updateOne(
        { _id: req.body.id },
        { profile: result.secure_url }
      );
      fs.unlinkSync(req.file.path);
      res.status(201).json({ status: true, profile_url: result.secure_url });
    } catch (error) {
      res
        .status(301)
        .json({ status: false, message: `couldn't update porfile` });
    }
  },
};
