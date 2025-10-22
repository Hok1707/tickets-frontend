import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "../types";
import { useCartStore } from "@/store/cartStore"; // 👈 add this import

interface AuthState {
  user: User | null;
  token: string | null;
  role: Role | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUserRole: (userId: string, newRole: Role) => void;
  updateUserInfo: (updatedInfo: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,

      // ✅ LOGIN
      login: (user, token) => {
        const role: Role = user.role ?? Role.USER;
        const normalizedUser: User = { ...user, role };
        delete (normalizedUser as any).roleName;

        // 👇 Sync with cart-store
        const cartStore = useCartStore.getState();
        cartStore.setUserId(user.id); // load correct cart

        set({
          user: normalizedUser,
          token,
          role,
        });
      },

      // ✅ LOGOUT
      logout: () => {
        const cartStore = useCartStore.getState();

        // 👇 Optional: clear the logged-in user’s cart
        cartStore.setUserId(null);

        set({ user: null, token: null, role: null });
      },

      updateUserRole: (userId, newRole) =>
        set((state) => {
          if (state.user && state.user.id === userId) {
            const updatedUser: User = { ...state.user, role: newRole };
            return { user: updatedUser, role: newRole };
          }
          return state;
        }),

      updateUserInfo: (updatedInfo) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...updatedInfo } } : state
        ),
    }),
    {
      name: "auth-storage",
    }
  )
);