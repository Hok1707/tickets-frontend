import React, { useEffect, useState, Fragment } from "react";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import toast from "react-hot-toast";
import { ticketService } from "@/services/ticketService";
import { TicketPageResponse } from "@/types/tickets";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketPageResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [meta, setMeta] = useState({
    totalPages: 0,
    totalItems: 0,
    currentPage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const fetchTickets = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await ticketService.getAllTickets(pageNum, size);
      setTickets(res.items);
      setMeta({
        totalPages: res.totalPages,
        totalItems: res.totalItems,
        currentPage: res.currentPage,
      });
    } catch (err: any) {
      toast.error("Failed to load tickets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const nextPage = () => {
    if (page < meta.totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketName.toLowerCase().includes(search.toLowerCase()) ||
      t.purchaser.email.toLowerCase().includes(search.toLowerCase()) ||
      t.eventName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <FullScreenLoader />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Tickets Management</h1>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="px-3 py-2 border rounded-md w-64 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            Filter ▼
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export CSV
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
            <tr>
              <th className="p-3">QR</th>
              <th className="p-3">Purchaser</th>
              <th className="p-3">Email</th>
              <th className="p-3">Ticket</th>
              <th className="p-3">Status</th>
              <th className="p-3">Event</th>
              <th className="p-3">Purchased On</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-t hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="p-3">
                  <img
                    src={ticket.qrCode.value}
                    alt="QR Code"
                    className="w-10 h-10 cursor-pointer rounded shadow hover:scale-125 transition-transform"
                    onClick={() => setSelectedQr(ticket.qrCode.value)}
                    title="Click to view full QR"
                  />
                </td>
                <td className="p-3">{ticket.purchaser.username}</td>
                <td className="p-3">{ticket.purchaser.email}</td>
                <td className="p-3">{ticket.ticketName}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      ticket.status === "PURCHASED"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : ticket.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="p-3">{ticket.eventName}</td>
                <td className="p-3">{new Date(ticket.createdAt).toLocaleString()}</td>
                <td className="p-3 text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedQr(ticket.qrCode.value)}
                  >
                    View QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing page {meta.currentPage + 1} of {meta.totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-40 dark:border-gray-700"
          >
            Prev
          </button>
          {[...Array(meta.totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className={`px-3 py-1 border rounded ${
                idx === meta.currentPage
                  ? "bg-blue-600 text-white"
                  : "dark:border-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            disabled={page >= meta.totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-40 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      <Transition appear show={!!selectedQr} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedQr(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => setSelectedQr(null)}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <img
                  src={selectedQr ?? ""}
                  alt="Full QR Code"
                  className="w-full h-auto rounded-lg"
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}