import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  TagIcon,
  CheckBadgeIcon,
  BellIcon as BellSolidIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";
import { 
  BellIcon as BellOutlineIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { eventService } from "@/services/eventService";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import EventCardSkeleton from "./components/EventCardSkeleton";
import { useReminderStore } from "@/store/reminderStore";
import ReminderModal from "./components/ReminderModal";
import { useCartStore } from "@/store/cartStore";
import { Role, EventStatus } from "@/types/common";
import { Events } from "@/types/events";
import { TicketType } from "@/types/tickets";

type SortOption = "date-asc" | "date-desc" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Get ticket price range
  const getPriceRange = () => {
    if (!event.ticketTypes || event.ticketTypes.length === 0) return null;
    const prices = event.ticketTypes.map(tt => tt.price).filter(p => p > 0);
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min.toFixed(2)}`;
    return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  // Get total tickets available
  const getTotalTickets = () => {
    return event.ticketTypes.reduce((sum, tt) => sum + (tt.totalAvailable || 0), 0);
  };

  // Get status badge class
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

  const priceRange = getPriceRange();
  const totalTickets = getTotalTickets();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden group">
      <Link to={`/events/${event.id}`}>
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              event.status !== EventStatus.PUBLISHED ? "filter grayscale opacity-70" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(event.status)}`}>
              {event.status}
            </span>
          </div>

          {/* Category Badge */}
          {event.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                <TagIcon className="h-3 w-3 inline mr-1" />
                {event.category}
              </span>
            </div>
          )}

          {/* Price Badge */}
          {priceRange && event.status === EventStatus.PUBLISHED && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">From</span>
                  <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{priceRange}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <Link to={`/events/${event.id}`} className="flex-grow pr-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {event.name}
            </h3>
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSetReminder(event);
            }}
            title={reminder && !reminder.fired ? "Remove reminder" : "Set a reminder"}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            {reminder && !reminder.fired ? (
              <BellSolidIcon className="h-5 w-5 text-primary-500" />
            ) : (
              <BellOutlineIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>

        {event.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
            <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="flex flex-col">
              <span>{formatDate(event.start)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {formatTime(event.start)} - {formatTime(event.end)}
              </span>
            </div>
          </div>

          {totalTickets > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
              <TicketIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span>{totalTickets.toLocaleString()} tickets available</span>
            </div>
          )}

          {event.capacity > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
              <UsersIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span>Capacity: {event.capacity.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200">
              Ticket Types
            </h4>
            {event.ticketTypes.length > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {event.ticketTypes.length} type{event.ticketTypes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {event.ticketTypes.length > 0 ? (
              event.ticketTypes.slice(0, 3).map((tt) => {
                const isSoldOut = (tt.totalAvailable || 0) === 0;
                return (
                  <div
                    key={tt.id}
                    className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                        {tt.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          ${tt.price.toFixed(2)}
                        </p>
                        {isSoldOut && (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">Sold Out</span>
                        )}
                        {!isSoldOut && tt.totalAvailable && tt.totalAvailable <= 10 && (
                          <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Only {tt.totalAvailable} left!
                          </span>
                        )}
                      </div>
                    </div>
                    {userRole === Role.USER && event.status === EventStatus.PUBLISHED && !isSoldOut && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onAddToCart(event, tt);
                        }}
                        className="ml-2 px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-semibold transition-colors flex-shrink-0"
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No tickets available
              </p>
            )}
            {event.ticketTypes.length > 3 && (
              <Link
                to={`/events/${event.id}`}
                className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium py-2"
              >
                View all {event.ticketTypes.length} ticket types →
              </Link>
            )}
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
  const [sortOption, setSortOption] = useState<SortOption>("date-asc");
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

  const filteredAndSortedEvents = useMemo(() => {
    // Filter events
    let filtered = events.filter((event) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        event.name.toLowerCase().includes(search) ||
        event.venue.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search);
      const matchCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchStatus =
        selectedStatus === "All" || event.status === selectedStatus;
      return matchSearch && matchCategory && matchStatus;
    });

    // Sort events
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "date-asc":
          return new Date(a.start).getTime() - new Date(b.start).getTime();
        case "date-desc":
          return new Date(b.start).getTime() - new Date(a.start).getTime();
        case "price-asc": {
          const aMin = Math.min(...(a.ticketTypes.map(tt => tt.price).filter(p => p > 0) || [Infinity]));
          const bMin = Math.min(...(b.ticketTypes.map(tt => tt.price).filter(p => p > 0) || [Infinity]));
          return aMin - bMin;
        }
        case "price-desc": {
          const aMax = Math.max(...(a.ticketTypes.map(tt => tt.price).filter(p => p > 0) || [0]));
          const bMax = Math.max(...(b.ticketTypes.map(tt => tt.price).filter(p => p > 0) || [0]));
          return bMax - aMax;
        }
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchTerm, selectedCategory, selectedStatus, sortOption]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSortOption("date-asc");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "All" || selectedStatus !== "All" || sortOption !== "date-asc";

  const handleAddToCart = (event: Events, ticketType: TicketType) => {
    addToCart(event, ticketType);
    toast.success(`✅ Added "${ticketType.name}" to cart`);
  };

  const handleSetReminder = (event: Events) => {
    setSelectedEventForReminder(event);
    setIsReminderModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Events 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and book tickets for exciting events near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative md:col-span-2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
              <input
                type="text"
                placeholder="Search events by name, venue, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative">
              <TagIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <CheckBadgeIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as EventStatus | "All")}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value={EventStatus.PUBLISHED}>Published</option>
                <option value={EventStatus.DRAFT}>Draft</option>
                <option value={EventStatus.CANCELLED}>Cancelled</option>
                <option value={EventStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>

          {/* Sort and Results */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="relative">
                <ArrowsUpDownIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="pl-12 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer text-sm"
                >
                  <option value="date-asc">Date: Earliest First</option>
                  <option value="date-desc">Date: Latest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedEvents.length}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span> events
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredAndSortedEvents.map((event) => (
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            {events.length === 0 ? (
              <>
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Events Available
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  There are currently no events available. Check back later for new events!
                </p>
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Events Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter criteria to find events.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Clear All Filters
                  </button>
                )}
              </>
            )}
          </div>
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