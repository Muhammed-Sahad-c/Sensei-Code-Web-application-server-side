import express from "express";
export const router = express.Router();
import upload from "../Middlewares/Multer.js";
import { authControllers } from "../controllers/AuthController.js";
import { profileControllers } from "../controllers/ProfileControllers.js";
import { qasectionControllers } from "../controllers/QAsessionControllers.js";
import { dashboardControllers } from "../controllers/DashboardControllers.js";
import { notificationControllers } from "../controllers/NotificationControllers.js";
import { retriveUserSignUpDetails, userAuthentication} from "../Middlewares/Authentication.js";


// user Auth
router.get("/signin", authControllers.signinDataValidation);
router.get("/getotpdetails", authControllers.getDetailsForOtp);
router.get("/getuser", userAuthentication, authControllers.getUserDetails);
router.post("/signupdatasubmission", authControllers.signupDataSubmission);
router.post("/signupGoogle", authControllers.signupWithGoogleDataSubmission);
router.get("/verifyotp", retriveUserSignUpDetails, authControllers.verifyOtp);
router.get("/signinwithgoogle", authControllers.signinWithGoogleDataValidation);

//qa session Routes
router.get("/getQuestions", qasectionControllers.getAllQuestions);
router.get("/getquestion", qasectionControllers.getQuestionDetails);
router.get("/getallanswers", qasectionControllers.getAllAnswersForTheQuestion);
router.post("/addnewvote", userAuthentication, qasectionControllers.addNewVote);
router.post("/addnewcomment",userAuthentication, qasectionControllers.addNewComment);
router.post("/submitqustion", userAuthentication, qasectionControllers.submitQuestion);
router.post("/addnewanswer", userAuthentication, qasectionControllers.submitUserAnswer);
router.post("/removeaccepted", userAuthentication, qasectionControllers.removeAcceptedAnswer); 
router.post("/acceptananswer", userAuthentication, qasectionControllers.updateAcceptedAnswer); 
router.post("/updateuseroppose", userAuthentication, qasectionControllers.updateUserOpposeVote);
router.post("/updateusersupport",userAuthentication, qasectionControllers.updateUserSupportVote);

// Profile Routes
router.get("/getrandomuser", profileControllers.getRandomUserDetails);
router.post("/followauser", userAuthentication, profileControllers.followAUser);
router.post("/unfollowuser", userAuthentication, profileControllers.unfollowAUser);
router.post("/updateuserdetails", userAuthentication, profileControllers.updateEditedUserDetails);
router.post("/updateimage", upload.single("file"), userAuthentication, profileControllers.updateUserProfilePicture);

//notification Controllers
router.get( "/getunreadednotifications", notificationControllers.getUnreadedNotifications);
router.post("/deletenotifications", userAuthentication, notificationControllers.deleteNotifications);

//dashboard services
router.get("/getdashboardinfo", dashboardControllers.getNotificationCounts);
