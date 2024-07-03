import React from 'react';

import { useTranslation } from 'next-i18next';



interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('common');

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">{title}</h1>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md text-lg hover:bg-red-600 transition duration-300"
          >
            {t('confirm')}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-md text-lg hover:bg-gray-600 transition duration-300"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ConfirmationModal;
