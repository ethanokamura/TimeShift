"use client";

import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
};

export function DeleteModal({ isOpen, onClose, onDelete, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface p-4 rounded flex flex-col w-fit h-fit items-center justify-center text-center">
        <div>
          {children}
        </div>
        <div className="flex gap-5">
          <button 
            className="bg-destructive"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete != null) onDelete();
            }}>
              Delete    
          </button>
          <button className="bg-background text-text" onClick={onClose}>
              Cancel    
          </button>
        </div>
      </div>
    </div>
  );
}
