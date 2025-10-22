import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  BanknotesIcon,
  QrCodeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { orderService } from '@/services/orderService';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<'KHQR' | 'CASH' | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.ticketType.price * item.quantity,
    0
  );
  const transactionFee = cart.reduce(
    (acc, item) => acc + item.ticketType.price * item.quantity * 0.05,
    0
  );
  const total = subtotal + transactionFee;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      const orderPayload = {
        items: cart.map((item) => ({
          eventId: item.event.id,
          ticketTypeId: item.ticketType.id,
          quantity: item.quantity,
          price: item.ticketType.price,
        })),
        subtotal,
        transactionFee,
        total,
        paymentMethod,
      };
      const response = await orderService.purchasedOrder(orderPayload);
      const order = response.data
      if (paymentMethod === 'KHQR') {
        toast.success('Generate Bakong KHQR...');
        // Redirect or show KHQR popup
        navigate(`/payment/khqr/${order.id}`);
      } else {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/orders/${order.id}`);
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftIcon
          className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-primary-600"
          onClick={() => navigate('/cart')}
        />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Checkout
        </h1>
      </div>

      {/* Order Summary */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3 shadow-inner">
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700 dark:text-gray-300">
          <span>Transaction Fee (5%)</span>
          <span>${transactionFee.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-300 dark:border-gray-700 pt-3 flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Select Payment Method
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setPaymentMethod('KHQR')}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition ${
            paymentMethod === 'KHQR'
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
          }`}
        >
          <QrCodeIcon className="w-6 h-6" />
          Bakong KHQR
        </button>

        <button
          onClick={() => setPaymentMethod('CASH')}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition ${
            paymentMethod === 'CASH'
              ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
          }`}
        >
          <BanknotesIcon className="w-6 h-6" />
          Cash on Hand
        </button>
      </div>

      {/* Confirm Button */}
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
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
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
        By confirming, you agree to our{' '}
        <Link to="/terms" className="text-primary-600 hover:underline">
          Terms & Conditions
        </Link>
      </p>
    </div>
  );
};

export default CheckoutPage;