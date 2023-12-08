import io from "socket.io-client";

export const socket = io("http://192.168.3.169:3000/events");