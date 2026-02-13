"use client";

import { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  /** Prevent closing when clicking overlay (e.g. during processing) */
  closeOnOverlayClick?: boolean;
}

export const Modal = ({
  children,
  onClose,
  closeOnOverlayClick = true,
}: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
