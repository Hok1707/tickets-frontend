import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import {
  TrashIcon,
  XCircleIcon,
  PlusIcon,
  MinusIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } =
    useCartStore();

  const { subtotal, transactionFee, total } = getTotal();
  const { user } = useAuth();
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <CurrencyDollarIcon className="h-6 w-6 text-primary-500" />
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-3">Your cart is empty.</p>
          <Link
            to="/events"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {cart.map((item) => (
              <div
                key={item.ticketType.id}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {item.event.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.ticketType.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ${item.ticketType.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity Controls */}
                  <button
                    onClick={() =>
                      updateQuantity(item.ticketType.id, item.quantity - 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <MinusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.ticketType.id,
                        Math.max(1, parseInt(e.target.value))
                      )
                    }
                    className="w-16 border rounded-md px-2 py-1 text-center dark:bg-gray-700 dark:text-white"
                  />

                  <button
                    onClick={() =>
                      updateQuantity(item.ticketType.id, item.quantity + 1)
                    }
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <PlusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  {/* Subtotal */}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    ${(item.ticketType.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.ticketType.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full"
                    title="Remove"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-800 dark:text-gray-200">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-800 dark:text-gray-200">
              <span>Transaction Fee (5%):</span>
              <span>${transactionFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1"
              >
                <TrashIcon className="h-5 w-5" /> Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-5 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;