import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "../types";
import { useCartStore } from "@/store/cartStore";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  role: Role | null;

  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  setToken: (accessToken: string, refreshToken?: string) => void;
  updateUserRole: (userId: string, newRole: Role) => void;
  updateUserInfo: (updatedInfo: Partial<User>) => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      role: null,


      login: (user, accessToken, refreshToken) => {
        const role: Role = user.role ?? Role.USER;
        const normalizedUser: User = { ...user, role };

        const cartStore = useCartStore.getState();
        cartStore.setUserId(user.id);

        set({
          user: normalizedUser,
          token: accessToken,
          refreshToken: refreshToken ?? null,
          role,
        });
      },


      logout: () => {
        const cartStore = useCartStore.getState();
        cartStore.setUserId(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null, token: null, refreshToken: null, role: null });
      },

      setToken: (accessToken, refreshToken) => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        set((state) => ({
          token: accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        }));
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

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user;
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          console.log("🔄 Auth store rehydrated with token");
        }
      },
    }
  )
);