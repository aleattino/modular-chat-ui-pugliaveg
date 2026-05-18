import React from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  const trapRef = useFocusTrap(isOpen, onCancel);

  if (!isOpen) return null;

  const confirmColors = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-amber-600 hover:bg-amber-700 text-white';

  const accentBorder = variant === 'danger'
    ? 'border-red-200 dark:border-red-800/40'
    : 'border-amber-200 dark:border-amber-800/40';

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onCancel}
      style={{ animation: 'fadeIn 60ms ease-out' }}
    >
      <div
        ref={trapRef}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className={`bg-[#f4f3ee] dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl w-full max-w-sm border ${accentBorder} shadow-lg`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'dialogIn 140ms cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex gap-2 px-5 pb-5 sm:px-6 sm:pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-100"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onCancel(); }}
            className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-xl transition-colors duration-100 ${confirmColors}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
