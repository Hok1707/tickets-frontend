import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '@/services/eventService';
import { ticketService } from '@/services/ticketService';
import toast from 'react-hot-toast';
import { 
    CalendarIcon, 
    ArrowLeftIcon,
    TicketIcon,
    TagIcon,
    XCircleIcon
} from '@heroicons/react/24/solid';
import {
    MapPinIcon as MapPinOutline,
    CalendarIcon as CalendarOutline,
    UsersIcon as UsersOutline,
    TicketIcon as TicketOutline
} from '@heroicons/react/24/outline';
import PurchaseModal from './components/PurchaseModal';
import PurchaseSuccessModal from './components/PurchaseSuccessModal';
import { useAuth } from '@/hooks/useAuth';
import { EventStatus, Role } from '@/types/common';
import { Events } from '@/types/events';
import { ApiResponse } from '@/types/pagination';
import { TicketType } from '@/types/tickets';

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
        const PERCENT_FEE = 0.05;
        const TRANSACTION_FEE = selectedTicketType.price * quantity * PERCENT_FEE;
        const total = (selectedTicketType.price * quantity) + TRANSACTION_FEE;

        try {
            const purchasedTickets = await ticketService.purchaseTickets(
                event.id,
                user.id
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

    // Get status badge styling
    const getStatusBadgeClass = (status: EventStatus) => {
        switch (status) {
            case EventStatus.PUBLISHED:
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
            case EventStatus.COMPLETED:
                return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
            case EventStatus.CANCELLED:
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
            default:
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
        }
    };

    // Calculate ticket availability
    const getTicketAvailability = (ticketType: TicketType) => {
        const available = ticketType.totalAvailable || 0;
        if (available === 0) return { text: "Sold Out", class: "text-red-600 dark:text-red-400" };
        if (available <= 10) return { text: `Only ${available} left!`, class: "text-orange-600 dark:text-orange-400" };
        return { text: `${available} available`, class: "text-green-600 dark:text-green-400" };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button Skeleton */}
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>
                    
                    {/* Hero Image Skeleton */}
                    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 animate-pulse"></div>
                    
                    {/* Content Skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircleIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        The event you are looking for does not exist or may have been removed.
                    </p>
                    <Link 
                        to="/events" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl shadow-lg transition-all duration-200 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back to Events
                    </Link>
                </div>
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const getTotalTicketsAvailable = () => {
        return event.ticketTypes.reduce((sum, tt) => sum + (tt.totalAvailable || 0), 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <Link 
                    to="/events" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors group"
                >
                    <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back to All Events
                </Link>

                {/* Hero Section */}
                <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl mb-8 group">
                    <img 
                        src={event.imageUrl} 
                        alt={event.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-6 left-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusBadgeClass(event.status)}`}>
                            {event.status}
                        </span>
                    </div>

                    {/* Category Badge */}
                    {event.category && (
                        <div className="absolute top-6 right-6">
                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-500 text-white shadow-lg">
                                <TagIcon className="h-4 w-4 inline mr-1" />
                                {event.category}
                            </span>
                        </div>
                    )}

                    {/* Event Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
                            {event.name}
                        </h1>
                    </div>

                    {/* Non-published overlay */}
                    {event.status !== EventStatus.PUBLISHED && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center">
                                <div className="text-white text-3xl md:text-4xl font-bold mb-2 uppercase tracking-widest">
                                    {event.status}
                                </div>
                                <p className="text-white/80 text-sm md:text-base">
                                    This event is not available for ticket purchase
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Info Cards */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Date & Time */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                        <CalendarOutline className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{formatDate(event.start)}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {formatTime(event.start)} - {formatTime(event.end)}
                                        </p>
                                    </div>
                                </div>

                                {/* Venue */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                                        <MapPinOutline className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Venue</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">{event.venue}</p>
                                    </div>
                                </div>

                                {/* Capacity */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                                        <UsersOutline className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Capacity</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {event.capacity.toLocaleString()} attendees
                                        </p>
                                    </div>
                                </div>

                                {/* Tickets Available */}
                                <div className="flex items-start gap-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                                        <TicketOutline className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tickets Available</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            {getTotalTicketsAvailable().toLocaleString()} tickets
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Event */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About This Event</h2>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Tickets Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Tickets Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <TicketIcon className="h-6 w-6 text-primary-500" />
                                        Tickets
                                    </h3>
                                </div>

                                {event.status !== EventStatus.PUBLISHED && (
                                    <div className="p-4 mb-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" role="alert">
                                        <div className="flex items-start gap-3">
                                            <XCircleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                                                    Ticket Sales Closed
                                                </p>
                                                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                                    This event is not available for ticket purchase at this time.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {event.ticketTypes.length > 0 ? (
                                        event.ticketTypes.map((tt) => {
                                            const availability = getTicketAvailability(tt);
                                            const isSoldOut = (tt.totalAvailable || 0) === 0;
                                            
                                            return (
                                                <div 
                                                    key={tt.id} 
                                                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                                                >
                                                    {/* Ticket Header */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                                                                    {tt.name}
                                                                </h4>
                                                                {tt.description && (
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                        {tt.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm font-medium ${availability.class}`}>
                                                                {availability.text}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                                                ${tt.price.toFixed(2)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">per ticket</p>
                                                        </div>
                                                    </div>

                                                    {/* Purchase Button */}
                                                    {role === Role.USER && event.status === EventStatus.PUBLISHED && (
                                                        <button
                                                            onClick={() => handlePurchaseClick(tt)}
                                                            disabled={isSoldOut}
                                                            className={`w-full px-4 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                                                                isSoldOut
                                                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                                            }`}
                                                        >
                                                            {isSoldOut ? 'Sold Out' : 'Purchase Tickets'}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <TicketIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                                No tickets available
                                            </p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                                Check back later for ticket information
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Summary Info */}
                                {event.ticketTypes.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Total Available:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {getTotalTicketsAvailable().toLocaleString()} tickets
                                            </span>
                                        </div>
                                    </div>
                                )}
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