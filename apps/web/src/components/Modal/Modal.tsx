"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useModal } from "./hooks/useModal";

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  const [open, setOpen] = useState(false);
  useModal(onClose);

  useEffect(() => {
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-200 ${open ? "bg-black/40" : "bg-transparent"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>
            <button
              type="button"
              className="rounded p-1 text-text-muted transition hover:bg-column-hover hover:text-text-secondary"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
