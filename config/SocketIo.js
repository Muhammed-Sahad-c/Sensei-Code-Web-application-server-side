import {} from "dotenv/config";
import { Server } from "socket.io";

export const cofigureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_SIDE_URL,
      methods: ["GET", "POST"],
      optionsSuccessStatus: 200,
      credentials: true,
    },
  });
  return io;
};
