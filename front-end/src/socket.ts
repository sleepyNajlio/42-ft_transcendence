import { Socket, io } from "socket.io-client";

let socket: Socket;

export const initializeSocket = (userId: string) => {
    console.log("userId", userId);
  socket = io("http://192.168.3.169:3000", {
    query: { userId },
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Must call initializeSocket before getSocket");
  }
  return socket;
};
