import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  QrCodeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";

interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  status: string;
}

const KHQRPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (!orderId) return;
    fetchOrderAndQR();
  }, [orderId]);

  const fetchOrderAndQR = async () => {
    try {
      const res = await orderService.getOrderId(orderId);
      const data = res.data
      setOrder(data);
      const qrResponse = await paymentService.bakongGenerate(orderId,data.total)
      setQrImage(qrResponse.data.qrImage);
    } catch (error) {
      toast.error("Failed to load KHQR payment info.");
      console.error(error);
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const timer = setInterval(async () => {
      try {
        setChecking(true);
        const { data } = await paymentService.paymentStatus(orderId)
        if (data.status === "PAID") {
          toast.success("Payment successful!");
          clearInterval(timer);
          navigate(`/orders/${orderId}`);
        }
      } catch (err) {
        console.error("Checking payment failed:", err);
      } finally {
        setChecking(false);
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(timer);
  }, [orderId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          Loading KHQR Payment...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftIcon
          className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary-600"
          onClick={() => navigate("/cart")}
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bakong KHQR Payment
        </h1>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg shadow-inner mb-5">
        <div className="text-center mb-4">
          <QrCodeIcon className="w-10 h-10 mx-auto text-primary-600 mb-2" />
          <p className="text-gray-700 dark:text-gray-300">
            Scan this QR code to complete your payment
          </p>
        </div>

        {qrImage ? (
          <img
            src={qrImage}
            alt="Bakong KHQR"
            className="w-64 h-64 mx-auto border rounded-lg shadow-md"
          />
        ) : (
          <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 text-sm">QR unavailable</p>
          </div>
        )}

        <div className="text-center mt-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Order ID: {order?.id}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Amount: ${order?.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <ClockIcon className="w-5 h-5" />
          <span>Expires in {timeLeft}s</span>
        </div>
        {checking && (
          <span className="text-xs text-primary-600 animate-pulse">
            Checking payment...
          </span>
        )}
      </div>

      {/* Cancel / Manual Check */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <ExclamationTriangleIcon className="w-5 h-5" />
          Cancel Payment
        </button>

        <button
          onClick={() => fetchOrderAndQR()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <CheckCircleIcon className="w-5 h-5" />
          Refresh QR
        </button>
      </div>

      <p className="text-xs text-center mt-6 text-gray-500 dark:text-gray-400">
        This QR will expire after 3 minutes.
      </p>
    </div>
  );
};

export default KHQRPaymentPage;
