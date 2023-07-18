import express from "express";
export const router = express.Router();
import upload from "../Middlewares/Multer.js";
import { authControllers } from "../controllers/AuthController.js";
import { profileControllers } from "../controllers/ProfileControllers.js";
import { compilerControllers } from "../controllers/CompilerControllers.js";
import { qasectionControllers } from "../controllers/QAsessionControllers.js";
import {
  retriveUserSignUpDetails,
  userAuthentication,
} from "../Middlewares/Authentication.js";
import { notificationControllers } from "../controllers/NotificationControllers.js";
import { dashboardControllers } from "../controllers/DashboardControllers.js";

//sign up
router.post("/signupdatasubmission", authControllers.signupDataSubmission);
router.post("/signupGoogle", authControllers.signupWithGoogleDataSubmission);
router.get("/verifyotp", retriveUserSignUpDetails, authControllers.verifyOtp);

// sign in
router.get("/signin", authControllers.signinDataValidation);
router.get("/signinwithgoogle", authControllers.signinWithGoogleDataValidation);

// user Auth
router.get("/getotpdetails", authControllers.getDetailsForOtp);
router.get("/getuser", userAuthentication, authControllers.getUserDetails);

//qa session
router.post(
  "/submitqustion",
  userAuthentication,
  qasectionControllers.submitQuestion
);
router.get("/getQuestions", qasectionControllers.getAllQuestions);
router.get("/getquestion", qasectionControllers.getQuestionDetails);
router.post("/addnewcomment", qasectionControllers.addNewComment);

// pofile routes
router.get("/getrandomuser", profileControllers.getRandomUserDetails);
router.post("/updateuserdetails", profileControllers.updateEditedUserDetails);
router.post(
  "/updateimage",
  upload.single("file"),
  userAuthentication,
  profileControllers.updateUserProfilePicture
);
router.post("/followauser", profileControllers.followAUser);

//notification Controllers
router.get(
  "/getunreadednotifications",
  notificationControllers.getUnreadedNotifications
);

//dashboard services
router.get("/getdashboardinfo", dashboardControllers.getNotificationCounts);
