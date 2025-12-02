import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
      this.connected = true;
    });

    this.socket.on("connect_error", (error) => {
      console.log("Socket connection error", error.message);
      this.connected = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.connected = false;
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });
  }

  joinDocument(documentId, userInfo) {
    if (!this.socket) {
      throw new Error("Socket not connected");
    }

    return new Promise((resolve, reject) => {
      this.socket.emit("join-document", { documentId, userInfo });

      this.socket.once("document-loaded", (data) => {
        resolve(data);
      });

      this.socket.once("error", (error) => {
        reject(error);
      });
    });
  }

  leaveDocument(documentId) {
    if (!this.socket) return;
    this.socket.emit("leave-document", { documentId });
  }

  sendChanges(documentId, content) {
    if (!this.socket) return;
    this.socket.emit("send-changes", { documentId, content });
  }

  updateCursor(documentId, cursor) {
    if (!this.socket) return;
    this.socket.emit("cursor-update", { documentId, cursor });
  }

  saveDocument(documentId, userId) {
    if (!this.socket) return;
    this.socket.emit("save-document", { documentId, userId });
  }

  updateTitle(documentId, title) {
    if (!this.socket) return;
    this.socket.emit("update-title", { documentId, title });
  }

  onReceiveChanges(callback) {
    if (!this.socket) return;
    this.socket.on("receive-changes", callback);
  }

  onCursorMoved(callback) {
    if (!this.socket) return;
    this.socket.on("cursor-moved", callback);
  }

  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on("user-joined", callback);
  }

  onUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on("user-left", callback);
  }

  onDocumentSaved(callback) {
    if (!this.socket) return;
    this.socket.on("document-saved", callback);
  }

  onTitleUpdated(callback) {
    if (!this.socket) return;
    this.socket.on("title-updated", callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected && this.socket?.connected;
  }
}

const socketService = new SocketService();
export default socketService;
