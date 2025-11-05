import mongoose from "mongoose";

const activeUserSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: "anonymous",
    },
    username: {
      type: String,
      default: "Anonymous User",
    },
    color: {
      type: String,
      default: "#000000",
    },
    cursor: {
      type: Object,
      default: null,
    },
  },
  { _id: false, timestamps: true }
);

export default activeUserSchema;
