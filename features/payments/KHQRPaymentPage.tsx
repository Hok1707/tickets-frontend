import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentService } from "@/services/paymentService";
import { orderService } from "@/services/orderService";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { ticketService } from "@/services/ticketService";
import { useAuth } from "@/hooks/useAuth";
import { BakongCheckTxnResponse } from "@/types/bakong";
import { QRpayload } from "@/types/orders";

const QR_EXPIRE_TIME = 120;

const KHQRPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { user } = useAuth();

  const [qrData, setQrData] = useState<string | null>(null);
  const [billNumber, setBillNumber] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [md5Hash, setMd5Hash] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expired, setExpired] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(QR_EXPIRE_TIME);
  const [currency] = useState<string>("USD");
  const [txnStatus, setTxnStatus] = useState<string>("PENDING");

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid Order ID");
      navigate("/checkout");
      return;
    }

    const init = async () => {
      try {
        const { data: order } = await orderService.getOrderId(orderId);
        setBillNumber(order.billNumber);
        setAmount(order.totalAmount);
        await generateQRCode({
          amount: order.totalAmount,
          currency,
          billNumber: order.billNumber,
        });
      } catch (err) {
        console.error("Init error:", err);
        toast.error("Unable to initialize payment");
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      stopPolling();
      stopCountdown();
    };
  }, [orderId, navigate, currency]);

  const generateQRCode = useCallback(
    async (payload: QRpayload) => {
      try {
        setLoading(true);
        setExpired(false);
        setTimer(QR_EXPIRE_TIME);
        setTxnStatus("PENDING");

        const { data } = await paymentService.generateKHQR(orderId!, payload);
        const qr = data?.data?.qr;
        const md5 = data?.data?.md5;

        if (!qr || !md5) {
          toast.error("Failed to generate KHQR");
          navigate("/checkout");
          return;
        }
        setQrData(qr);
        setMd5Hash(md5);
        startCountdown();
        startPolling(md5);
      } catch (err) {
        console.error("generateKHQR error:", err);
        toast.error("Failed to generate QR. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [orderId, navigate]
  );

  const startPolling = (md5: string) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res: BakongCheckTxnResponse = await paymentService.checkTxnByMd5(md5);
        setTxnStatus(res.status ?? "PENDING");
        switch (res.status) {
          case "SUCCESS":
            stopPolling();
            stopCountdown();
            try {
              await paymentService.updateOrderStatus(orderId, { status: "PAID", md5Hash: md5 });
              toast.success("✅ Payment Success!");
              clearCart();
              await ticketService.purchaseTickets(orderId!, user!.id);
              navigate(`/payment-success/${orderId}`);
            } catch (err) {
              console.error("Order status update failed:", err);
              toast.error("Payment succeeded but failed to update order status. Please contact support.");
            }
            break;
          case "PENDING":
            console.log("Waiting for Bakong confirmation...");
            break;
          case "FAILED":
            toast.error(`Payment failed: ${res.responseMessage}`);
            stopPolling();
            stopCountdown();
            break;

          case "ERROR":
          default:
            toast.error(`Payment error: ${res.responseMessage}`);
            stopPolling();
            stopCountdown();
            break;
        }
      } catch (err) {
        console.warn("Polling failed:", err);
      }
    }, 10000);
  };

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  };

  const startCountdown = () => {
    stopCountdown();
    setTimer(QR_EXPIRE_TIME);
    setExpired(false);

    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopCountdown();
          stopPolling();
          setExpired(true);
          toast.error("QR expired. Please regenerate a new QR.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
  };

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const handleRegenerate = async () => {
    if (!orderId || !amount || !billNumber) {
      toast.error("Missing order data");
      return;
    }
    await generateQRCode({ amount, currency, billNumber });
  };

  const handleCopy = async () => {
    if (!qrData) return toast.error("No QR to copy");
    try {
      await navigator.clipboard.writeText(qrData);
      toast.success("QR payload copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const downloadSvgAsPng = async (fileName = `khqr-${billNumber ?? "qr"}.png`) => {
    if (!svgRef.current) return toast.error("QR not ready");
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgWithNS =
      source.indexOf("http://www.w3.org/2000/svg") === -1
        ? source.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
        : source;

    const svgBlob = new Blob([svgWithNS], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return toast.error("Canvas context missing");
      const size = 480;
      canvas.width = size;
      canvas.height = size;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (!blob) return toast.error("Export failed");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        link.remove();
        toast.success("QR downloaded");
      }, "image/png");
    };
    img.onerror = () => toast.error("Failed to convert SVG");
    img.src = url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full text-center">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300"
          >
            ← Back
          </button>
          <span className="text-xs text-gray-400">{txnStatus}</span>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Scan to Pay</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Use Bakong KHQR to complete your payment
        </p>

        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm mx-auto w-fit">
          {loading ? (
            <div className="w-[240px] h-[240px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          ) : qrData ? (
            <div
              ref={(el) => {
                const svg = el?.querySelector("svg");
                if (svg) svgRef.current = svg as SVGSVGElement;
              }}
            >
              <QRCode value={qrData} size={240} />
            </div>
          ) : (
            <div className="w-[240px] h-[240px] flex items-center justify-center text-sm text-gray-500">
              No QR available
            </div>
          )}
        </div>

        {billNumber && (
          <p className="mt-4 font-medium">
            Bill #: <span className="text-blue-600">{billNumber}</span>
          </p>
        )}

        {amount !== null && (
          <p className="text-lg font-bold mt-1">
            {currency} {amount.toFixed(2)}
          </p>
        )}

        <div className="mt-3 w-full">
          <div className="flex justify-between mb-1 text-sm">
            <p className="text-orange-500">
              Expires in: <span className="font-mono">{formatTime(timer)}</span>
            </p>
            <p className="text-xs text-gray-400">
              {expired ? "Expired" : `${Math.round((timer / QR_EXPIRE_TIME) * 100)}%`}
            </p>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
              style={{ width: `${(timer / QR_EXPIRE_TIME) * 100}%` }}
            />
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Waiting for payment confirmation…
        </p>

        <div className="flex justify-center space-x-2 mt-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleCopy}
            disabled={!qrData}
            className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Copy QR
          </button>

          <button
            onClick={() => downloadSvgAsPng()}
            disabled={!qrData}
            className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Download PNG
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="col-span-2 mt-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {expired ? "Regenerate QR" : "Refresh QR"}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-2">Secure Payment powered by Bakong</p>
    </div>
  );
};

export default KHQRPaymentPage;