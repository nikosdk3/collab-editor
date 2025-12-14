import { useEffect, useState } from "react";
import { AlertCircle, History, Loader2, X } from "lucide-react";
import VersionItem from "./VersionItem";
import { ConfirmDialog } from "../common";
import { documentService } from "../../services";

const VersionHistory = ({ isOpen, onClose, documentId, onVersionRestored }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(null);

  useEffect(() => {
    if (isOpen && documentId) {
      fetchVersions();
    }
  }, [isOpen, documentId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await documentService.getVersions(documentId);
      setVersions(response.data || []);
    } catch (err) {
      console.error("Error fetching versions:", err);
      setError("Failed to load version history");
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreClick = (versionNumber) => {
    setConfirmRestore(versionNumber);
  };

  const handleRestoreConfirm = async () => {
    if (!confirm) return;

    try {
      setRestoring(true);
      const response = await documentService.restoreVersion(
        documentId,
        confirmRestore,
      );

      if (response.success) {
        if (onVersionRestored) {
          onVersionRestored(response.data.content);
        }

        await fetchVersions();

        onClose();
      }
    } catch (err) {
      console.error("Error restoring version:", err);
      setError("Failed to restore version");
    } finally {
      setRestoring(false);
      setConfirmRestore(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <History size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && versions.length === 0 && (
            <div className="py-12 text-center">
              <History size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No versions saved yet</p>
            </div>
          )}

          {!loading && !error && versions.length > 0 && (
            <div className="space-y-3">
              {versions.map((version) => (
                <VersionItem
                  key={version._id || version.versionNumber}
                  version={version}
                  onRestore={handleRestoreClick}
                  isRestoring={restoring}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmRestore}
        onClose={() => setConfirmRestore(null)}
        onConfirm={handleRestoreConfirm}
        title="Restore Version?"
        message={`Are you sure you want to restore Version ${confirmRestore}? This will replace the current content with this version.`}
        confirmText="Restore"
        cancelText="Cancel"
        isDestructive={false}
      />
    </>
  );
};

export default VersionHistory;
