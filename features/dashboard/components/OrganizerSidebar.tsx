import React, { useState } from 'react';
import TopEventsCard, { TopEvent } from './TopEventsCard';
import UpcomingEventsCard from './UpcomingEventsCard';
import { QrCodeIcon, XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { Events, Ticket, TicketType, User } from '@/types';
import { ticketService } from '@/services/ticketService';

type VerificationResult = {
    status: 'valid' | 'invalid';
    message?: string;
    data?: { ticket: Ticket; event: Events; ticketType: TicketType; user: User };
} | null;

const VerificationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    organizerId: string;
}> = ({ isOpen, onClose, organizerId }) => {
    const [qrValue, setQrValue] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<VerificationResult>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setResult(null);

        try {
            const ticketData = await ticketService.getTicketByQrCode(qrValue);
            if (ticketData) {
                if (ticketData.event.organizerId === organizerId) {
                    setResult({ status: 'valid', data: ticketData });
                } else {
                    setResult({ status: 'invalid', message: 'This ticket is valid, but not for one of your events.' });
                }
            } else {
                setResult({ status: 'invalid', message: 'Ticket not found or code is invalid.' });
            }
        } catch (error) {
            setResult({ status: 'invalid', message: 'An error occurred during verification.' });
        } finally {
            setIsVerifying(false);
        }
    };
    
    const resetScanner = () => {
        setQrValue('');
        setResult(null);
    }
    
    const handleClose = () => {
        resetScanner();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full relative">
                <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
                <div className="text-center">
                    <QrCodeIcon className="mx-auto h-12 w-12 text-primary-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Verify Ticket</h2>
                </div>

                {!result ? (
                    <form onSubmit={handleVerify} className="mt-6 space-y-4">
                        <p className="text-gray-600 dark:text-gray-400 text-center text-sm">Enter the ticket code to verify its authenticity for your event.</p>
                        <div>
                            <label htmlFor="qrCodeInput" className="sr-only">Ticket Code</label>
                            <input id="qrCodeInput" type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} placeholder="e.g., TICKET-t1-EVENT-1-USER-3" required className="w-full px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <button type="submit" disabled={isVerifying} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 dark:disabled:bg-primary-800">
                            {isVerifying ? 'Verifying...' : 'Verify Ticket'}
                        </button>
                    </form>
                ) : result.status === 'valid' ? (
                    <div className="mt-6 text-center">
                        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                        <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">VALID TICKET</h3>
                        <div className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-4 space-y-2">
                            <p><strong>Event:</strong> {result.data?.event.name}</p>
                            <p><strong>Ticket:</strong> {result.data?.ticketType.name}</p>
                            <p><strong>Attendee:</strong> {result.data?.user.username}</p>
                        </div>
                         <button onClick={resetScanner} className="mt-6 w-full py-3 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Scan Another Ticket</button>
                    </div>
                ) : (
                     <div className="mt-6 text-center">
                        <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
                        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">INVALID TICKET</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{result.message}</p>
                        <button onClick={resetScanner} className="mt-6 w-full py-3 px-4 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Scan Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface OrganizerSidebarProps {
    topSellingEvents: TopEvent[];
    upcomingEvents: Events[];
    organizerId: string;
}

const OrganizerSidebar: React.FC<OrganizerSidebarProps> = ({ topSellingEvents, upcomingEvents, organizerId }) => {
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    return (
        <>
            <aside className="lg:col-span-1 space-y-8">
                <TopEventsCard events={topSellingEvents} title="Your Top Selling Events" />
                <UpcomingEventsCard events={upcomingEvents} />
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ticket Verification</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Verify tickets for your events.</p>
                        </div>
                        <button
                            onClick={() => setIsVerificationModalOpen(true)}
                            className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
                        >
                            <QrCodeIcon className="h-5 w-5" />
                            Open Scanner
                        </button>
                    </div>
                </div>
            </aside>
            <VerificationModal isOpen={isVerificationModalOpen} onClose={() => setIsVerificationModalOpen(false)} organizerId={organizerId} />
        </>
    );
};

export default OrganizerSidebar;