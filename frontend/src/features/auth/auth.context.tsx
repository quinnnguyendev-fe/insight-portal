import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser, LoginCredentials } from "./auth.types";
import { getCurrentUser, Login as loginApi } from "./auth.api";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const TOKEN_KEY = "access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY) || null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initializeAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initializeAuth();
  }, [token]);

  async function login(credentials: LoginCredentials) {
    const response = await loginApi(credentials);

    localStorage.setItem(TOKEN_KEY, response.accessToken);
    setToken(response.accessToken);
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
