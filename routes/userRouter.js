import express from "express";
import { authControllers } from "../controllers/AuthController.js";
export const router = express.Router();

//sign up
router.post("/signupdatasubmission", authControllers.signupDataSubmission);
router.post("/signupGoogle", authControllers.signupWithGoogleDataSubmission);
router.get("/verifyotp", authControllers.verifyOtp);

// sign in
router.get("/signin", authControllers.signinDataValidation);
router.get("/signinwithgoogle",authControllers.signinWithGoogleDataValidation);
 