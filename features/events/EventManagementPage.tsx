import React, { useState, useEffect, useCallback } from "react";
import { eventService } from "@/services/eventService";
import { Events, EventStatus, PaginatedResponse, TicketType, Role } from "@/types";
import toast from "react-hot-toast";
import EventModal from "./components/EventModal";
import { useAuth } from "@/hooks/useAuth";

const EventManagementPage: React.FC = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const addTicketType = () => {
    if (!selectedEvent) return;
    const newTicket: TicketType = {
      id: "",
      name: "",
      description: "",
      price: 0,
      totalAvailable: 0,
    };
    setSelectedEvent({
      ...selectedEvent,
      ticketTypes: [...selectedEvent.ticketTypes, newTicket],
    });
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: any) => {
    if (!selectedEvent) return;
    const updatedTickets = [...selectedEvent.ticketTypes];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setSelectedEvent({ ...selectedEvent, ticketTypes: updatedTickets });
  };

  const removeTicketType = (index: number) => {
    if (!selectedEvent) return;
    const updatedTickets = [...selectedEvent.ticketTypes];
    updatedTickets.splice(index, 1);
    setSelectedEvent({ ...selectedEvent, ticketTypes: updatedTickets });
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          🎟️ Event Management
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-lg transition-all"
        >
          + Create Event
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
          No events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {event.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                📍 {event.venue}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                🗓️ {new Date(event.start).toLocaleString()} →{" "}
                {new Date(event.end).toLocaleString()}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${event.status === EventStatus.PUBLISHED
                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    : event.status === EventStatus.COMPLETED
                      ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                  }`}
              >
                {event.status}
              </span>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => openModal(event)}
                  className="text-blue-500 hover:text-blue-400 font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDeleteEvent(event.id)}
                  className="text-red-500 hover:text-red-400 font-semibold transition-colors"
                >
                  Delete
                </button>
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
          onAddTicket={addTicketType}
          onUpdateTicket={updateTicketType}
          onRemoveTicket={removeTicketType}
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