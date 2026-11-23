/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { Tenant } from '../types/altivio';
import { ExternalLink, Plus, Sun, Moon, LogOut, Menu, ArrowLeft } from 'lucide-react';

interface AltivioHeaderProps {
  mode: 'tenant' | 'admin';
  tenant?: Tenant;
  onOpenMobileNav?: () => void;
  onOpenNewClientModal?: () => void;
}

export const AltivioHeader: React.FC<AltivioHeaderProps> = ({
  mode,
  tenant,
  onOpenMobileNav,
  onOpenNewClientModal,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/75 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 z-20">
      {/* Zone 1: Brand / Current Tenant Identity */}
      <div className="flex items-center gap-3 min-w-0">
        {mode === 'tenant' && onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 -ml-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {mode === 'tenant' && tenant ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white font-mono shrink-0"
              style={{ backgroundColor: tenant.brandAccentHex || '#4f46e5' }}
            >
              {tenant.logoInitials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate font-display">
                {tenant.name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                <a
                  href={`https://${tenant.customDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline inline-flex items-center gap-1 truncate"
                >
                  <span>{tenant.customDomain}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
                <span aria-hidden="true">·</span>
                <span>{tenant.activeModule === 'service' ? 'Service Engine' : 'Shop Engine'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0">
              AL
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white font-display truncate">
                Altivio Partner Console
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Agency Fleet Operations
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone 2: Authenticated Context (Admin Return Link if Admin Inspecting Tenant) */}
      <div className="hidden md:flex items-center gap-4 text-xs">
        {mode === 'tenant' && user?.role === 'altivio_admin' && (
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium whitespace-nowrap transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Fleet Console</span>
          </Link>
        )}
      </div>

      {/* Zone 3: Theme Toggle, Admin Deploy Action, User & Sign Out */}
      <div className="flex items-center gap-2.5 shrink-0">
        {mode === 'admin' && onOpenNewClientModal && (
          <button
            type="button"
            onClick={onOpenNewClientModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deploy Client Dashboard</span>
            <span className="sm:hidden">Deploy</span>
          </button>
        )}

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle light or dark mode"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {user && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-right">
              <div className="font-medium text-slate-900 dark:text-white leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {user.role === 'altivio_admin' ? 'Altivio Admin' : 'Client Owner'}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          title="Sign out"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};
