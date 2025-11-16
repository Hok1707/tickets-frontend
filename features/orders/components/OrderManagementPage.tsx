import React, { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import toast from "react-hot-toast";
import { FunnelIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { OrderPageResponse } from "@/types/orders";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<OrderPageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [meta, setMeta] = useState({
    totalPages: 0,
    totalItems: 0,
    currentPage: 0,
  });

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<OrderPageResponse[]>([]);

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    newStatus: string | null;
  }>({ isOpen: false, orderId: null, newStatus: null });

  const STATUS_COLORS: any = {
    PAID: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border border-green-600/20",
    PENDING:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-600/20",
    CANCELLED:
      "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border border-red-600/20",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders(page, size);

      setOrders(res.data.items);
      setFiltered(res.data.items);
      setMeta({
        totalPages: res.data.totalPages,
        totalItems: res.data.totalItems,
        currentPage: res.data.currentPage,
      });
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  useEffect(() => {
    if (!search.trim()) return setFiltered(orders);

    const s = search.toLowerCase();
    setFiltered(
      orders.filter(
        (o) =>
          o.billNumber.toLowerCase().includes(s) ||
          o.paymentMethod.toLowerCase().includes(s) ||
          o.status.toLowerCase().includes(s)
      )
    );
  }, [search, orders]);

  const openStatusModal = (orderId: string, newStatus: string) => {
    setStatusModal({ isOpen: true, orderId, newStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusModal.orderId || !statusModal.newStatus) return;

    try {
      await orderService.updateOrderStatus(statusModal.orderId, {
        status: statusModal.newStatus,
      });

      toast.success(`Order updated to ${statusModal.newStatus}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setStatusModal({ isOpen: false, orderId: null, newStatus: null });
    }
  };

  if (loading)
    return (
      <div className="p-6 animate-pulse text-gray-600 dark:text-gray-400">
        Loading orders...
      </div>
    );

  return (
    <div className="p-6 space-y-6 transition-all duration-300">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Orders
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              className="pl-10 pr-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none w-64 shadow-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <FunnelIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button className="px-4 py-2 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Bill No</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y dark:divide-gray-800">
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3 font-medium dark:text-white">{order.billNumber}</td>

                <td className="p-3 font-semibold text-blue-600 dark:text-blue-300">
                  ${order.totalAmount.toFixed(2)}
                </td>

                <td className="p-3 dark:text-white">{order.paymentMethod}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-3 dark:text-white">
                  {new Date(order.createdAt).toLocaleString()}
                </td>

                <td className="p-3 text-center space-x-2">
                  {order.status !== "PAID" && (
                    <button
                      onClick={() => openStatusModal(order.id, "PAID")}
                      className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                    >
                      Mark Paid
                    </button>
                  )}

                  {order.status !== "CANCELLED" && (
                    <button
                      onClick={() => openStatusModal(order.id, "CANCELLED")}
                      className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      Cancel
                    </button>
                  )}

                  <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-4">
        <p className="text-gray-600 dark:text-blue-400 text-sm">
          Page {meta.currentPage + 1} / {meta.totalPages}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-4 py-1.5 border rounded-lg dark:border-white disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-200 transition dark:text-red-600"
          >
            Prev
          </button>

          <button
            disabled={page >= meta.totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-4 py-1.5 border rounded-lg dark:border-gray-100 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition dark:text-green-600"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={statusModal.isOpen}
        onClose={() =>
          setStatusModal({ isOpen: false, orderId: null, newStatus: null })
        }
        onConfirm={confirmStatusUpdate}
        title="Update Order Status"
        message={
          <span>
            Change status to <strong>{statusModal.newStatus}</strong>?
          </span>
        }
        confirmButtonText="Confirm"
      />
    </div>
  );
}