import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EventStatus } from "@/types/common";
import { Events } from "@/types/events";

// Zod Schema Validation
const ticketTypeSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  totalAvailable: z.number().min(1, "Quantity must be at least 1"),
  description: z.string().optional(),
});

const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  venue: z.string().min(3, "Venue must be at least 3 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  start: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.nativeEnum(EventStatus),
  ticketTypes: z.array(ticketTypeSchema).min(1, "At least one ticket type is required"),
}).refine((data) => new Date(data.end) > new Date(data.start), {
  message: "End date must be after start date",
  path: ["end"],
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventModalProps {
  event?: Events;
  onClose: () => void;
  onSave: (event: Events) => Promise<any>;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSave }) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      venue: "",
      description: "",
      imageUrl: "",
      start: "",
      end: "",
      capacity: 0,
      status: EventStatus.DRAFT,
      ticketTypes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes",
  });

  // Watch ticket types to calculate revenue
  const watchedTicketTypes = watch("ticketTypes");
  const totalRevenue = watchedTicketTypes?.reduce(
    (sum, t) => sum + (Number(t.price) || 0) * (Number(t.totalAvailable) || 0),
    0
  ) || 0;

  // Initialize form with event data
  useEffect(() => {
    if (event) {
      reset({
        name: event.name || "",
        venue: event.venue || "",
        description: event.description || "",
        imageUrl: event.imageUrl || "",
        start: event.start || "",
        end: event.end || "",
        capacity: event.capacity || 0,
        status: event.status || EventStatus.DRAFT,
        ticketTypes: event.ticketTypes?.map(t => ({
          name: t.name,
          price: Number(t.price),
          totalAvailable: Number(t.totalAvailable),
          description: t.description || ""
        })) || [],
      });
    } else {
      reset({
        name: "",
        venue: "",
        description: "",
        imageUrl: "",
        start: "",
        end: "",
        capacity: 0,
        status: EventStatus.DRAFT,
        ticketTypes: [],
      });
    }
  }, [event, reset]);

  const formatDateTimeLocal = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const handleDateChange = (field: "start" | "end", value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setValue(field, date.toISOString(), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      const payload: Events = {
        ...data,
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        id: event?.id || "",
        organizerId: event?.organizerId || "",
        ticketTypes: data.ticketTypes.map(t => ({
          ...t,
          description: t.description || "",
          id: "", // ID will be handled by backend or is not needed for creation/update payload structure depending on API
          eventId: event?.id || ""
        }))
      };
      await onSave(payload);
      // onClose is handled by parent or we can call it here if onSave is successful
    } catch (error) {
      console.error("Failed to save event", error);
    }
  };

  const getTicketColor = (name?: string) => {
    if (!name) return "bg-gray-200 dark:bg-gray-700";
    const key = name.toLowerCase();
    if (key.includes("vvip")) return "bg-yellow-400 dark:bg-yellow-600";
    if (key.includes("vip")) return "bg-blue-400 dark:bg-blue-600";
    if (key.includes("regular")) return "bg-gray-300 dark:bg-gray-700";
    return "bg-gray-200 dark:bg-gray-700";
  };

  const inputClass = (error?: any) =>
    `w-full px-4 py-3 rounded-xl border ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2`;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl my-8 p-6 animate-fade-in relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          {event?.id ? "✏️ Edit Event" : "🆕 Create Event"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Event Name */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Event Name
            </label>
            <input
              {...register("name")}
              placeholder="Enter event name"
              className={inputClass(errors.name)}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Venue */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Venue
            </label>
            <input
              {...register("venue")}
              placeholder="Enter venue"
              className={inputClass(errors.venue)}
            />
            {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Enter description"
              className={inputClass(errors.description) + " min-h-[100px]"}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Image URL
            </label>
            <input
              {...register("imageUrl")}
              placeholder="Enter image URL"
              className={inputClass(errors.imageUrl)}
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
            {watch("imageUrl") && !errors.imageUrl && (
              <img
                src={watch("imageUrl") || ""}
                alt="Preview"
                className="w-full h-44 object-cover rounded-xl border border-gray-300 dark:border-gray-700 mt-2"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
          </div>

          {/* Start / End */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                defaultValue={formatDateTimeLocal(watch("start"))}
                onChange={(e) => handleDateChange("start", e.target.value)}
                className={inputClass(errors.start)}
              />
              {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start.message}</p>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                defaultValue={formatDateTimeLocal(watch("end"))}
                onChange={(e) => handleDateChange("end", e.target.value)}
                className={inputClass(errors.end)}
              />
              {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end.message}</p>}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Capacity
            </label>
            <input
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="Enter capacity"
              className={inputClass(errors.capacity)}
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>}
          </div>

          {/* Ticket Types */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Ticket Types
              </label>
              <button
                type="button"
                onClick={() => append({ name: "", price: 0, totalAvailable: 0, description: "" })}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                + Add Ticket
              </button>
            </div>
            {errors.ticketTypes && <p className="text-red-500 text-sm mb-2">{errors.ticketTypes.message}</p>}

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`p-3 rounded-xl ${getTicketColor(watch(`ticketTypes.${index}.name`))} transition-colors`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          {...register(`ticketTypes.${index}.name`)}
                          placeholder="Ticket Name"
                          className={`w-full px-3 py-2 rounded-md border ${errors.ticketTypes?.[index]?.name
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                            }`}
                        />
                        {errors.ticketTypes?.[index]?.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.ticketTypes[index]?.name?.message}</p>
                        )}
                      </div>
                      <div className="w-full sm:w-28">
                        <input
                          type="number"
                          {...register(`ticketTypes.${index}.price`, { valueAsNumber: true })}
                          placeholder="Price"
                          className={`w-full px-3 py-2 rounded-md border ${errors.ticketTypes?.[index]?.price
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                            }`}
                        />
                        {errors.ticketTypes?.[index]?.price && (
                          <p className="text-red-500 text-xs mt-1">{errors.ticketTypes[index]?.price?.message}</p>
                        )}
                      </div>
                      <div className="w-full sm:w-24">
                        <input
                          type="number"
                          {...register(`ticketTypes.${index}.totalAvailable`, { valueAsNumber: true })}
                          placeholder="Qty"
                          className={`w-full px-3 py-2 rounded-md border ${errors.ticketTypes?.[index]?.totalAvailable
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                            }`}
                        />
                        {errors.ticketTypes?.[index]?.totalAvailable && (
                          <p className="text-red-500 text-xs mt-1">{errors.ticketTypes[index]?.totalAvailable?.message}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg self-start sm:self-auto"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      {...register(`ticketTypes.${index}.description`)}
                      placeholder="Description (optional)"
                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600"
                    />
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
                {watchedTicketTypes?.map((tt, idx) => (
                  <div
                    key={idx}
                    className={`${getTicketColor(tt.name)} px-3 py-2 rounded-lg text-white font-semibold`}
                  >
                    {tt.name || "New Ticket"} - ${tt.price || 0} ({tt.totalAvailable || 0})
                  </div>
                ))}
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300 font-medium">
                Total Potential Revenue: ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
              Status
            </label>
            <select
              {...register("status")}
              className={inputClass(errors.status)}
            >
              <option value={EventStatus.DRAFT}>Draft</option>
              <option value={EventStatus.PUBLISHED}>Published</option>
              <option value={EventStatus.CANCELLED}>Cancelled</option>
              <option value={EventStatus.COMPLETED}>Completed</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;