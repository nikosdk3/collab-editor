import api from "./api";

const documentService = {
  getAllDocuments: async () => {
    try {
      const response = await api.get("/documents");
      return response;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  getDocument: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw error;
    }
  },

  createDocument: async (data) => {
    try {
      const response = await api.post("/documents", data);
      return response;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  },

  updateDocument: async (data) => {
    try {
      const response = await api.put("/documents", data);
      return response;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  },

  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/documents/${documentId}`);
      return response;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  saveVersion: async (documentId, userId) => {
    try {
      const response = await api.post(`/documents/${documentId}/versions`, {
        userId,
      });
      return response;
    } catch (error) {
      console.error("Error saving version:", error);
      throw error;
    }
  },

  getVersions: async (documentId) => {
    try {
      const response = await api.get(`/documents/${documentId}/versions`);
      return response;
    } catch (error) {
      console.error("Error fetching versions:", error);
      throw error;
    }
  },

  restoreVersion: async (documentId, versionId) => {
    try {
      const response = await api.post(
        `/documents/${documentId}/versions/${versionId}/restore`,
      );
      return response;
    } catch (error) {
      console.error("Error restoring version:", error);
      throw error;
    }
  },
};

export default documentService;
