import { Clock, RotateCcw, User } from "lucide-react";
import { formatDate } from "../../utils/helpers";

const VersionItem = ({ version, onRestore, isRestoring }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-500">
      <div className="mb-3 flex items-start justify-between">
        <h4 className="font-semibold text-gray-900">
          Version {version.versionNumber}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          <span>{formatDate(version.createdAt)}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <User size={14} />
          <span>{version.createdBy || "Anonymous"}</span>
        </div>
      </div>

      <button
        onClick={() => onRestore(version.versionNumber)}
        disabled={isRestoring}
        className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        title="Restore this version"
      >
        <RotateCcw size={14} />
        <span>Restore</span>
      </button>
    </div>
  );
};

export default VersionItem;
