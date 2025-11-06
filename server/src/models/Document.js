import mongoose from "mongoose";
import { DEFAULT_DOCUMENT_CONTENT, MAX_VERSIONS } from "./constants";
import documentSchema from "./schemas/documentSchema";

// Indexes

documentSchema.index({ updatedAt: -1 });
documentSchema.index({ createdAt: -1 });

// Instance Methods

documentSchema.methods.saveVersion = function (userId = "anonymous") {
  const newVersion = {
    content: JSON.parse(JSON.stringify(this.content)),
    createdBy: userId,
    versionNumber: this.currentVersion,
  };

  this.versions.push(newVersion);

  if (this.versions.length > MAX_VERSIONS) {
    this.versions = this.versions.slice(-MAX_VERSIONS);
  }

  this.currentVersion += 1;

  return newVersion;
};

documentSchema.methods.addActiveUser = function (userInfo) {
  const userIndex = this.activeUsers.findIndex(
    (user) => user.socketId === userInfo.socketId
  );

  if (userIndex === -1) {
    this.activeUsers.push({
      socketId: userInfo.socketId,
      userId: userInfo.userId || "anonymous",
      username: userInfo.username || "Anonymous User",
      color: userInfo.color || this._generateUserColor(),
      cursor: userInfo.cursor || null,
    });
  } else {
    this.activeUsers[userIndex] = {
      ...this.activeUsers[userIndex].toObject(),
      ...userInfo,
    };
  }

  return this.activeUsers[
    userIndex === -1 ? this.activeUsers.length - 1 : userIndex
  ];
};

documentSchema.methods.removeActiveUser = function (socketId) {
  const removedUser = this.activeUsers.find(
    (user) => user.socketId === socketId
  );
  this.activeUsers = this.activeUsers.filter(
    (user) => user.socketId !== socketId
  );
  return removedUser;
};

documentSchema.methods.updateUserCursor = function (socketId, cursor) {
  const user = this.activeUsers.find((user) => user.socketId === socketId);
  if (user) {
    user.cursor = cursor;
  }
  return user;
};

documentSchema.methods.restoreVersion = function (versionNumber) {
  const version = this.versions.find(
    (version) => version.versionNumber === versionNumber
  );

  if (!verison) {
    throw new Error(`Version ${versionNumber} not found`);
  }

  this.content = JSON.parse(JSON.stringify(version.content));

  return version;
};

// Private Helper Methods

documentSchema.methods._generateUserColor = function () {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B739",
    "#52B788",
    "#E76F51",
    "#2A9D8F",
  ];

  return colors[this.activeUsers.length % colors.length];
};

// Static Methods

documentSchema.statics.findOrCreate = async function (documentId) {
  let document = await this.findById(documentId);

  if (!document) {
    document = await this.create({
      _id: documentId,
      title: "Untitled Document",
      content: DEFAULT_DOCUMENT_CONTENT,
    });
  }

  return document;
};

const Document = mongoose.model("Document", documentSchema);

export default Document;
