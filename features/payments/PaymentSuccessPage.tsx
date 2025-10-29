import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderService } from "@/services/orderService";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!orderId) {
        toast.error("Invalid order");
        return navigate("/");
      }
      try {
        const res = await orderService.getOrderId(orderId);
        setOrder(res.data);
      } catch {
        toast.error("Failed to load order");
      }
    };
    load();
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md text-center border border-gray-200 dark:border-gray-700">
        
        <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500" />

        <h1 className="text-2xl font-semibold mt-4">
          Payment Successful ✅
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Thank you for your payment!
        </p>

        {order && (
          <div className="mt-5 text-left text-sm space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Bill No:</strong> {order.billNumber}</p>
            <p><strong>Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
            <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{order.status}</span></p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;