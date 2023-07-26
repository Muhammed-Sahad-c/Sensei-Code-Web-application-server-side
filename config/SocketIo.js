import { Server } from "socket.io";

export const cofigureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      optionsSuccessStatus: 200,
      credentials:true,
    },
  });
  return io;
};
