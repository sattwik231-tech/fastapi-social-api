import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import {
  cacheUser,
  clearAuth,
  getCachedUser,
  getUserIdFromToken,
  getToken,
  isTokenExpired,
  setToken,
} from "../lib/auth";

interface AuthUser {
  id: number;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const token = getToken();
    if (!token || isTokenExpired()) {
      clearAuth();
      setUser(null);
      setIsLoading(false);
      return;
    }

    const cached = getCachedUser();
    if (cached) {
      setUser(cached);
      setIsLoading(false);
      return;
    }

    const userId = getUserIdFromToken();
    if (userId) {
      try {
        const profile = await api.getUser(userId);
        const u = { id: profile.id, email: profile.email };
        cacheUser(u);
        setUser(u);
      } catch {
        clearAuth();
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await api.login(email, password);
    setToken(access_token);
    const userId = getUserIdFromToken();
    if (!userId) throw new Error("Invalid token");
    const profile = await api.getUser(userId);
    const u = { id: profile.id, email: profile.email };
    cacheUser(u);
    setUser(u);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const profile = await api.register(email, password);
    await login(email, password);
    cacheUser({ id: profile.id, email: profile.email });
    setUser({ id: profile.id, email: profile.email });
  }, [login]);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
