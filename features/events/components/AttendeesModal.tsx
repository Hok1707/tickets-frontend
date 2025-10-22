import React, { useState, useEffect, useMemo } from 'react';
import { ticketService } from '@/services/ticketService';
import type { Events, Attendee } from '@/types';
import { XMarkIcon, UserGroupIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface AttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Events | null;
}

const AttendeesModal: React.FC<AttendeesModalProps> = ({ isOpen, onClose, event }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && event) {
      const fetchAttendees = async () => {
        setIsLoading(true);
        try {
          const data = await ticketService.getAttendeesForEvent(event.id);
          setAttendees(data);
        } catch (error) {
          toast.error("Failed to fetch attendees.");
          console.error("Failed to fetch attendees", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAttendees();
    } else {
      setAttendees([]);
      setSearchTerm('');
    }
  }, [isOpen, event]);

  const filteredAttendees = useMemo(() => {
    if (!searchTerm) {
      return attendees;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return attendees.filter(({ user, ticketType }) =>
      user.username.toLowerCase().includes(lowercasedFilter) ||
      user.email.toLowerCase().includes(lowercasedFilter) ||
      ticketType.name.toLowerCase().includes(lowercasedFilter)
    );
  }, [attendees, searchTerm]);
  
  const handleExportCSV = () => {
    if (!event) return;
    const headers = ['Name', 'Email', 'Ticket Type', 'Purchase Date'];
    const rows = attendees.map(att => [
      `"${att.user.username.replace(/"/g, '""')}"`,
      `"${att.user.email}"`,
      `"${att.ticketType.name.replace(/"/g, '""')}"`,
      `"${new Date(att.ticket.purchaseDate).toLocaleString()}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendees_${event.name.replace(/\s/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Full attendee list exported!');
  };


  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] flex flex-col p-6 max-w-4xl w-full">
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendees for "{event.name}"</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? `Showing ${filteredAttendees.length} of ${attendees.length} attendees` : `${attendees.length} ticket(s) sold`}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {attendees.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4 flex-shrink-0">
                <div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
                    <input
                        type="text"
                        placeholder="Search by name, email, ticket..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <button
                    onClick={handleExportCSV}
                    className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                    <ArrowDownTrayIcon className="h-5 w-5"/>
                    Export to CSV
                </button>
            </div>
        )}

        <div className="overflow-y-auto flex-grow border-t border-b border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="text-center py-10">Loading attendees...</div>
          ) : attendees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ticket Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purchased On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAttendees.map(({ user, ticketType, ticket }) => (
                    <tr key={ticket.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ticketType.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(ticket.purchaseDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAttendees.length === 0 && searchTerm && (
                <div className="text-center py-16">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No Results Found</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">No attendees match your search for "{searchTerm}".</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
                <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No Attendees Yet</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">No tickets have been sold for this event yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeesModal;