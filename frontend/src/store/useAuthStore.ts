import { create } from "zustand";
import { loginAPI } from "../services/allAPI";

export type UserRole = "admin" | "doctor" | "patient";

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: UserRole;
  token: string;
}

interface AuthState {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("authUser") || "null"),

  login: async ({ email, password }): Promise<User> => {
    try {
      const response = await loginAPI({ email, password });
      const { accessToken, user } = response.data;
      const authUser: User = {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        token: accessToken,
      };

      localStorage.setItem("authUser", JSON.stringify(authUser));
      set({ user: authUser });
      return authUser;

      localStorage.setItem("authUser", JSON.stringify(authUser));
      set({ user: authUser });
      return authUser;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem("authUser");
    set({ user: null });
  },
}));
