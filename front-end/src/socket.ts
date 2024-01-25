import { Socket, io } from "socket.io-client";

let socket: Socket;

export const initializeSocket = async (userId: string, sessionCookies: string) : Promise<Socket> => {
    console.log("userId", userId);
    // console.log("sessionCookies", sessionCookies);
  socket = io(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}`, {
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
