/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminFleet } from '../../context/AdminFleetContext';
import { Plus, Globe, DollarSign, TrendingUp, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

interface AltivioAdminConsoleViewProps {
  onOpenNewClientModal: () => void;
}

export const AltivioAdminConsoleView: React.FC<AltivioAdminConsoleViewProps> = ({
  onOpenNewClientModal,
}) => {
  const { tenants, loading, error, toggleTenantModule, resetDemoData } = useAdminFleet();
  const navigate = useNavigate();

  const totalFleetRevenue = tenants.reduce((sum, t) => sum + t.revenueProof.monthlyRevenue, 0);
  const totalAgencyMrr = tenants.reduce((sum, t) => sum + t.monthlyWebsiteFee, 0);
  const avgRoi = (
    tenants.reduce((sum, t) => sum + t.revenueProof.roiMultiplier, 0) / Math.max(1, tenants.length)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Fleet Hero Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Altivio Agency Master · Multi-Tenant Fleet Operations
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              Websites that make money, with the proof.
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Every client website built by Altivio connects to this unified platform. Toggle
              business modules per client, monitor verified attribution, and inspect isolated client
              dashboards.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewClientModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy Client Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Aggregated Fleet Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Deployed Client Sites
            </span>
            <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            {loading ? '—' : tenants.length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
            100% online &amp; audited
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Client Revenue Delivered
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            ${totalFleetRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">
            This month across fleet
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Altivio Retainer MRR</span>
            <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2 tabular-nums">
            ${totalAgencyMrr.toLocaleString()}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block font-mono tabular-nums">
            ${(totalAgencyMrr * 12).toLocaleString()}/yr recurring
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Average Client ROI</span>
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-2 tabular-nums">
            {avgRoi}x
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 inline-block">
            Verified monthly return
          </span>
        </div>
      </div>

      {/* Fleet Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-200">
              Client Website Fleet &amp; Module Controls
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Switch business engines per client via server-enforced API updates.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {tenants.length} Active Tenants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-medium">Client / Domain</th>
                <th className="py-3 px-4 font-medium">Industry</th>
                <th className="py-3 px-4 font-medium">Active Business Module</th>
                <th className="py-3 px-4 font-medium">Verified Earned</th>
                <th className="py-3 px-4 font-medium">Retainer</th>
                <th className="py-3 px-4 font-medium">ROI</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tenants.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white font-mono shrink-0"
                        style={{ backgroundColor: t.brandAccentHex || '#4f46e5' }}
                      >
                        {t.logoInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          {t.customDomain}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{t.industry}</td>

                  <td className="py-3 px-4">
                    <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => toggleTenantModule(t.id, 'service')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                          t.activeModule === 'service'
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        Service
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTenantModule(t.id, 'shop')}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                          t.activeModule === 'shop'
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        Shop
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${t.revenueProof.monthlyRevenue.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-200 tabular-nums">
                    ${t.monthlyWebsiteFee}/mo
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {t.revenueProof.roiMultiplier.toFixed(1)}x
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/app/${t.slug}/overview`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium rounded-lg transition-colors border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer"
                    >
                      <span>Open Client Portal</span>
                      <ArrowRight className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
