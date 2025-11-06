import React, { useState, useEffect, useMemo } from 'react';
import { ticketService } from '@/services/ticketService';
import type { Events, Attendee, TicketStatus } from '@/types';
import { TicketStatus as TicketStatusEnum } from '@/types';
import { 
  XMarkIcon, 
  UserGroupIcon, 
  ArrowDownTrayIcon, 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/solid';
import {
  XMarkIcon as XMarkOutline,
  TagIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type SortOption = 'name-asc' | 'name-desc' | 'email-asc' | 'email-desc' | 'date-asc' | 'date-desc' | 'ticket-asc' | 'ticket-desc';

interface AttendeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Events | null;
}

const AttendeesModal: React.FC<AttendeesModalProps> = ({ isOpen, onClose, event }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');

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
      setSelectedTicketType('All');
      setSelectedStatus('All');
      setSortOption('date-desc');
    }
  }, [isOpen, event]);

  // Get unique ticket types
  const ticketTypes = useMemo(() => {
    const types = new Set(attendees.map(a => a.ticketType.name));
    return ['All', ...Array.from(types).sort()];
  }, [attendees]);

  // Filter and sort attendees
  const filteredAndSortedAttendees = useMemo(() => {
    // Filter
    let filtered = attendees.filter(({ user, ticketType, ticket }) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        ticketType.name.toLowerCase().includes(search);
      const matchTicketType = selectedTicketType === 'All' || ticketType.name === selectedTicketType;
      const matchStatus = selectedStatus === 'All' || ticket.status === selectedStatus;
      return matchSearch && matchTicketType && matchStatus;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.user.username.localeCompare(b.user.username);
        case 'name-desc':
          return b.user.username.localeCompare(a.user.username);
        case 'email-asc':
          return a.user.email.localeCompare(b.user.email);
        case 'email-desc':
          return b.user.email.localeCompare(a.user.email);
        case 'date-asc':
          return new Date(a.ticket.createdAt).getTime() - new Date(b.ticket.createdAt).getTime();
        case 'date-desc':
          return new Date(b.ticket.createdAt).getTime() - new Date(a.ticket.createdAt).getTime();
        case 'ticket-asc':
          return a.ticketType.name.localeCompare(b.ticketType.name);
        case 'ticket-desc':
          return b.ticketType.name.localeCompare(a.ticketType.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [attendees, searchTerm, selectedTicketType, selectedStatus, sortOption]);

  // Calculate statistics
  const stats = useMemo(() => {
    const valid = attendees.filter(a => a.ticket.status === TicketStatusEnum.VALID).length;
    const used = attendees.filter(a => a.ticket.status === TicketStatusEnum.USED).length;
    const ticketTypeCounts = attendees.reduce((acc, a) => {
      acc[a.ticketType.name] = (acc[a.ticketType.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: attendees.length,
      valid,
      used,
      ticketTypeCounts,
    };
  }, [attendees]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTicketType('All');
    setSelectedStatus('All');
    setSortOption('date-desc');
  };

  const hasActiveFilters = searchTerm || selectedTicketType !== 'All' || selectedStatus !== 'All' || sortOption !== 'date-desc';
  
  const handleExportCSV = () => {
    if (!event) return;
    const headers = ['Name', 'Email', 'Ticket Type', 'Status', 'Purchase Date', 'Ticket ID'];
    const rows = filteredAndSortedAttendees.map(att => [
      `"${att.user.username.replace(/"/g, '""')}"`,
      `"${att.user.email}"`,
      `"${att.ticketType.name.replace(/"/g, '""')}"`,
      `"${att.ticket.status}"`,
      `"${new Date(att.ticket.createdAt).toLocaleString()}"`,
      `"${att.ticket.id}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendees_${event.name.replace(/\s/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`✅ Exported ${filteredAndSortedAttendees.length} attendee(s) to CSV!`);
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: TicketStatus) => {
    return status === TicketStatusEnum.VALID
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] flex flex-col w-full max-w-6xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Attendees</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.name}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Statistics Cards */}
        {attendees.length > 0 && (
          <div className="px-6 pb-4 flex-shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Total Attendees</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Valid Tickets</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.valid}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Used Tickets</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.used}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Ticket Types</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{ticketTypes.length - 1}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Filters and Actions */}
        {attendees.length > 0 && (
          <div className="px-6 pb-4 flex-shrink-0 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ticket type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkOutline className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Ticket Type Filter */}
              <div className="relative lg:w-48">
                <TagIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
                <select
                  value={selectedTicketType}
                  onChange={(e) => setSelectedTicketType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  {ticketTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative lg:w-40">
                <FunnelIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as TicketStatus | 'All')}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value={TicketStatusEnum.VALID}>Valid</option>
                  <option value={TicketStatusEnum.USED}>Used</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative lg:w-48">
                <ArrowsUpDownIcon className="h-5 w-5 text-gray-400 absolute top-1/2 -translate-y-1/2 left-3" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="date-desc">Date: Newest First</option>
                  <option value="date-asc">Date: Oldest First</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="email-asc">Email: A to Z</option>
                  <option value="email-desc">Email: Z to A</option>
                  <option value="ticket-asc">Ticket: A to Z</option>
                  <option value="ticket-desc">Ticket: Z to A</option>
                </select>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedAttendees.length}</span> of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">{attendees.length}</span> attendee(s)
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkOutline className="h-3.5 w-3.5" />
                    Clear Filters
                  </button>
                )}
              </div>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ArrowDownTrayIcon className="h-5 w-5"/>
                Export CSV
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-y-auto flex-grow border-t border-b border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading attendees...</p>
            </div>
          ) : attendees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Attendee
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Ticket Type
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Purchased On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedAttendees.map(({ user, ticketType, ticket }) => (
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2">
                            <UserGroupIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                            {user.phoneNumber && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.phoneNumber}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <TagIcon className="h-3 w-3" />
                          {ticketType.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(ticket.status)}`}>
                          {ticket.status === TicketStatusEnum.VALID ? (
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                          ) : (
                            <XCircleIcon className="h-3.5 w-3.5" />
                          )}
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(ticket.createdAt)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAndSortedAttendees.length === 0 && (searchTerm || selectedTicketType !== 'All' || selectedStatus !== 'All') && (
                <div className="text-center py-16">
                  <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No attendees match your current filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    <XMarkOutline className="h-4 w-4" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Attendees Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No tickets have been sold for this event yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Attendees will appear here once tickets are purchased.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {attendees.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <div className="text-gray-600 dark:text-gray-400">
                Total: <span className="font-semibold text-gray-900 dark:text-white">{attendees.length}</span> attendee(s) •{' '}
                Valid: <span className="font-semibold text-green-600 dark:text-green-400">{stats.valid}</span> •{' '}
                Used: <span className="font-semibold text-gray-600 dark:text-gray-400">{stats.used}</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
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
  );
};

export default AttendeesModal;