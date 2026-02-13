"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmDeleteModalProps {
  /** Modal heading (e.g. "Delete conversation") */
  title: string;
  /** Body message */
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal onClose={onCancel}>
      <h3
        id="delete-dialog-title"
        className="text-sm font-semibold text-stone-900 dark:text-slate-100 mb-1"
      >
        {title}
      </h3>
      <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
        {message}
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
