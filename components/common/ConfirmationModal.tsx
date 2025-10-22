import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  variant = 'primary',
}) => {
  if (!isOpen) return null;

  const confirmButtonClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
  };

  const iconClasses = {
    danger: 'text-red-600 dark:text-red-400',
    primary: 'text-primary-600 dark:text-primary-400',
  }

  const iconBgClasses = {
    danger: 'bg-red-100 dark:bg-red-900/50',
    primary: 'bg-primary-100 dark:bg-primary-900/50',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog" aria-labelledby="confirmation-modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
        <div className="sm:flex sm:items-start">
          <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgClasses[variant]} sm:mx-0 sm:h-10 sm:w-10`}>
            <ExclamationTriangleIcon className={`h-6 w-6 ${iconClasses[variant]}`} aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 id="confirmation-modal-title" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
              {title}
            </h3>
            <div className="mt-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {message}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-md px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors ${confirmButtonClasses[variant]} dark:focus:ring-offset-gray-800`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmButtonText}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
      <style>{`
          @keyframes fade-in-up {
              from {
                  opacity: 0;
                  transform: scale(0.95) translateY(10px);
              }
              to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
              }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
