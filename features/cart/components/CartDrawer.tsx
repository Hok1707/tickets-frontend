import { useCartStore } from "@/store/cartStore";

export default function CartDrawer({ onCheckout }: { onCheckout: () => void }) {
  const { cart,updateQuantity,removeFromCart,getTotal,clearCart } = useCartStore();

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-300">
        No tickets in cart.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
      {cart.map(item => (
        <div key={item.ticketType.id} className="flex justify-between items-center border-b pb-2">
          <div>
            <p className="font-medium">{item.event.name}</p>
            <p className="text-sm text-gray-500">{item.ticketType.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.ticketType.id, parseInt(e.target.value) || 1)}
              className="w-16 border rounded-md px-2 py-1"
            />
            <span className="font-semibold">${getTotal().subtotal}</span>
            <button
              onClick={() => removeFromCart(item.ticketType.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center font-bold text-lg border-t pt-3">
        <span>Total</span>
        <span>${getTotal().total}</span>
      </div>

      <div className="flex justify-between">
        <button
          onClick={clearCart}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          Clear
        </button>
        <button
          onClick={onCheckout}
          className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
