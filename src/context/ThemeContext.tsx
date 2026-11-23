/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

interface BrandingOptions {
  title: string;
  accentHex?: string;
  initials?: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  applyDocumentBranding: (opts: BrandingOptions) => void;
}

const THEME_STORAGE_KEY = 'altivio_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return `rgba(79, 70, 229, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildFaviconDataUri(initials: string, accentHex: string): string {
  const safeInitials = (initials || 'A').slice(0, 2).toUpperCase();
  const safeColor = accentHex || '#4f46e5';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${safeColor}"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold" font-size="13">${safeInitials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const applyDocumentBranding = useCallback((opts: BrandingOptions) => {
    document.title = opts.title;
    const accent = opts.accentHex || '#4f46e5';
    document.documentElement.style.setProperty('--brand-accent', accent);
    document.documentElement.style.setProperty('--brand-accent-soft', hexToRgba(accent, 0.12));

    const faviconEl = document.getElementById('app-favicon') as HTMLLinkElement | null;
    if (faviconEl) {
      faviconEl.href = buildFaviconDataUri(opts.initials || 'A', accent);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, applyDocumentBranding }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
