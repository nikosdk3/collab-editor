import mongoose from "mongoose";
import activeUserSchema from "./activeUserSchema";
import versionSchema from "./versionSchema";

const DEFAULT_DOCUMENT_CONTENT = {
  type: "doc",
  content: [],
};

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
      trim: true,
      maxlength: 200,
    },
    content: {
      type: Object,
      default: DEFAULT_DOCUMENT_CONTENT,
      required: true,
    },
    activeUsers: {
      type: [activeUserSchema],
      default: [],
    },
    versions: {
      type: [versionSchema],
      default: [],
    },
    currentVersion: {
      type: Number,
      default: 1,
      min: 1,
    },
    createdBy: {
      type: String,
      default: "anonymous",
      trim: true,
    },
  },
  { timestamps: true }
);

export default documentSchema;