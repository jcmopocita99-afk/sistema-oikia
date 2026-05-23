"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-[var(--oikia-radius)] border border-[var(--oikia-border)] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between border-b border-[var(--oikia-border)] px-5 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--oikia-primary)]">
            {title}
          </h2>
          <Button variant="ghost" type="button" onClick={onClose} aria-label="Cerrar">
            ✕
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
