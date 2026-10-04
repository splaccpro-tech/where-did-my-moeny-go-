import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ClearConfirmModalProps {
  isOpen: boolean;
  itemCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClearConfirmModal: React.FC<ClearConfirmModalProps> = ({
  isOpen,
  itemCount,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-sm bg-white rounded-xl border border-zinc-200 p-5 shadow-lg animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-dialog-title"
      >
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h3 id="clear-dialog-title" className="text-base font-semibold text-zinc-900">
            Clear all expenses?
          </h3>
        </div>

        <p className="text-sm text-zinc-600 mb-5 leading-relaxed">
          This will permanently delete all <strong className="font-semibold text-zinc-900">{itemCount}</strong> recorded expenses from your browser's local storage. This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer shadow-xs"
          >
            Yes, Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
