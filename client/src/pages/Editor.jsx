import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CollaborativeEditor } from "../components/Editor";
import { Header } from "../components/Header";
import { AlertCircle, Edit2, History, Loader2 } from "lucide-react";
import { documentService, socketService } from "../services";
import {
  generateId,
  generateRandomColor,
  generateRandomUsername,
} from "../utils/helpers";
import VersionHistory from "../components/VersionHistory/VersionHistory";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [userInfo] = useState(() => ({
    userId: generateId(),
    username: generateRandomUsername(),
    color: generateRandomColor(),
  }));

  useEffect(() => {
    if (!userInfo) return;

    const connectAndJoinDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        socketService.connect();
        setSocketConnected(true);

        const response = await documentService.getDocument(id);

        if (!response.success) {
          throw new Error("Document not found");
        }

        const docData = response.data;
        setDocument(docData);
        setTitle(docData.title || "Untitled Document");

        const joinData = await socketService.joinDocument(id, userInfo);

        console.log("Joined document:", joinData);

        if (joinData.document) {
          setDocument(joinData.document);
          setTitle(joinData.document.title || "Untitled Document");
        }
      } catch (err) {
        console.error("Error loading document:", err);
        setError(err.message || "Failed to load document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    connectAndJoinDocument();

    return () => {
      if (socketConnected) {
        socketService.leaveDocument(id);
        socketService.disconnect();
      }
    };
  }, [id, userInfo, socketConnected]);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== document?.title) {
      socketService.updateTitle(id, title.trim());
    }
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setTitle(document?.title || "Untitled Document");
      setIsEditingTitle(false);
    }
  };

  const handleVersionRestored = (content) => {
    setDocument((prev) => ({
      ...prev,
      content,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton />
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div className="text-center">
            <Loader2
              className="mx-auto mb-4 animate-spin text-blue-600"
              size={48}
            />
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showBackButton />
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Error Loading Document
            </h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyPress}
                className="w-full border-b-2 border-blue-600 bg-transparent text-3xl font-bold text-gray-900 focus:outline-none"
                autoFocus
              />
            ) : (
              <div
                className="group flex cursor-pointer items-center gap-2"
                onClick={() => setIsEditingTitle(true)}
              >
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <Edit2
                  size={20}
                  className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setShowVersionHistory(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-50"
          >
            <History size={20} />
            <span>Version History</span>
          </button>
        </div>

        {document && (
          <CollaborativeEditor
            documentId={id}
            initialContent={document.content}
            initialTitle={document.title}
            onTitleChange={handleTitleChange}
          />
        )}

        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          documentId={id}
          onVersionRestored={handleVersionRestored}
        />
      </div>
    </div>
  );
};

export default Editor;
