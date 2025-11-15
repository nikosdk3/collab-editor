import { Server } from "socket.io";
import { handleDocumentSocket } from "./documentSocket.js";

/**
 * Initialize Socket.io handlers
 * @param {Server} io - Socket.io server instance
 */
export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    handleDocumentSocket(socket, io);

    socket.on("error", (error) => {
      console.error("Socket error", error);
    });
  });

  console.log("Socket.io initialized");
};
