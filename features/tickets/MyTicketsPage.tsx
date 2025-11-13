import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ticketService } from "../../services/ticketService";
import { QRCodeSVG as QRCode } from "qrcode.react";
import toast from "react-hot-toast";

import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon as TicketOutlineIcon,
  QrCodeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  TicketIcon as TicketSolidIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

import { EventStatus, Role, TicketStatus, TicketUserResponse } from "@/types";
import ScanModal from "./components/ScanModal";


const TicketStatusBadge: React.FC<{
  status: TicketStatus;
  eventStatus: EventStatus;
}> = ({ status, eventStatus }) => {
  if (eventStatus === EventStatus.CANCELLED) {
    return (
      <div className="absolute top-4 right-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-3 py-1 text-sm font-bold rounded-full z-10">
        Event Cancelled
      </div>
    );
  }
  if (status === TicketStatus.USED) {
    return (
      <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 text-sm font-bold rounded-full z-10">
        Checked In
      </div>
    );
  }
  return null;
};


const TicketCard: React.FC<{
  detailedTicket: TicketUserResponse;
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({ detailedTicket, isExpanded, onToggleExpand }) => {
  const { id, event, ticketType, purchaser, status: rawStatus, createdAt, qrCode } = detailedTicket;
  const status = rawStatus as TicketStatus;
  const { value: value } = qrCode;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const next7Days = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const truncate = (str: string, num: number) =>
    str.length <= num ? str : `${str.slice(0, num)}...`;

  const detailsId = `ticket-details-${id}`;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${status === TicketStatus.USED ||
        event.status === EventStatus.CANCELLED
        ? "opacity-70"
        : ""
        }`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:w-2/3 order-2 md:order-1 relative">
          <TicketStatusBadge status={status} eventStatus={event.status as EventStatus} />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {event.name}
          </h3>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
            {ticketType}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {truncate(event.description, 100)}
          </p>

          <div className="mt-4 flex items-center text-gray-600 dark:text-gray-400">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>
              {event.start
                ? formatDate(event.start)
                : next7Days()}
            </span>
          </div>

          <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
            <UserCircleIcon className="h-5 w-5 mr-2" />
            <span>Organized by: {event.organizerName ? event.organizerName : "Admin"}</span>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Purchased on: {formatDate(createdAt)}
          </p>

          <div className="mt-6">
            <button
              onClick={onToggleExpand}
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-md focus:outline-none"
            >
              {isExpanded ? "Show Less" : "View Details"}
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 flex flex-col items-center justify-center md:w-1/3 order-1 md:order-2 border-b md:border-b-0 md:border-l border-gray-200 dark:border-gray-600 relative">
          {(event.status === EventStatus.CANCELLED ||
            status === TicketStatus.USED) && (
              <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10">
                {status === TicketStatus.USED ? (
                  <CheckCircleIcon className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircleIcon className="h-16 w-16 text-red-500" />
                )}
              </div>
            )}
          <QRCode
            value={value}
            size={160}
            bgColor="transparent"
            fgColor={
              document.documentElement.classList.contains("dark")
                ? "#FFFFFF"
                : "#000000"
            }
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 break-all">
            {status === TicketStatus.USED
              ? "This ticket has been used."
              : event.status === EventStatus.CANCELLED
                ? "This event has been cancelled."
                : "Present this QR code at the event entrance."}
          </p>
        </div>
      </div>

      <div
        id={detailsId}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? "max-h-[500px]" : "max-h-0"
          }`}
      >
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            About The Event
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};


const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const { user, role } = useAuth();

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    try {
      const data = await ticketService.getMyTickets(user.id);
      setTickets(data);
    } catch (error) {
      toast.error("Failed to fetch your tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    fetchTickets();
  }, [fetchTickets]);

  const handleToggleExpand = (ticketId: string) => {
    setExpandedTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-700 dark:text-gray-300">
        Loading your tickets...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here are all the tickets you've purchased. Present the QR code at the
            event.
          </p>
        </div>
        {(role === Role.ADMIN ||
          role === Role.ORGANIZER ||
          role === Role.STAFF) && (
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
            >
              <QrCodeIcon className="h-5 w-5" />
              Scan Ticket
            </button>
          )}
      </div>

      {tickets.length > 0 ? (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              detailedTicket={ticket}
              isExpanded={expandedTicketId === ticket.id}
              onToggleExpand={() => handleToggleExpand(ticket.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-20 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <TicketSolidIcon className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            No Tickets Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You haven't purchased any tickets yet. Explore events now!
          </p>
          <div className="mt-6">
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Explore Events
            </Link>
          </div>
        </div>
      )}

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onTicketRedeemed={fetchTickets}
      />
    </div>
  );
};

export default MyTicketsPage;