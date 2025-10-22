import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '@/services/eventService';
import { ticketService } from '@/services/ticketService';
import { TicketType, EventStatus, Role, Events, ApiResponse } from '@/types';
import toast from 'react-hot-toast';
import { 
    MapPinIcon, 
    CalendarIcon, 
    ArrowLeftIcon, 
} from '@heroicons/react/24/solid';
import PurchaseModal from './components/PurchaseModal';
import PurchaseSuccessModal from './components/PurchaseSuccessModal';
import { useAuth } from '@/hooks/useAuth';

const EventDetailsPage: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Events | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
    const [purchasedTicketInfo, setPurchasedTicketInfo] = useState<{ ticketCount: number, total: number, eventTitle: string } | null>(null);
    const { user, role } = useAuth();

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const res: ApiResponse<Events> = await eventService.getEventById(eventId);
                console.log(`res ${res}`);
                const data = res.data;
                if (data) {
                    setEvent({
                        ...data,
                        ticketTypes: data.ticketTypes || [],
                        description: data.description || 'No description available.',
                        venue: data.venue || 'Location not specified.',
                        status: data.status || EventStatus.DRAFT,
                    });
                } else {
                    toast.error('Event not found.');
                }
            } catch (error) {
                toast.error('Failed to fetch event details.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handlePurchaseClick = (ticketType: TicketType) => {
        setSelectedTicketType(ticketType);
        setIsModalOpen(true);
    };

    const handleConfirmPurchase = async (quantity: number) => {
        if (!selectedTicketType || !event || !user) return;
        const PERCENT_FEE = 0.2;
        const TRANSACTION_FEE = selectedTicketType.price * quantity * PERCENT_FEE;
        const total = (selectedTicketType.price * quantity) + TRANSACTION_FEE;

        try {
            const purchasedTickets = await ticketService.purchaseTickets(
                user.id,
                event.id,
                selectedTicketType.id,
                quantity
            );

            toast.success(`Successfully purchased ${quantity} ticket(s) for ${event.name}!`);
            setPurchasedTicketInfo({ ticketCount: purchasedTickets.length, total, eventTitle: event.name });

            const res: ApiResponse<Events> = await eventService.getEventById(event.id);
            const updatedData = res.data;
            if (updatedData) {
                setEvent({
                    ...updatedData,
                    ticketTypes: updatedData.ticketTypes || [],
                });
            }

            setIsSuccessModalOpen(true);
        } catch (e) {
            toast.error('Failed to purchase ticket.');
        } finally {
            setIsModalOpen(false);
            setSelectedTicketType(null);
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse p-6">
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                <div className="space-y-4 max-w-5xl mx-auto">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">The event you are looking for does not exist.</p>
                <Link to="/events" className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Events
                </Link>
            </div>
        );
    }

    const formatDateRange = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const options: Intl.DateTimeFormatOptions = { 
            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' 
        };
        return `${startDate.toLocaleString('en-US', options)} - ${endDate.toLocaleString('en-US', options)}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/events" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to All Events
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="relative h-64 md:h-96">
                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    {event.status !== EventStatus.PUBLISHED && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold px-6 py-3 rounded-lg bg-black/50 border-2 border-white/80 uppercase tracking-widest">
                                {event.status}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-6 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">{event.name}</h1>
                            <div className="space-y-3 text-lg text-gray-600 dark:text-gray-300">
                                <p className="flex items-start gap-3">
                                    <CalendarIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
                                    <span>{formatDateRange(event.start, event.end)}</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <MapPinIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0" />
                                    <span>{event.venue}</span>
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">About this event</h2>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{event.description}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tickets</h3>
                                    {event.status !== EventStatus.PUBLISHED && (
                                        <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                                            Ticket sales are currently closed for this event.
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        {event.ticketTypes.length > 0 ? event.ticketTypes.map(tt => (
                                            <div key={tt.id} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{tt.name}</p>
                                                    </div>
                                                    <p className="text-2xl font-bold text-primary-500">${tt.price}</p>
                                                </div>
                                                {role === Role.USER && event.status === EventStatus.PUBLISHED && (
                                                    <button
                                                        onClick={() => handlePurchaseClick(tt)}
                                                        className="mt-3 w-full px-4 py-2 bg-primary-600 text-white text-base font-semibold rounded-md hover:bg-primary-700 transition-colors"
                                                    >
                                                        Purchase
                                                    </button>
                                                )}
                                            </div>
                                        )) : (
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tickets available for this event.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ticketType={selectedTicketType}
                event={event}
                onConfirm={handleConfirmPurchase}
            />

            <PurchaseSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                purchasedInfo={purchasedTicketInfo}
            />
        </div>
    );
};

export default EventDetailsPage;