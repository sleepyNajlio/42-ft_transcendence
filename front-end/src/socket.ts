import { Socket, io } from "socket.io-client";

let socket: Socket;

export const initializeSocket = async (userId: string, sessionCookies: string) : Promise<Socket> => {
    console.log("userId", userId);
    // console.log("sessionCookies", sessionCookies);
  socket = io("http://localhost:3000", {
    auth: {
      sessionCookies,
    },
    query: { userId },
  });
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Must call initializeSocket before getSocket");
  }
  return socket;
};
