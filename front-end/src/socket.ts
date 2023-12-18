import { Socket, io } from "socket.io-client";

let socket: Socket;

export const initializeSocket = (userId: string, sessionCookies: string) => {
    console.log("userId", userId);
    console.log("sessionCookies", sessionCookies);
  socket = io("http://localhost:3000", {
    auth: {
      sessionCookies,
    },
    query: { userId },
  });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Must call initializeSocket before getSocket");
  }
  return socket;
};
