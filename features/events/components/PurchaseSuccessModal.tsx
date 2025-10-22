import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const PurchaseSuccessModal = ({ isOpen, onClose, purchasedInfo }: { isOpen: boolean, onClose: () => void, purchasedInfo: { ticketCount: number, total: number, eventTitle: string } | null }) => {
    const navigate = useNavigate();

    if (!isOpen || !purchasedInfo) return null;
    const { ticketCount, total, eventTitle } = purchasedInfo;

    const handleViewTickets = () => {
        onClose();
        navigate('/my-tickets');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center">
                    <CheckCircleIcon className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Purchase Successful!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    You have successfully purchased <strong>{ticketCount} {ticketCount > 1 ? 'tickets' : 'ticket'}</strong> for <strong>{eventTitle}</strong>.
                </p>

                <div className="my-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your tickets and QR codes are available in the "My Tickets" section.
                    </p>
                </div>
                
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Total Amount Paid: <span className="text-primary-500">${total.toFixed(2)}</span>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                     <button 
                        onClick={onClose} 
                        className="w-full px-6 py-3 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 font-semibold"
                    >
                        Done
                    </button>
                    <button 
                        onClick={handleViewTickets} 
                        className="w-full px-6 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold"
                    >
                        View My Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PurchaseSuccessModal;