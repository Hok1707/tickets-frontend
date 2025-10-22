import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Reminder {
  eventId: string;
  eventTitle: string;
  reminderDateTime: string;
  fired: boolean;
}

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'fired'>) => void;
  removeReminder: (eventId: string) => void;
  markAsFired: (eventId: string) => void;
  getReminderByEventId: (eventId: string) => Reminder | undefined;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      addReminder: (reminder) => set((state) => ({
        reminders: [
          ...state.reminders.filter(r => r.eventId !== reminder.eventId), // Remove old one if exists
          { ...reminder, fired: false }
        ]
      })),
      removeReminder: (eventId) => set((state) => ({
        reminders: state.reminders.filter(r => r.eventId !== eventId)
      })),
      markAsFired: (eventId) => set((state) => ({
        reminders: state.reminders.map(r => 
          r.eventId === eventId ? { ...r, fired: true } : r
        )
      })),
      getReminderByEventId: (eventId) => {
        return get().reminders.find(r => r.eventId === eventId);
      }
    }),
    {
      name: 'reminder-storage',
    }
  )
);
