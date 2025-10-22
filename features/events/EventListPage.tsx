import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  TagIcon,
  CheckBadgeIcon,
  BellIcon as BellSolidIcon,
} from "@heroicons/react/24/solid";
import { BellIcon as BellOutlineIcon } from "@heroicons/react/24/outline";
import { Events, TicketType, Role, EventStatus } from "@/types";
import { eventService } from "@/services/eventService";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import EventCardSkeleton from "./components/EventCardSkeleton";
import { useReminderStore } from "@/store/reminderStore";
import ReminderModal from "./components/ReminderModal";
import { useCartStore } from "@/store/cartStore";

const EventCard = ({
  event,
  onAddToCart,
  userRole,
  onSetReminder,
}: {
  event: Events;
  onAddToCart: (event: Events, ticketType: TicketType) => void;
  userRole: Role | null;
  onSetReminder: (event: Events) => void;
}) => {
  const { getReminderByEventId } = useReminderStore();
  const reminder = getReminderByEventId(event.id);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105 flex flex-col overflow-hidden">
      <Link to={`/events/${event.id}`}>
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${event.status !== EventStatus.PUBLISHED ? "filter grayscale" : ""
              }`}
          />
          {event.status && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold px-3 py-1 rounded-lg bg-black/50">
                {event.status}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {event.category || "General"}
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <Link to={`/events/${event.id}`} className="flex-grow pr-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              {event.name}
            </h3>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetReminder(event);
            }}
            title="Set a reminder"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {reminder && !reminder.fired ? (
              <BellSolidIcon className="h-6 w-6 text-primary-500" />
            ) : (
              <BellOutlineIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 gap-2">
          <MapPinIcon className="h-5 w-5" />
          <span>{event.venue}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 gap-2">
          <CalendarIcon className="h-5 w-5" />
          <span>
            {formatDate(event.start)} → {formatDate(event.end)}
          </span>
        </div>

        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
            Tickets
          </h4>
          <div className="space-y-2">
            {event.ticketTypes.map((tt) => (
              <div
                key={tt.id}
                className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {tt.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${tt.price}
                  </p>
                </div>
                {userRole === Role.USER && event.status === EventStatus.PUBLISHED && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(event, tt);
                    }}
                    className="px-4 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-semibold"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<Events[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | "All">("All");
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedEventForReminder, setSelectedEventForReminder] = useState<Events | null>(null);

  const { role } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents();
        setEvents(res.items);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(events.map((e) => e.category || "General"))],
    [events]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        event.name.toLowerCase().includes(search) ||
        event.venue.toLowerCase().includes(search);
      const matchCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchStatus =
        selectedStatus === "All" || event.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [events, searchTerm, selectedCategory, selectedStatus]);

  const handleAddToCart = (event: Events, ticketType: TicketType) => {
    addToCart(event, ticketType);
    toast.success(`✅ Added "${ticketType.name}" to cart`);
  };

  const handleSetReminder = (event: Events) => {
    setSelectedEventForReminder(event);
    setIsReminderModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Events</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="relative">
            <TagIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <CheckBadgeIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as EventStatus | "All")}
              className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Status</option>
              <option value={EventStatus.PUBLISHED}>Published</option>
              <option value={EventStatus.DRAFT}>Draft</option>
              <option value={EventStatus.CANCELLED}>Cancelled</option>
              <option value={EventStatus.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userRole={role}
              onAddToCart={handleAddToCart}
              onSetReminder={handleSetReminder}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-20 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            No Events Found
          </h2>
        </div>
      )}
      {selectedEventForReminder && (
        <ReminderModal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          event={selectedEventForReminder}
        />
      )}
    </div>
  );
};

export default EventListPage;