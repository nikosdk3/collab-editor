import { Server, Socket } from "socket.io";
import { Document } from "../models/index.js";

/**
 * Handle document-related events
 * @param {Socket} socket - Socket.io socket instance
 * @param {Server} io - Socket.io server instance
 */
export const handleDocumentSocket = (socket, io) => {
  /**
   * Join a document room
   */
  socket.on("join-document", async (data) => {
    try {
      const { documentId, userInfo } = data;

      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id && room.startsWith("doc-")) {
          socket.leave(room);
        }
      });

      const roomName = `doc-${documentId}`;
      socket.join(roomName);

      const document = await Document.findOrCreate(documentId);

      const user = document.addActiveUser({
        socketId: socket.id,
        userId: userInfo?.userId || "anonymous",
        username: userInfo?.username || "Anonymous User",
        color: userInfo?.color,
      });

      await document.save();

      socket.emit("document-loaded", {
        document: {
          _id: document._id,
          title: document.title,
          content: document.content,
          currentVersion: document.currentVersion,
        },
        activeUsers: document.activeUsers,
        you: user,
      });

      socket.to(roomName).emit("user-joined", {
        user,
        activeUsers: document.activeUsers,
      });

      console.log(`User ${socket.id} joined document ${documentId}`);
    } catch (error) {
      console.error(`Error joining document:`, error);
      socket.emit("error", {
        message: "Failed to join document",
        error: error.message,
      });
    }
  });

  /**
   * Handle document content changes
   */
  socket.on("send-changes", async (data) => {
    try {
      const { documentId, content } = data;

      socket.to(`doc-${documentId}`).emit("receive-changes", {
        content,
        userId: socket.id,
      });

      const document = await Document.findById(documentId);
      if (document) {
        document.content = content;
        await document.save();
      }
    } catch (error) {
      console.error("Error sending changes:", error);
      socket.emit("error", {
        message: "Failed to send changes",
        error: error.message,
      });
    }
  });

  /**
   * Handle cursor position updated
   */
  socket.on("cursor-update", async (data) => {
    try {
      const { documentId, cursor } = data;

      const document = await Document.findById(documentId);
      if (document) {
        document.updateUserCursor(socket.id, cursor);
        await document.save();

        socket.to(`doc-${documentId}`).emit("cursor-moved", {
          socketId: socket.id,
          cursor,
        });
      }
    } catch (error) {
      console.error("Error updating cursor:", error);
    }
  });

  /**
   * Handle manual save request
   */
  socket.on("save-document", async (data) => {
    try {
      const { documentId, userId } = data;

      const document = await Document.findById(documentId);
      if (!document) {
        return socket.emit("error", {
          message: "Document not found",
        });
      }

      const newVersion = document.saveVersion(userId);
      await document.save();

      io.to(`doc-${documentId}`).emit("document-saved", {
        versionNumber: document.currentVersion - 1,
        timestamp: newVersion.createdBy,
      });

      console.log(
        `Document ${documentId} saved as version ${newVersion.versionNumber}`
      );
    } catch (error) {
      console.error("Error saving document:", error);
      socket.emit("error", {
        message: "Failed to save document",
        error: error.message,
      });
    }
  });

  /**
   * Handle title updates
   */
  socket.on("update-title", async (data) => {
    try {
      const { documentId, title } = data;

      const document = await Document.findById(documentId);
      if (document) {
        document.title = title;
        await document.save();

        io.to(`doc-${documentId}`).emit("title-updated", {
          title,
          userId: socket.id,
        });
      }
    } catch (error) {
      console.error("Error updating title:", error);
      socket.emit("error", {
        message: "Failed to update title",
        error: error.message,
      });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const documents = await Document.find({
        "activeUsers.socketId": socket.id,
      });

      for (const document of documents) {
        const removedUser = document.removeActiveUser(socket.id);
        await document.save();

        if (removedUser) {
          socket.to(`doc-${document._id}`).emit("user-left", {
            socketId: socket.id,
            username: removedUser.username,
            activeUsers: document.activeUsers,
          });
        }
      }

      console.log(`User ${socket.id} disconnected`);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });

  socket.on("leave-document", async (data) => {
    try {
      const { documentId } = data;

      const document = await Document.findById(documentId);
      if (document) {
        const removedUser = document.removeActiveUser(socket.id);
        await document.save();

        socket.leave(`doc-${documentId}`);

        socket.to(`doc-${documentId}`).emit("user-left", {
          socketId: socket.id,
          username: removedUser.username,
          activeUsers: document.activeUsers,
        });
      }
    } catch (error) {
      console.error("Error leaving document:", error);
    }
  });
};
