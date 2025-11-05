import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    content: {
      type: Object,
      required: true,
    },
    createdBy: {
      type: String,
      default: "anonymous",
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: true, timestamps: true }
);

export default versionSchema;
