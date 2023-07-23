import express from "express";
export const router = express.Router();
import upload from "../Middlewares/Multer.js";
import {
  retriveUserSignUpDetails,
  userAuthentication,
} from "../Middlewares/Authentication.js";
import { authControllers } from "../controllers/AuthController.js";
import { profileControllers } from "../controllers/ProfileControllers.js";
import { compilerControllers } from "../controllers/CompilerControllers.js";
import { qasectionControllers } from "../controllers/QAsessionControllers.js";
import { dashboardControllers } from "../controllers/DashboardControllers.js";
import { notificationControllers } from "../controllers/NotificationControllers.js";

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

//qa session Routes
router.post(
  "/submitqustion",
  userAuthentication,
  qasectionControllers.submitQuestion
);
router.get("/getQuestions", qasectionControllers.getAllQuestions);
router.get("/getquestion", qasectionControllers.getQuestionDetails);
router.post(
  "/addnewcomment",
  userAuthentication,
  qasectionControllers.addNewComment
);
router.post(
  "/addnewanswer",
  userAuthentication,
  qasectionControllers.submitUserAnswer
);
router.post("/addnewvote", userAuthentication, qasectionControllers.addNewVote);
router.get("/getallanswers", qasectionControllers.getAllAnswersForTheQuestion);

// Profile Routes
router.post(
  "/unfollowuser",
  userAuthentication,
  profileControllers.unfollowAUser
);
router.get(
  "/getrandomuser",
  userAuthentication,
  profileControllers.getRandomUserDetails
);
router.post(
  "/updateuserdetails",
  userAuthentication,
  profileControllers.updateEditedUserDetails
);
router.post(
  "/updateimage",
  upload.single("file"),
  userAuthentication,
  profileControllers.updateUserProfilePicture
);
router.post("/followauser", userAuthentication, profileControllers.followAUser);

//notification Controllers
router.get(
  "/getunreadednotifications",
  notificationControllers.getUnreadedNotifications
);

//dashboard services
router.get("/getdashboardinfo", dashboardControllers.getNotificationCounts);
