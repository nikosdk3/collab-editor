import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import { debounce } from "../../utils/helper";
import socketService from "../../services/socket";
import ActiveUsers from "./ActiveUsers";
import { Clock, Loader2, Save } from "lucide-react";

const CollaborativeEditor = ({
  documentId,
  initialContent,
  initialTitle,
  onTitleChange,
}) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "<p>Start typing...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      sendChanges(editor.getJSON());
    },
  });

  const debouncedSendChanges = useRef(
    debounce((docId, content) => {
      socketService.sendChanges(docId, content);
    }, 300),
  ).current;

  const sendChanges = useCallback(
    (content) => {
      debouncedSendChanges(documentId, content);
    },
    [documentId, debouncedSendChanges],
  );

  const handleAutoSave = useCallback(async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      socketService.saveDocument(
        documentId,
        currentUser?.userId || "anonymous",
      );
      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [documentId, currentUser, editor]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  });

  // Set up Socket.io listeners
  useEffect(() => {
    if (!editor) return;

    const handleReceiveChanges = ({ content, userId }) => {
      if (userId === socketService.getSocket()?.id) return;

      const currentSelection = editor.state.selection;
      editor.commands.setContent(content, { emitUpdate: false });

      try {
        editor.commands.setTextSelection(currentSelection);
      } catch (e) {
        // Cursor position no longer valid, ignore
      }
    };

    const handleUserJoined = ({ user, activeUsers }) => {
      console.log("User joined:", user);
      setActiveUsers(activeUsers);
    };

    const handleUserLeft = ({ socketId, activeUsers }) => {
      console.log("User left:", socketId);
      setActiveUsers(activeUsers);
    };

    const handleDocumentSaved = ({ versionNumber, timestamp }) => {
      console.log("Document saved:", versionNumber);
      setLastSaved(new Date(timestamp));
    };

    const handleTitleUpdated = ({ title, userId }) => {
      if (userId !== socketService.getSocket()?.id && onTitleChange) {
        onTitleChange(title);
      }
    };

    socketService.onReceiveChanges(handleReceiveChanges);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);
    socketService.onDocumentSaved(handleDocumentSaved);
    socketService.onTitleUpdate(handleTitleUpdated);

    return () => {
      socketService.off("receive-changes", handleReceiveChanges);
      socketService.off("user-joined", handleUserJoined);
      socketService.off("user-left", handleUserLeft);
      socketService.off("document-saved", handleDocumentSaved);
      socketService.off("title-updated", handleTitleUpdated);
    };
  }, [editor, documentId, onTitleChange]);

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <ActiveUsers users={activeUsers} currentUser={currentUser} />

      <Toolbar editor={editor} />

      <EditorContent editor={editor} />

      <div className="flex items-center justify-between border-t border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-blue-600">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Clock size={16} />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </>
          ) : (
            <>
              <Clock size={16} />
              <span>No changes yet</span>
            </>
          )}
        </div>
        <button
          onClick={handleAutoSave}
          className="flex items-center gap-2 rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving}
        >
          <Save size={16} />
          <span>Save Now</span>
        </button>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
