import { useEffect } from 'react';
import { useReminderStore } from '../store/reminderStore';

const REMINDER_CHECK_INTERVAL = 30000; // Check every 30 seconds

export const useReminders = () => {
  const { reminders, markAsFired } = useReminderStore();

  useEffect(() => {
    const checkReminders = () => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
        return;
      }
      
      const now = new Date();
      reminders.forEach(reminder => {
        if (!reminder.fired && new Date(reminder.reminderDateTime) <= now) {
          new Notification('Upcoming Event Reminder', {
            body: `Don't forget! "${reminder.eventTitle}" is starting soon.`,
            icon: '/vite.svg', // Using the app's favicon as notification icon
          });
          markAsFired(reminder.eventId);
        }
      });
    };

    const intervalId = setInterval(checkReminders, REMINDER_CHECK_INTERVAL);

    // Initial check on app load
    checkReminders();

    return () => clearInterval(intervalId);
  }, [reminders, markAsFired]);
};
