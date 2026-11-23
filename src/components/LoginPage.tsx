/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, ArrowRight, Sun, Moon, ShieldCheck, Building2 } from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    label: 'Altivio Master Admin',
    role: 'Agency Super-Admin · Full Fleet Access',
    email: 'admin@altivio.com',
    pass: 'altivio-admin-2026',
    accent: '#4f46e5',
  },
  {
    label: 'Apex Dental Studio',
    role: 'Client Portal · Service Engine (Tenant Isolated)',
    email: 'dr.sterling@apexdentalstudio.com',
    pass: 'apex-client-2026',
    accent: '#0284c7',
  },
  {
    label: 'Kova Atelier',
    role: 'Client Portal · Shop Engine (Tenant Isolated)',
    email: 'mireille@kova-atelier.com',
    pass: 'kova-client-2026',
    accent: '#7c3aed',
  },
  {
    label: 'Summit HVAC & Electrical',
    role: 'Client Portal · Service Engine (Tenant Isolated)',
    email: 'ron@summithvacservices.com',
    pass: 'summit-client-2026',
    accent: '#d97706',
  },
];

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const { theme, toggleTheme, applyDocumentBranding } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    applyDocumentBranding({
      title: 'Sign In | Altivio OS',
      accentHex: '#4f46e5',
      initials: 'AL',
    });
  }, [applyDocumentBranding]);

  useEffect(() => {
    if (user) {
      if (user.role === 'altivio_admin') {
        navigate('/admin', { replace: true });
      } else if (user.tenantSlug) {
        navigate(`/app/${user.tenantSlug}/overview`, { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const authed = await login(email, password);
      if (authed.role === 'altivio_admin') {
        navigate('/admin', { replace: true });
      } else if (authed.tenantSlug) {
        navigate(`/app/${authed.tenantSlug}/overview`, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setSubmitting(true);
    try {
      const authed = await login(demoEmail, demoPass);
      if (authed.role === 'altivio_admin') {
        navigate('/admin', { replace: true });
      } else if (authed.tenantSlug) {
        navigate(`/app/${authed.tenantSlug}/overview`, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-6 transition-colors">
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
            AL
          </div>
          <span className="font-bold text-sm tracking-tight font-display">Altivio OS</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Auth Grid */}
      <div className="max-w-5xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Sign In Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="space-y-1.5 mb-6">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Authenticated Multi-Tenant Access</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display">
              Sign in to your dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clients access their isolated website revenue proof and operations portal. Altivio
              staff sign in to manage the fleet.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Role & Tenant Isolation Quick Accounts */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold font-display text-slate-900 dark:text-white">
              Role-Enforced Workspace Accounts
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an account below to test server-verified role permissions and strict
              cross-tenant isolation.
            </p>
          </div>

          <div className="space-y-2.5">
            {DEMO_ACCOUNTS.map((acct) => (
              <button
                key={acct.email}
                type="button"
                disabled={submitting}
                onClick={() => handleQuickLogin(acct.email, acct.pass)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 text-left flex items-center justify-between gap-4 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: acct.accent }}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {acct.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {acct.role}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {acct.email}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-1">
                  <span>Sign in</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiet Footer */}
      <footer className="max-w-5xl w-full mx-auto text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800/70">
        <span>Altivio Ltd. Proprietary Platform</span>
        <span className="font-mono">Server-Enforced RBAC &amp; Tenant Isolation</span>
      </footer>
    </div>
  );
};
