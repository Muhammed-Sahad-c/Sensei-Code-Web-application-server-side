import cors from "cors";
import express from "express";
import {} from "dotenv/config";
import bodyParser from "body-parser";
import { connectToDataBase } from "./config/database.js";
import { router as userRouter } from "./routes/userRouter.js";
import { router as adminRouter } from "./routes/adminRouter.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`server started...`);
  console.log(`running on port ${process.env.PORT}...`);
  connectToDataBase();
});
