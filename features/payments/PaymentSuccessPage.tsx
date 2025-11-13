import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";
import { CheckCircleIcon, CurrencyDollarIcon, ReceiptPercentIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const PaymentSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      if (!orderId) {
        toast.error("Invalid order");
        navigate("/");
        return;
      }
      try {
        const res = await orderService.getOrderId(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-lg w-full text-center border border-gray-200 dark:border-gray-700">
        
        {/* ✅ Success Icon */}
        <div className="flex justify-center">
          <CheckCircleIcon className="h-24 w-24 text-green-500 animate-bounce" />
        </div>

        {/* 🎉 Heading */}
        <h1 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">
          Payment Successful
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Thank you for your payment! Your order is confirmed.
        </p>

        {/* 🔹 Order Details */}
        {order && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl shadow-inner space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <ReceiptPercentIcon className="h-6 w-6 text-blue-500" />
              <span className="font-medium">Order ID:</span>
              <span className="text-gray-700 dark:text-gray-200">{order.orderId ?? order.id}</span>
            </div>

            <div className="flex items-center space-x-3">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-yellow-500" />
              <span className="font-medium">Bill No:</span>
              <span className="text-gray-700 dark:text-gray-200">{order.billNumber}</span>
            </div>

            <div className="flex items-center space-x-3">
              <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
              <span className="font-medium">Amount:</span>
              <span className="text-gray-700 dark:text-gray-200">${order.totalAmount?.toFixed(2)}</span>
            </div>

            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <span className="font-medium">Status:</span>
              <span className="text-green-600 font-semibold">{order.status}</span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition transform hover:scale-105"
          >
            Back to Home
          </button>

          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            disabled={!order}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition transform hover:scale-105 disabled:opacity-50"
          >
            View Order Details
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Secure Payment powered by Bakong
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;