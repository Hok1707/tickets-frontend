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
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    ticketId: "",
    purchaserId: "",
  });

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
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPaid = async () => {
    try {
      setLoading(true);
      console.log(confirmModal.purchaserId, confirmModal.ticketId);
      
      await ticketService.purchaseTickets(
        confirmModal.ticketId,
        confirmModal.purchaserId
      );

      toast.success("Ticket status updated!");
      setConfirmModal({ open: false, ticketId: "", purchaserId: "" });
      fetchTickets(page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketName.toLowerCase().includes(search.toLowerCase()) ||
      t.purchaser.email.toLowerCase().includes(search.toLowerCase()) ||
      t.eventName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <FullScreenLoader />;

  // Pagination helpers
  const goToPage = (p: number) => {
    if (p >= 0 && p < meta.totalPages) setPage(p);
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const total = meta.totalPages;

    for (let i = 0; i < total; i++) {
      // Only show first, last, current, and neighbors
      if (
        i === 0 ||
        i === total - 1 ||
        Math.abs(i - page) <= 1
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`px-3 py-1 border rounded ${
              i === meta.currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {i + 1}
          </button>
        );
      } else if (
        (i === page - 2 && i > 1) ||
        (i === page + 2 && i < total - 2)
      ) {
        pages.push(
          <span key={i} className="px-2">
            ...
          </span>
        );
      }
    }

    return pages;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Tickets Management</h1>

        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="px-3 py-2 border rounded-md w-64 focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />

          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700">
            Filter ▼
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
            <tr>
              {["QR", "Purchaser", "Email", "Ticket", "Status", "Event", "Purchased On", "Actions"].map((h) => (
                <th key={h} className="p-3 whitespace-nowrap">{h}</th>
              ))}
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
                  <div className="flex flex-col md:flex-row md:justify-center gap-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedQr(ticket.qrCode.value)}
                    >
                      View QR
                    </button>

                    {ticket.status !== "PURCHASED" && (
                      <button
                        className="text-green-600 font-semibold hover:text-green-700"
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            ticketId: ticket.id,
                            purchaserId: ticket.purchaser.id,
                          })
                        }
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing page {meta.currentPage + 1} of {meta.totalPages}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-40 dark:border-gray-700"
          >
            Prev
          </button>

          {renderPaginationNumbers()}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= meta.totalPages - 1}
            className="px-3 py-1 border rounded disabled:opacity-40 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      {/* QR Modal */}
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
                  className="w-full rounded-lg"
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Confirm Paid Modal */}
      <Transition appear show={confirmModal.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setConfirmModal({ open: false, ticketId: "", purchaserId: "" })}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
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
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <Dialog.Title className="text-lg font-semibold">Confirm Payment</Dialog.Title>

                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  Are you sure you want to mark this ticket as <b>PAID</b>?  
                  This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() =>
                      setConfirmModal({
                        open: false,
                        ticketId: "",
                        purchaserId: "",
                      })
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={handleConfirmPaid}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}