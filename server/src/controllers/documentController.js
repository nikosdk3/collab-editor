import { DEFAULT_DOCUMENT_CONTENT } from "../constants.js";
import { Document } from "../models/index.js";

/**
 * Get all documents
 * @route GET /api/documents
 */
export const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .select("title createdBy createdAt updatedAt currentVersion")
      .sort({ updatedAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

/**
 * Get a single document by its ID
 * @route GET /api/documents/:id
 */
export const getDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
      error: error.message,
    });
  }
};

/**
 * Create a new document
 * @route POST /api/documents
 */
export const createDocument = async (req, res) => {
  try {
    const { title, content, createdBy } = req.body;

    const document = await Document.create({
      title: title || "Untitled Document",
      content: content || DEFAULT_DOCUMENT_CONTENT,
      createdBy: createdBy || "anonymous",
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create document",
      error: error.message,
    });
  }
};

/**
 * Update a document
 * @route PUT /api/documents/:id
 */
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (title !== undefined) {
      document.title = title;
    }

    if (content !== undefined) {
      document.content = content;
    }

    await document.save();

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update document",
      error: error.message,
    });
  }
};

/**
 * Delete a document
 * @route DELETE /api/documents/:id
 */
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
      error: error.message,
    });
  }
};

/**
 * Save a new version of the document
 * @route POST /api/documents/:id/versions
 */
export const saveDocumentVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const newVersion = document.saveVersion(userId);
    await document.save();

    res.status(201).json({
      success: true,
      message: "Version saved successfully",
      data: {
        version: newVersion,
        currentVersion: document.currentVersion,
      },
    });
  } catch (error) {
    console.error("Error saving version:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save version",
      error: error.message,
    });
  }
};

/**
 * Get all versions of a document
 * @route GET /api/documents/:id/versions
 */
export const getDocumentVersions = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findById(id).select("versions");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      count: document.versions.length,
      data: document.versions.reverse(),
    });
  } catch (error) {
    console.error("Error fetching versions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch versions",
      error: error.message,
    });
  }
};

/**
 * Restore a specific version of a document
 * @route POST /api/documents/:id/versions/:versionNumber/restore
 */
export const restoreDocumentVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;
    
    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const restoredVersion = document.restoreVersion(parseInt(versionNumber));
    await document.save();

    res.status(200).json({
      success: true,
      message: "Version changed successfully",
      data: {
        restoredVersion: restoredVersion.versionNumber,
        content: document.content,
      },
    });
  } catch (error) {
    console.error("Error restoring version", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore version",
      error: error.message,
    });
  }
};
