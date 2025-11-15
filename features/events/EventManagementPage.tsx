import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { eventService } from "@/services/eventService";
import toast from "react-hot-toast";
import EventModal from "./components/EventModal";
import { useAuth } from "@/hooks/useAuth";
import EventCardSkeleton from "./components/EventCardSkeleton";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  FunnelIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { EventStatus, Role } from "@/types/common";
import { Events } from "@/types/events";
import { PaginatedResponse } from "@/types/pagination";

const EventManagementPage: React.FC = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | "All">("All");
  const { role } = useAuth();
const fetchEvents = useCallback(async () => {
  if (!role) return;

  setIsLoading(true);
  try {
    let response: PaginatedResponse<Events>;
    if (role === Role.ORGANIZER) {
      response = await eventService.getEventsByOranizer();
    } else {
      response = await eventService.getEventsAdmin();
    }
    setEvents(response.items);
  } catch (error) {
    console.error("Error fetching events:", error);
    toast.error("Failed to fetch events.");
  } finally {
    setIsLoading(false);
  }
}, [role]);

useEffect(() => {
  fetchEvents();
}, [fetchEvents]);

  const openModal = (event: Events | null = null) => {
    setSelectedEvent(
      event || {
        id: "",
        name: "",
        description: "",
        venue: "",
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        imageUrl: "",
        capacity: 0,
        status: EventStatus.DRAFT,
        organizerId: "",
        ticketTypes: [],
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleSaveEvent = async (eventData: Events) => {
    if (!eventData.name || !eventData.venue) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...eventData,
      ticketTypes: eventData.ticketTypes.map((tt) => ({
        name: tt.name,
        description: tt.description,
        price: Number(tt.price) || 0,
        totalAvailable: Number(tt.totalAvailable) || 0,
      })),
    };

    try {
      if (eventData.id) {
        await eventService.updateEvent(payload);
        toast.success("✅ Event updated successfully!");
      } else {
        await eventService.createEvent(payload);
        toast.success("🎉 Event created successfully!");
      }
      await fetchEvents();
      closeModal();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event.");
    }
  };

  // Delete event
  const confirmDeleteEvent = (eventId: string) => {
    setDeleteEventId(eventId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!deleteEventId) return;
    try {
      await eventService.deleteEvent(deleteEventId);
      toast.success("🗑️ Event deleted successfully!");
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteEventId(null);
    }
  };

  // Filter events based on search and status
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "All" || event.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, selectedStatus]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Calculate total tickets available
  const getTotalTickets = (event: Events) => {
    return event.ticketTypes.reduce((sum, tt) => sum + (tt.totalAvailable || 0), 0);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Event Management 🎟️
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create, edit, and manage your events
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            Create Event
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name, venue, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative md:w-64">
              <FunnelIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as EventStatus | "All")}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value={EventStatus.PUBLISHED}>Published</option>
                <option value={EventStatus.DRAFT}>Draft</option>
                <option value={EventStatus.CANCELLED}>Cancelled</option>
                <option value={EventStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {(searchTerm || selectedStatus !== "All") && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredEvents.length}</span> of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span> events
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            {events.length === 0 ? (
              <>
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TicketIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Events Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get started by creating your first event!
                </p>
                <button
                  onClick={() => openModal()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold mx-auto"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Your First Event
                </button>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Events Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("All");
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                      event.status !== EventStatus.PUBLISHED ? "grayscale opacity-70" : ""
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <TicketIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                {/* Status Badge Overlay */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>
                {/* Category Badge */}
                {event.category && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500 text-white">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {event.name}
                </h3>
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(event.start)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UsersIcon className="h-4 w-4 text-gray-500" />
                    <span>Capacity: {event.capacity.toLocaleString()}</span>
                  </div>
                  {event.ticketTypes.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <TicketIcon className="h-4 w-4 text-gray-500" />
                      <span>
                        {event.ticketTypes.length} ticket type{event.ticketTypes.length !== 1 ? "s" : ""} •{" "}
                        {getTotalTickets(event).toLocaleString()} available
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to={`/events/${event.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Link>
                  <button
                    onClick={() => openModal(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDeleteEvent(event.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={closeModal}
          onSave={handleSaveEvent}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagementPage;