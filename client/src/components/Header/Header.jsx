import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const Header = ({ showBackButton = false }) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate("/")}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                title="Back to Home"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <FileText size={24} className="text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Collaborative Editor
              </h1>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
