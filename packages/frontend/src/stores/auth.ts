import { create } from "zustand/react";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
}

const useAuthStore = create(
  persist<AuthStore>(
    () => ({
      token: null,
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useAuthToken = () => useAuthStore((state) => state.token);

export const getAuthToken = () => useAuthStore.getState().token;

export const setAuthToken = (token: AuthStore["token"]) =>
  useAuthStore.setState({ token });
