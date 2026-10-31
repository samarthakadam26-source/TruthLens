import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  updateProfile,
} from '@/services/api';
import type { AuthUser } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateFullName: (name: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, ask the backend whether a session cookie is active.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const current = await getCurrentUser();
      if (!cancelled) {
        setUser(current);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const created = await apiRegister(email, password, fullName);
      setUser(created);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Registration failed.' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const loggedIn = await apiLogin(email, password);
      setUser(loggedIn);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Login failed.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // even if the network call fails, clear the local user
    }
    setUser(null);
  }, []);

  const updateFullName = useCallback(async (name: string) => {
    try {
      const updated = await updateProfile(name);
      setUser(updated);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Could not update your name.' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateFullName }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}