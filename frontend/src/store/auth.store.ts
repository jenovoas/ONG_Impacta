import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  organizationId: string;
  organization?: { id: string; name: string; slug: string; plan: string };
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        set({ user: user, accessToken: accessToken, refreshToken: refreshToken });
      },
      updateTokens: (accessToken, refreshToken) => {
        set({ accessToken: accessToken, refreshToken: refreshToken });
      },
      clearAuth: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    { name: 'impacta-auth' }
  )
);
