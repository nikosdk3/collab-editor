import express from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocument,
  getDocumentVersions,
  restoreDocumentVersion,
  saveDocumentVersion,
  updateDocument,
} from "../controllers/documentController.js";

const router = express.Router();

// CRUD
router.get("/", getAllDocuments);
router.get("/:id", getDocument);
router.post("/", createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

// Version management
router.post("/:id/versions", saveDocumentVersion);
router.get("/:id/versions", getDocumentVersions);
router.post("/:id/versions/:versionNumber/restore", restoreDocumentVersion);

export default router;
