
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useReminderStore } from '../../../store/reminderStore';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Events } from '@/types/events';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Events;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, event }) => {
  const { addReminder, getReminderByEventId, removeReminder } = useReminderStore();
  const existingReminder = getReminderByEventId(event.id);

  const getDefaultReminderTime = () => {
    if (existingReminder && !existingReminder.fired) {
        return existingReminder.reminderDateTime.substring(0, 16);
    }
    const eventDate = new Date(event.start);
    eventDate.setHours(eventDate.getHours() - 1);
    return eventDate.toISOString().substring(0, 16);
  };
  
  const [reminderDateTime, setReminderDateTime] = useState(getDefaultReminderTime);
  
  useEffect(() => {
    if(isOpen) {
        setReminderDateTime(getDefaultReminderTime());
    }
  }, [isOpen, event, existingReminder]);

  const handleSetReminder = async () => {
    if (new Date(reminderDateTime) > new Date(event.start)) {
        toast.error("Reminder time cannot be after the event starts.");
        return;
    }
    
    if (Notification.permission === 'denied') {
      toast.error('Notification permissions are denied. Please enable them in your browser settings.');
      return;
    }
    
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('You need to allow notifications to set a reminder.');
        return;
      }
    }

    addReminder({
      eventId: event.id,
      eventTitle: event.name,
      reminderDateTime: new Date(reminderDateTime).toISOString(),
    });
    
    const formattedDate = new Date(reminderDateTime).toLocaleString();
    toast.success(`Reminder set for ${formattedDate}!`);
    onClose();
  };

  const handleRemoveReminder = () => {
    removeReminder(event.id);
    toast.success('Reminder removed.');
    onClose();
  }
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full">
              <BellIcon className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Set Reminder</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get a notification for "{event.name}"</p>
          </div>
        </div>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="reminder-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notification Date & Time
                </label>
                <input
                    type="datetime-local"
                    id="reminder-time"
                    name="reminder-time"
                    value={reminderDateTime}
                    onChange={(e) => setReminderDateTime(e.target.value)}
                    min={new Date().toISOString().substring(0, 16)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm p-2"
                />
            </div>
            <div className="flex justify-between items-center pt-2">
                <div>
                     {existingReminder && !existingReminder.fired && (
                        <button onClick={handleRemoveReminder} className="px-4 py-2 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900">
                            Remove Reminder
                        </button>
                     )}
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={handleSetReminder} className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">
                        {existingReminder && !existingReminder.fired ? 'Update Reminder' : 'Set Reminder'}
                    </button>
                </div>
            </div>
        </div>
        <style>{`
            @keyframes fade-in-up {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
      </div>
    </div>
  );
};

export default ReminderModal;