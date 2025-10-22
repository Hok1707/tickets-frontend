import React, { useState, useEffect } from 'react';
import type { Events, TicketType } from '@/types';
import { XMarkIcon, MapPinIcon, CalendarIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const PurchaseModal = ({ isOpen, onClose, ticketType, event, onConfirm }: { isOpen: boolean, onClose: () => void, ticketType: TicketType | null, event: Events | null, onConfirm: (quantity: number) => void }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
        }
    }, [isOpen]);

    if (!isOpen || !ticketType || !event) return null;

    const PERCENT_FEE = 0.02;
    const TRANSACTION_FEE = (ticketType.price * quantity) * PERCENT_FEE;
    const total = (ticketType.price * quantity) + TRANSACTION_FEE;

    const handleIncrement = () => setQuantity(q => Math.min(q + 1, 10));
    const handleDecrement = () => setQuantity(q => Math.max(q - 1, 1));

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
                <div className="relative hidden md:block">
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                        <h2 className="text-3xl font-bold leading-tight">{event.name}</h2>
                        <div className="flex items-center mt-3 text-gray-200">
                            <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{event.venue}</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-200">
                            <CalendarIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="text-sm">{formatDate(event.start)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <XMarkIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="md:hidden mb-4 border-b pb-4 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{event.name}</h3>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-700">
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{ticketType.name}</p>
                        <p className="text-xl font-bold text-primary-500 mt-2">${ticketType.price.toFixed(2)} <span className="text-base font-normal text-gray-500 dark:text-gray-400">/ ticket</span></p>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <label className="font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                        <div className="flex items-center gap-2 border rounded-md dark:border-gray-600">
                            <button onClick={handleDecrement} disabled={quantity <= 1} className="px-3 py-2 text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md">
                                <MinusIcon className="h-5 w-5" />
                            </button>
                            <span className="text-lg font-bold w-12 text-center text-gray-900 dark:text-white">{quantity}</span>
                            <button onClick={handleIncrement} disabled={quantity >= 10} className="px-3 py-2 text-gray-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md">
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex justify-between">
                            <span>{ticketType.name} ({quantity} &times; ${ticketType.price.toFixed(2)})</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">${(ticketType.price * quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Transaction Fee</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">${TRANSACTION_FEE.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="mt-auto pt-6 space-y-3">
                        <button onClick={() => onConfirm(quantity)} className="w-full px-6 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold text-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                            Pay ${total.toFixed(2)}
                        </button>
                        <button onClick={onClose} className="w-full text-center py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                            Cancel
                        </button>
                    </div>
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
    )
}

export default PurchaseModal;