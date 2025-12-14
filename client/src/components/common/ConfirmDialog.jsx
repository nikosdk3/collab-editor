import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${isDestructive ? "bg-red-100" : "bg-blue-100"}`}
          >
            <AlertTriangle
              size={20}
              className={isDestructive ? "text-red-600" : "text-blue-600"}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>

          <div
            onClick={onClose}
            className="shrink-0 rounded p-1 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-lg px-4 py-2 transition-colors ${
              isDestructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
