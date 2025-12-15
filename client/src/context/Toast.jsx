import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
  warning: "bg-yellow-600 text-white",
};

const Toast = ({ id, type, message, onClose }) => {
  const Icon = toastIcons[type] || Info;

  return (
    <div
      className={` ${toastStyles[type]} animate-slide-in-out flex max-w-md min-w-[300px] items-center gap-3 rounded-lg px-4 py-3 shadow-lg`}
    >
      <Icon size={20} className="shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 rounded p-1 transition-colors hover:bg-white/20"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;