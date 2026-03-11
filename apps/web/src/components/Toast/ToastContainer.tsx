"use client";

import { CircleAlert, X } from "lucide-react";
import { useToastStore } from "./useToastStore";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-tag-red/20 bg-white px-4 py-3 shadow-lg animate-in"
        >
          <CircleAlert className="h-4 w-4 shrink-0 text-tag-red" />
          <p className="text-sm text-text-primary">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="ml-2 shrink-0 text-text-muted hover:text-text-primary"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
