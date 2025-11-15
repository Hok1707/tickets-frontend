import React, { useState, useEffect, useMemo } from 'react';
import { 
    XMarkIcon, 
    MapPinIcon, 
    CalendarIcon, 
    ClockIcon,
    PlusIcon, 
    MinusIcon,
    TicketIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/solid';
import { Events } from '@/types/events';
import { TicketType } from '@/types/tickets';

const PurchaseModal = ({ isOpen, onClose, ticketType, event, onConfirm }: { isOpen: boolean, onClose: () => void, ticketType: TicketType | null, event: Events | null, onConfirm: (quantity: number) => void }) => {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen && ticketType) {
            setQuantity(1);
        }
    }, [isOpen, ticketType]);

    if (!isOpen || !ticketType || !event) return null;

    const PERCENT_FEE = 0.02;
    const available = ticketType.totalAvailable || 0;
    const maxQuantity = Math.min(10, available);
    const subtotal = ticketType.price * quantity;
    const TRANSACTION_FEE = subtotal * PERCENT_FEE;
    const total = subtotal + TRANSACTION_FEE;

    const handleIncrement = () => setQuantity(q => Math.min(q + 1, maxQuantity));
    const handleDecrement = () => setQuantity(q => Math.max(q - 1, 1));

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getAvailabilityStatus = useMemo(() => {
        if (available === 0) return { 
            text: "Sold Out", 
            class: "text-red-600 dark:text-red-400",
            icon: ExclamationTriangleIcon,
            bgClass: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        };
        if (available <= 10) return { 
            text: `Only ${available} left!`, 
            class: "text-orange-600 dark:text-orange-400",
            icon: ExclamationTriangleIcon,
            bgClass: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
        };
        return { 
            text: `${available} available`, 
            class: "text-green-600 dark:text-green-400",
            icon: CheckCircleIcon,
            bgClass: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        };
    }, [available]);

    const isSoldOut = available === 0;
    const AvailabilityIcon = getAvailabilityStatus.icon;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300" 
            aria-modal="true" 
            role="dialog"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl grid md:grid-cols-2 overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
                {/* Image Section */}
                <div className="relative hidden md:block group">
                    <img 
                        src={event.imageUrl} 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <TicketIcon className="h-6 w-6 text-primary-400" />
                            <span className="text-sm font-medium text-primary-300 uppercase tracking-wide">
                                {ticketType.name}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold leading-tight mb-4">{event.name}</h2>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-200">
                                <MapPinIcon className="h-5 w-5 mr-2 flex-shrink-0 text-primary-300" />
                                <span className="text-sm">{event.venue}</span>
                            </div>
                            <div className="flex items-center text-gray-200">
                                <CalendarIcon className="h-5 w-5 mr-2 flex-shrink-0 text-primary-300" />
                                <span className="text-sm">{formatDate(event.start)}</span>
                            </div>
                            <div className="flex items-center text-gray-200">
                                <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0 text-primary-300" />
                                <span className="text-sm">{formatTime(event.start)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex flex-col overflow-y-auto max-h-[90vh]">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Order Summary</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Review your purchase details</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Close modal"
                        >
                            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Mobile Event Info */}
                    <div className="md:hidden mb-6 pb-6 border-b dark:border-gray-700">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{event.name}</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>{formatDate(event.start)} at {formatTime(event.start)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Type Card */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-5 rounded-xl border border-primary-200 dark:border-primary-800 mb-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <TicketIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                    <p className="font-bold text-lg text-gray-900 dark:text-white">{ticketType.name}</p>
                                </div>
                                {ticketType.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{ticketType.description}</p>
                                )}
                                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                    ${ticketType.price.toFixed(2)}
                                    <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">/ ticket</span>
                                </p>
                            </div>
                        </div>
                        
                        {/* Availability Status */}
                        <div className={`mt-4 p-3 rounded-lg border ${getAvailabilityStatus.bgClass} flex items-center gap-2`}>
                            <AvailabilityIcon className={`h-5 w-5 ${getAvailabilityStatus.class}`} />
                            <span className={`text-sm font-medium ${getAvailabilityStatus.class}`}>
                                {getAvailabilityStatus.text}
                            </span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="font-semibold text-gray-700 dark:text-gray-300">Quantity</label>
                            {!isSoldOut && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Max {maxQuantity} per order
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                <button 
                                    onClick={handleDecrement} 
                                    disabled={quantity <= 1 || isSoldOut}
                                    className="px-4 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <MinusIcon className="h-5 w-5" />
                                </button>
                                <span className="text-xl font-bold w-16 text-center text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900/50 py-3">
                                    {quantity}
                                </span>
                                <button 
                                    onClick={handleIncrement} 
                                    disabled={quantity >= maxQuantity || isSoldOut}
                                    className="px-4 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                </button>
                            </div>
                            {quantity > 1 && (
                                <div className="flex-1 text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        ${subtotal.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 mb-6 border dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                            Price Breakdown
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {ticketType.name} <span className="text-gray-400 dark:text-gray-500">({quantity} &times; ${ticketType.price.toFixed(2)})</span>
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                    <span>Transaction Fee</span>
                                    <span className="text-xs">(2%)</span>
                                </div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    ${TRANSACTION_FEE.toFixed(2)}
                                </span>
                            </div>
                            <div className="pt-3 border-t dark:border-gray-700 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 space-y-3">
                        <button 
                            onClick={() => onConfirm(quantity)} 
                            disabled={isSoldOut}
                            className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 font-semibold text-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <TicketIcon className="h-5 w-5" />
                            {isSoldOut ? 'Sold Out' : `Pay $${total.toFixed(2)}`}
                        </button>
                        <button 
                            onClick={onClose} 
                            className="w-full text-center py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                        >
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