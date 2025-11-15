import React, { useEffect, useState } from "react";
import { useEventStore } from "@/store/eventStore";
import { EventStatus } from "@/types/common";
import { Events } from "@/types/events";
import { TicketType } from "@/types/tickets";

interface EventModalProps {
  event?: Events;
  onClose: () => void;
  onSave: (event: Events) => Promise<any>;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSave }) => {
  const {
    selectedEvent,
    setSelectedEvent,
    updateEventField,
    addTicketType,
    updateTicketType,
    removeTicketType,
  } = useEventStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticketErrors, setTicketErrors] = useState<Record<number, Record<string, string>>>({});

  useEffect(() => {
    if (event) {
      setSelectedEvent({
        ...event,
        ticketTypes: event.ticketTypes || [],
        status: event.status || EventStatus.DRAFT,
      });
    } else {
      setSelectedEvent({
        name: "",
        venue: "",
        description: "",
        imageUrl: "",
        start: "",
        end: "",
        capacity: 0,
        ticketTypes: [],
        status: EventStatus.DRAFT,
        id: "",
        organizerId: "",
      });
    }
  }, [event, setSelectedEvent]);

  if (!selectedEvent) return null;

  const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) updateEventField(field, date.toISOString());
  };

  const handleSave = async () => {
    setErrors({});
    setTicketErrors({});

    try {
      const payload: Partial<Events> = {
        ...selectedEvent,
        id: selectedEvent.id || undefined,
        capacity: Number(selectedEvent.capacity) || 0,
        ticketTypes: selectedEvent.ticketTypes.map((t) => ({
          name: t.name,
          description: t.description || "",
          price: Number(t.price) || 0,
          totalAvailable: Number(t.totalAvailable) || 0,
        })),
      };

      const res = await onSave(payload as Events);

      if (res?.status === 400 && res?.fieldErrors) {
        const parsed: Record<string, string> = {};
        const parsedTickets: Record<number, Record<string, string>> = {};

        res.fieldErrors.forEach((e: any) => {
          if (e.field.startsWith("ticketTypes")) {
            const match = e.field.match(/ticketTypes\[(\d+)\]\.(.+)/);
            if (match) {
              const index = Number(match[1]);
              const field = match[2];
              if (!parsedTickets[index]) parsedTickets[index] = {};
              parsedTickets[index][field] = e.message;
            }
          } else {
            parsed[e.field] = e.message;
          }
        });

        setErrors(parsed);
        setTicketErrors(parsedTickets);
      } else if (res?.error) {
        setErrors({ global: res.message || "Something went wrong" });
      } else {
        setErrors({});
        setTicketErrors({});
        onClose();
      }
    } catch (err: any) {
      if (err.response?.data?.fieldErrors) {
        const parsed: Record<string, string> = {};
        const parsedTickets: Record<number, Record<string, string>> = {};

        err.response.data.fieldErrors.forEach((e: any) => {
          if (e.field.startsWith("ticketTypes")) {
            const match = e.field.match(/ticketTypes\[(\d+)\]\.(.+)/);
            if (match) {
              const index = Number(match[1]);
              const field = match[2];
              if (!parsedTickets[index]) parsedTickets[index] = {};
              parsedTickets[index][field] = e.message;
            }
          } else {
            parsed[e.field] = e.message;
          }
        });

        setErrors(parsed);
        setTicketErrors(parsedTickets);
      } else {
        setErrors({ global: err.message || "Something went wrong" });
      }
    }
  };

  const getError = (f: string) =>
    errors[f] && <p className="text-red-500 text-sm mt-1">{errors[f]}</p>;

  const getTicketError = (i: number, field: string) =>
    ticketErrors[i]?.[field] && (
      <p className="text-red-500 text-sm mt-1">{ticketErrors[i][field]}</p>
    );

  const getTicketColor = (name?: string) => {
    if (!name) return "bg-gray-200 dark:bg-gray-700";
    const key = name.toLowerCase();
    if (key.includes("vvip")) return "bg-yellow-400 dark:bg-yellow-600";
    if (key.includes("vip")) return "bg-blue-400 dark:bg-blue-600";
    if (key.includes("regular")) return "bg-gray-300 dark:bg-gray-700";
    return "bg-gray-200 dark:bg-gray-700";
  };

  const totalRevenue = selectedEvent.ticketTypes.reduce(
    (sum, t) => sum + (t.price || 0) * (t.totalAvailable || 0),
    0
  );

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border ${
      errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-700"
    }`;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          {selectedEvent.id ? "✏️ Edit Event" : "🆕 Create Event"}
        </h2>

        {errors.global && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl mb-4">
            {errors.global}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Event Name */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Event Name
            </label>
            <input
              type="text"
              value={selectedEvent.name || ""}
              onChange={(e) => updateEventField("name", e.target.value)}
              placeholder="Enter event name"
              className={inputClass("name")}
            />
            {getError("name")}
          </div>

          {/* Venue */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Venue
            </label>
            <input
              type="text"
              value={selectedEvent.venue || ""}
              onChange={(e) => updateEventField("venue", e.target.value)}
              placeholder="Enter venue"
              className={inputClass("venue")}
            />
            {getError("venue")}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Description
            </label>
            <textarea
              value={selectedEvent.description || ""}
              onChange={(e) => updateEventField("description", e.target.value)}
              placeholder="Enter description"
              className={inputClass("description") + " min-h-[100px]"}
            />
            {getError("description")}
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Image URL
            </label>
            <input
              type="text"
              value={selectedEvent.imageUrl || ""}
              onChange={(e) => updateEventField("imageUrl", e.target.value)}
              placeholder="Enter image URL"
              className={inputClass("imageUrl")}
            />
            {getError("imageUrl")}
            {selectedEvent.imageUrl && (
              <img
                src={selectedEvent.imageUrl}
                alt="Preview"
                className="w-full h-44 object-cover rounded-xl border border-gray-300 dark:border-gray-700 mt-2"
              />
            )}
          </div>

          {/* Start / End */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                value={formatDateTimeLocal(selectedEvent.start)}
                onChange={(e) => handleDateChange("start", e.target.value)}
                className={inputClass("start")}
              />
              {getError("start")}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                value={formatDateTimeLocal(selectedEvent.end)}
                onChange={(e) => handleDateChange("end", e.target.value)}
                className={inputClass("end")}
              />
              {getError("end")}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Capacity
            </label>
            <input
              type="number"
              value={selectedEvent.capacity || 0}
              onChange={(e) =>
                updateEventField("capacity", parseInt(e.target.value))
              }
              placeholder="Enter capacity"
              className={inputClass("capacity")}
            />
            {getError("capacity")}
          </div>

          {/* Ticket Types */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Ticket Types
              </label>
              <button
                type="button"
                onClick={addTicketType}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm"
              >
                + Add Ticket
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {selectedEvent.ticketTypes.map((ticket: TicketType, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl ${getTicketColor(ticket.name)}`}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Ticket Name"
                      value={ticket.name || ""}
                      onChange={(e) =>
                        updateTicketType(i, "name", e.target.value)
                      }
                      className={`flex-1 px-3 py-2 rounded-md border ${
                        ticketErrors[i]?.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {getTicketError(i, "name")}
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price || 0}
                      onChange={(e) =>
                        updateTicketType(i, "price", Number(e.target.value))
                      }
                      className={`w-28 px-3 py-2 rounded-md border ${
                        ticketErrors[i]?.price
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {getTicketError(i, "price")}
                    <input
                      type="number"
                      placeholder="Qty"
                      value={ticket.totalAvailable || 0}
                      onChange={(e) =>
                        updateTicketType(i, "totalAvailable", Number(e.target.value))
                      }
                      className={`w-24 px-3 py-2 rounded-md border ${
                        ticketErrors[i]?.totalAvailable
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {getTicketError(i, "totalAvailable")}
                    <input
                      type="text"
                      placeholder="Description"
                      value={ticket.description || ""}
                      onChange={(e) =>
                        updateTicketType(i, "description", e.target.value)
                      }
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      onClick={() => removeTicketType(i)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ticket Preview */}
            <div className="mt-4">
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                Ticket Preview
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.ticketTypes.map((tt, idx) => (
                  <div
                    key={idx}
                    className={`${getTicketColor(tt.name)} px-3 py-2 rounded-lg text-white font-semibold`}
                  >
                    {tt.name} - ${tt.price} ({tt.totalAvailable})
                  </div>
                ))}
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">
                Total Revenue: ${totalRevenue}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Status
            </label>
            <select
              value={selectedEvent.status}
              onChange={(e) =>
                updateEventField("status", e.target.value as EventStatus)
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700"
            >
              <option value={EventStatus.DRAFT}>Draft</option>
              <option value={EventStatus.PUBLISHED}>Published</option>
              <option value={EventStatus.CANCELLED}>Cancelled</option>
              <option value={EventStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;