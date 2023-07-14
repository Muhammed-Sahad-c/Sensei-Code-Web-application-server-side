import cors from "cors";
import express from "express";
import {} from "dotenv/config";
import bodyParser from "body-parser";
import { connectToDataBase } from "./config/database.js";
import { router as userRouter } from "./routes/userRouter.js";
import { router as adminRouter } from "./routes/adminRouter.js";
import { Server } from "socket.io";
import http from "http";
import { cofigureSocket } from "./config/SocketIo.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.use("/admin", adminRouter);

const server = http.createServer(app);
const io = cofigureSocket(server);

let onlineUsers = [];

const addUser = (email, socketId) => {
  let online = onlineUsers.some((user) => {
    return user.email === email;
  });
  if (online === false) onlineUsers.push({ email, socketId });
};

const removeUser = (socketId) => {
  let online = onlineUsers.some((user, index) => {
    if (user.socketId === socketId) return index;
  });
  onlineUsers.splice(online, 1);
};

io.on("connection", (socket) => {
  socket.on("newuser", (email) => {
    addUser(email, socket.id);
    console.log("-----------------------------------------------");
    onlineUsers.map((x) => console.log(x.email + "    " + x.socketId));
    console.log("-----------------------------------------------");
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("----------------------------------------------- removed");
    onlineUsers.map((x) => console.log(x.email + "    " + x.socketId));
    console.log("-----------------------------------------------");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server started...`);
  console.log(`running on port ${process.env.PORT}...`);
  connectToDataBase();
});
