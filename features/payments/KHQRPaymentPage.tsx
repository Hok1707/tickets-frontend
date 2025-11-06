import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentService } from "@/services/paymentService";
import { orderService } from "@/services/orderService";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import { BakongCheckTxnResponse, QRpayload } from "@/types";

const QR_EXPIRE_TIME = 300;

const KHQRPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [qrData, setQrData] = useState<string | null>(null);
  const [billNumber, setBillNumber] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [md5Hash, setMd5Hash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency] = useState<string>("USD");
  const [timer, setTimer] = useState(QR_EXPIRE_TIME);
  const [expired, setExpired] = useState(false);
  const [code, setCode] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  const initRef = useRef(false);
  const pollRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      if (!orderId) {
        toast.error("Invalid Order ID");
        navigate("/checkout");
        return;
      }

      try {
        const orderRes = await orderService.getOrderId(orderId);
        const order = orderRes.data;

        setBillNumber(order.billNumber);
        setAmount(order.totalAmount);

        await generateQRCode(orderId, {
          amount: order.totalAmount,
          currency,
          billNumber: order.billNumber,
        });
      } catch (err) {
        console.error(err);
        toast.error("Unable to initialize payment");
        navigate("/checkout");
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      clearPolling();
      clearCountdown();
    };
  }, [orderId, navigate, currency]);

  const generateQRCode = async (id: string, payload: QRpayload) => {
    setLoading(true);
    setExpired(false);
    setTimer(QR_EXPIRE_TIME);
    setCode(1);
    try {
      const qrRes = await paymentService.generateKHQR(id, payload);
      const qrDataRes = qrRes?.data?.data;
      if (!qrDataRes?.qr) {
        toast.error("Failed to generate KHQR");
        navigate("/checkout");
        return;
      }
      console.log('res qr ', qrDataRes);
      setQrData(qrDataRes.qr);
      setMd5Hash(qrDataRes.md5);
      startCountdown();
      startPolling(qrDataRes.md5);
    } catch (err) {
      console.error("generateKHQR error:", err);
      toast.error("Failed to generate QR. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (md5?: string | null) => {
    clearPolling();
    if (!md5) return;
    pollRef.current = window.setInterval(async () => {
      try {
        const res: BakongCheckTxnResponse =
          await paymentService.checkTxnByMd5(md5);
        const txnCode = res?.responseCode;
        setCode(txnCode);
        setMessage(res.responseMessage);
        console.log('res = ', res);
        if (txnCode === 0) {
          toast.success("✅ Payment Success!");
          await paymentService.updateOrderStatus(orderId!, {
            status: "PAID",
            md5Hash: md5
          });
          console.log(`md5, `, md5);
          clearPolling();
          navigate(`/payment-success/${orderId}`);
        } else if (txnCode === 1) {
          toast.error(`Payment ${message}. Please try again.`);
          clearPolling();
        }
      } catch (err) {
        console.warn("Polling failed:", err);
      }
    }, 10000);
  };

  const clearPolling = () => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startCountdown = () => {
    clearCountdown();
    setTimer(QR_EXPIRE_TIME);
    setExpired(false);

    countdownRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearCountdown();
          setExpired(true);
          clearPolling();
          toast.error("QR expired. You can regenerate a new QR.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearCountdown = () => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPolling();
      clearCountdown();
    };
  }, []);

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const handleRegenerate = async () => {
    if (!orderId || !amount || !billNumber) {
      toast.error("Missing order data");
      return;
    }
    await generateQRCode(orderId, {
      amount,
      currency,
      billNumber,
    });
  };

  const handleCopy = async () => {
    if (!qrData) return toast.error("No QR to copy");
    try {
      await navigator.clipboard.writeText(qrData);
      toast.success("QR payload copied to clipboard");
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
      const size = 480;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        toast.error("Failed to prepare image");
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Export failed");
          URL.revokeObjectURL(url);
          return;
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        toast.success("QR downloaded");
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      toast.error("Failed to convert SVG");
    };
    img.src = url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full text-center">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300"
            aria-label="Go back"
          >
            ← Back
          </button>
          <span className="text-xs text-gray-400">{status ? `Status: ${status}` : "Waiting"}</span>
        </div>

        <h2 className="text-2xl font-semibold mb-2">Scan to Pay</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Use Bakong KHQR to complete your payment
        </p>

        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm mx-auto w-fit">
          {loading ? (
            <div className="w-[240px] h-[240px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
          ) : qrData ? (
            <div ref={(el) => {
              if (el) {
                const svg = el.querySelector("svg");
                if (svg) svgRef.current = svg as SVGSVGElement;
              }
            }}>
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
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-orange-500">
              QR will expire in:
              <span className="ml-2 font-mono">{formatTime(timer)}</span>
            </p>
            <p className="text-xs text-gray-400">{expired ? "Expired" : `${Math.round((timer / QR_EXPIRE_TIME) * 100)}%`}</p>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all`}
              style={{ width: `${(timer / QR_EXPIRE_TIME) * 100}%` }}
            />
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Waiting for payment confirmation…
        </p>

        <div className="flex items-center justify-center space-x-2 mt-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
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

      <p className="text-xs text-gray-400 mt-2">
        Secure Payment powered by Bakong
      </p>
    </div>
  );
};

export default KHQRPaymentPage;