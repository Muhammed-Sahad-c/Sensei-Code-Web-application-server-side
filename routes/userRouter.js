import express, { Router } from "express";
export const router = express.Router();

router.get("/test", (req, res) => {
  console.log(`api call got it`);
});
 