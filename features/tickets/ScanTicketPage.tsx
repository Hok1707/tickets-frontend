import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScanModal from './components/ScanModal';
import { QrCodeIcon } from '@heroicons/react/24/solid';

const ScanTicketPage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleClose = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    const handleTicketRedeemed = () => {
        // In this context, we don't need to refetch a list of tickets.
        // The modal itself shows success and allows scanning another ticket.
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center border border-gray-200 dark:border-gray-700">
            <QrCodeIcon className="mx-auto h-16 w-16 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Ticket Scanner</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">The scanner is active. To restart, close this modal and re-open this page.</p>
            {!isModalOpen && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                    Open Scanner
                </button>
            )}
            <ScanModal
                isOpen={isModalOpen}
                onClose={handleClose}
                onTicketRedeemed={handleTicketRedeemed}
            />
        </div>
    );
};

export default ScanTicketPage;