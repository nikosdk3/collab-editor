import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Clock, FileText, Loader2, Plus } from "lucide-react";
import { documentService } from "../services";
import { formatDate } from "../utils/helpers";
import { Header } from "../components/Header";

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await documentService.getAllDocuments();
      setDocuments(response.data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      setCreating(true);
      const newDoc = await documentService.createDocument({
        title: "Untitled Document",
        createdBy: "anonymous",
      });

      if (newDoc.data && newDoc.data._id) {
        navigate(`/document/${newDoc.data._id}`);
      }
    } catch (err) {
      console.error("Error creating document:", err);
      setError("Failed to create document. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Your Documents
          </h2>
          <p className="text-gray-600">
            Create and collaborate on documents in real-time
          </p>
        </div>

        <button
          onClick={handleCreateDocument}
          disabled={creating}
          className="mb-8 flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Create new document</span>
            </>
          )}
        </button>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={40} className="animate-spin text-blue-600" />
          </div>
        )}

        {!loading && !error && (
          <>
            {documents.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  No documents yet
                </h3>
                <p className="text-gray-600">
                  Create your first document to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <Link
                    key={doc._id}
                    to={`/document/${doc._id}`}
                    className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <FileText size={24} className="shrink-0 text-blue-600" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-gray-900">
                          {doc.title || "Untitled Document"}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>Updated {formatDate(doc.updatedAt)}</span>
                    </div>

                    {doc.currentVersion > 1 && (
                      <div className="mt-3 text-sm text-gray-600">
                        Version {doc.currentVersion - 1}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
