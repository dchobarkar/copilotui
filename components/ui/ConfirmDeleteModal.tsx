"use client";

import { useEffect } from "react";

interface ConfirmDeleteModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  title,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 shadow-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="delete-dialog-title"
          className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1"
        >
          Delete conversation
        </h3>
        <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
          Are you sure you want to delete &quot;{title}&quot;? This cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-sm text-stone-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
