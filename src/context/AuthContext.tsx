/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../types/altivio';
import { apiFetch, setStoredToken } from '../api/client';

interface AuthContextType {
  user: AuthUser | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiFetch<{ user: AuthUser }>('/api/auth/me')
      .then((res) => {
        if (mounted) setUser(res.user);
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setStoredToken(null);
        }
      })
      .finally(() => {
        if (mounted) setIsAuthLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const res = await apiFetch<{ user: AuthUser; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore logout transport error
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
