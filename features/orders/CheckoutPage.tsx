import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { orderService } from "@/services/orderService";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  BanknotesIcon,
  QrCodeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [paymentMethod, setPaymentMethod] = useState<"KHQR" | "CASH" | "">("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { subtotal, transactionFee, total } = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.ticketType.price * item.quantity, 0);
    const transactionFee = subtotal * 0.05;
    return { subtotal, transactionFee, total: subtotal + transactionFee };
  }, [cart]);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      navigate("/login");
    } else if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, user, navigate]);

  const handleCheckout = async () => {
    if (!paymentMethod) return toast.error("Please select a payment method");
    if (!user?.id) return toast.error("User not found");
    setIsProcessing(true);
    try {
      const orderPayload = {
        userId: user.id,
        paymentMethod,
        items: cart.map(item => ({
          eventId: item.event.id,
          eventName: item.event.name,
          ticketTypeId:item.ticketType.id,
          ticketName: item.ticketType.name,
          quantity: item.quantity,
          price: item.ticketType.price
        })),
      };

      const { data: order } = await orderService.purchasedOrder(orderPayload);

      if (paymentMethod === "KHQR") {
        toast.success("Generating Bakong KHQR...");
        navigate(`/payment/khqr/${order.orderId}`);
      } else {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/orders/${order.orderId}`);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error?.response?.data?.message || "Checkout failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftIcon
          className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary-600"
          onClick={() => navigate("/cart")}
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Checkout
        </h1>
      </div>

      <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3 shadow-inner">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Transaction Fee (5%)" value={transactionFee} />
        <SummaryRow label="Total" value={total} highlight />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Select Payment Method
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <PaymentOption
          label="Bakong KHQR"
          icon={<QrCodeIcon className="w-6 h-6" />}
          active={paymentMethod === "KHQR"}
          onClick={() => setPaymentMethod("KHQR")}
        />
        <PaymentOption
          label="Cash on Hand"
          icon={<BanknotesIcon className="w-6 h-6" />}
          active={paymentMethod === "CASH"}
          onClick={() => setPaymentMethod("CASH")}
        />
      </div>

      <button
        disabled={isProcessing}
        onClick={handleCheckout}
        className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-70 transition"
      >
        {isProcessing ? (
          <>
            <svg
              className="w-5 h-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <CheckCircleIcon className="w-5 h-5" />
            Confirm & Pay
          </>
        )}
      </button>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        By confirming, you agree to our{" "}
        <Link to="/terms" className="text-primary-600 hover:underline">
          Terms & Conditions
        </Link>
      </p>
    </div>
  );
};


const SummaryRow: React.FC<{ label: string; value: number; highlight?: boolean }> = ({ label, value, highlight = false }) => (
  <div
    className={`flex justify-between ${highlight ? "border-t border-gray-300 dark:border-gray-700 pt-3 text-lg font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
  >
    <span>{label}</span>
    <span>${value.toFixed(2)}</span>
  </div>
);

const PaymentOption: React.FC<{ label: string; icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition ${active ? "border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400" : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"}`}
  >
    {icon}
    {label}
  </button>
);

export default CheckoutPage;