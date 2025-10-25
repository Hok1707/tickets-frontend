import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentService } from "@/services/paymentService";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { QRpayload } from "@/types";
import { orderService } from "@/services/orderService";

const KHQRPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [qrData, setQrData] = useState<string | null>(null);
  const [billNumber, setBillNumber] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [currency] = useState<string>("USD");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid order ID");
      navigate("/checkout");
      return;
    }

    const fetchKHQR = async () => {
      try {
        const orderResponse = await orderService.getOrderId(orderId);
        const orderData = orderResponse.data;
        console.log("Order amount:", orderData.totalAmount);

        setBillNumber(orderData.billNumber);
        setAmount(orderData.totalAmount);

        const qrPayload: QRpayload = {
          amount: orderData.totalAmount,
          currency,
          billNumber: orderData.billNumber,
        };

        const qrResponse = await paymentService.generateKHQR(orderId, qrPayload);
        const qrDataRes = qrResponse?.data.data      
        console.log("KHQR Response:", qrDataRes);

        if (!qrDataRes?.qr) {
          toast.error("Failed to generate KHQR");
          navigate("/checkout");
          return;
        }

        setQrData(qrDataRes.qr);
      } catch (error) {
        console.error("KHQR Error:", error);
        toast.error("Error generating KHQR");
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    fetchKHQR();
  }, [orderId, navigate, currency]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {loading ? (
        <p className="text-lg">Generating KHQR...</p>
      ) : qrData ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Scan to Pay with Bakong KHQR
          </h2>

          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <QRCode value={qrData} size={220} />
          </div>

          {billNumber && (
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Bill Number: <span className="font-medium">{billNumber}</span>
            </p>
          )}

          {amount !== null && (
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Amount: <span className="font-medium">
                {currency} {amount.toFixed(2)}
              </span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-red-500">No QR data available.</p>
      )}
    </div>
  );
};

export default KHQRPaymentPage;