import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";
import { Events } from "@/types/events";
import { TicketType } from "@/types/tickets";
import { CartItem } from "@/types/orders";

interface CartState {
  userId: string | null;
  cart: CartItem[];
  setUserId: (id: string | null) => void;
  addToCart: (event: Events, ticketType: TicketType) => void;
  removeFromCart: (ticketId: string) => void;
  updateQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => { subtotal: number; transactionFee: number; total: number };
  loadCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  userId: null,
  cart: [],

  setUserId: (id) => {
    const { userId } = get();

    if (!id) {
      set({ userId: null, cart: [] });
      return;
    }

    if (id !== userId) {
      const stored = localStorage.getItem(`cart_${id}`);
      const cart = stored ? JSON.parse(stored) : [];
      set({ userId: id, cart });
    }
  },

  loadCart: () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    const stored = localStorage.getItem(`cart_${userId}`);
    const cart = stored ? JSON.parse(stored) : [];
    set({ userId, cart });
  },

  addToCart: (event, ticketType) => {
    const { cart } = get();
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.warn("User not set. Cannot add to cart.");
      return;
    }

    const existing = cart.find(
      (i) => i.ticketType.id === ticketType.id && i.event.id === event.id
    );

    let newCart;
    if (existing) {
      existing.quantity += 1;
      newCart = [...cart];
    } else {
      newCart = [...cart, { event, ticketType, quantity: 1 }];
    }

    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    set({ userId, cart: newCart });
  },

  removeFromCart: (ticketId) => {
    const { cart } = get();
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const newCart = cart.filter((i) => i.ticketType.id !== ticketId);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    set({ userId, cart: newCart });
  },

  updateQuantity: (ticketId, quantity) => {
    const { cart } = get();
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const item = cart.find((i) => i.ticketType.id === ticketId);
    if (!item) return;
    item.quantity = quantity > 0 ? quantity : 1;

    const newCart = [...cart];
    localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    set({ userId, cart: newCart });
  },

  clearCart: () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    localStorage.setItem(`cart_${userId}`, "[]");
    set({ userId, cart: [] });
  },

  getTotal: () => {
    const { cart } = get();
    const subtotal = cart.reduce(
      (acc, i) => acc + i.ticketType.price * i.quantity,
      0
    );
    const transactionFee = subtotal * 0.05;
    const total = subtotal + transactionFee;
    return { subtotal, transactionFee, total };
  },
}));