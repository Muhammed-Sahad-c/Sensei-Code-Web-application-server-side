import express from "express";
export const router = express.Router();
import { authControllers } from "../controllers/AuthController.js";
import { retriveUserSignUpDetails, userAuthentication } from "../Middlewares/Authentication.js";
//sign up
router.post("/signupdatasubmission", authControllers.signupDataSubmission);
router.post("/signupGoogle", authControllers.signupWithGoogleDataSubmission);
router.get("/verifyotp", retriveUserSignUpDetails,authControllers.verifyOtp);

// sign in
router.get("/signin", authControllers.signinDataValidation);
router.get("/signinwithgoogle", authControllers.signinWithGoogleDataValidation);

// user Auth
router.get("/getuser", userAuthentication, authControllers.getUserDetails);
router.get('/getotpdetails',authControllers.getDetailsForOtp);