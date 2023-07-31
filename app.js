import http from "http";
import cors from "cors";
import express from "express";
import {} from "dotenv/config";
import bodyParser from "body-parser";
import { cofigureSocket } from "./config/SocketIo.js";
import { connectToDataBase } from "./config/database.js";
import { router as userRouter } from "./routes/userRouter.js";
import { router as adminRouter } from "./routes/adminRouter.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_SIDE_URL,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.use("/admin", adminRouter);

const server = http.createServer(app);
const io = cofigureSocket(server);

let onlineUsers = [];

const addUser = (email, socketId) => {
  !onlineUsers.some((user) => user.email === email) &&
    onlineUsers.push({ email, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUserSocketId = (email) => {
  let online = " ";
  onlineUsers.map((details) => {
    if (details.email === email) online = details;
  });
  return online;
};

io.on("connection", (socket) => {
  socket.on("newuser", (email) => {
    addUser(email, socket.id);
    // console.log("----------------------------------------------- added");
    // onlineUsers.map((x) => console.log(x.email + "    " + x.socketId));
    // console.log("-----------------------------------------------");
  });
  socket.on("sendnotifications", (data) => {
    const reciever = getUserSocketId(data.ownerEmail);
    const { time, questionId, comment, author } = data;
    socket.to(reciever?.socketId).emit("recievenotification", {
      NotificationType: "COMMENT",
      content: {
        commentedUser: author,
        comment: comment,
        id: questionId,
        time: time.join(" "),
      },
      status: true,
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    // console.log("----------------------------------------------- removed");
    // onlineUsers.map((x) => console.log(x.email + "    " + x.socketId));
    // console.log("-----------------------------------------------");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server started...`);
  console.log(`running on port ${process.env.PORT}...`);
  connectToDataBase();
});
