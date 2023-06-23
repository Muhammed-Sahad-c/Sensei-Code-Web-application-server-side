import express from "express";
export const router = express.Router();
import { authControllers } from "../controllers/AuthController.js";
import { compilerControllers } from "../controllers/CompilerControllers.js";
import { profileControllers } from "../controllers/ProfileControllers.js";
import { qasectionControllers } from "../controllers/QAsessionControllers.js";
import {
  retriveUserSignUpDetails,
  userAuthentication,
} from "../Middlewares/Authentication.js";

//sign up
router.post("/signupdatasubmission", authControllers.signupDataSubmission);
router.post("/signupGoogle", authControllers.signupWithGoogleDataSubmission);
router.get("/verifyotp", retriveUserSignUpDetails, authControllers.verifyOtp);

// sign in
router.get("/signin", authControllers.signinDataValidation);
router.get("/signinwithgoogle", authControllers.signinWithGoogleDataValidation);

// user Auth
router.get("/getuser", userAuthentication, authControllers.getUserDetails);
router.get("/getotpdetails", authControllers.getDetailsForOtp);

//qa session
router.post(
  "/submitqustion",
  userAuthentication,
  qasectionControllers.submitQuestion
);
router.get("/getQuestions", qasectionControllers.getAllQuestions);

// rpofile routes
router.get("/getrandomuser", profileControllers.getRandomUserDetails);
