import React from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  Sliders, 
  Plus, 
  ExternalLink, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { BusinessModule } from '../../types/altivio';

interface AltivioAdminConsoleViewProps {
  onOpenNewClientModal: () => void;
}

export const AltivioAdminConsoleView: React.FC<AltivioAdminConsoleViewProps> = ({
  onOpenNewClientModal,
}) => {
  const { 
    tenants, 
    activeTenantId, 
    setActiveTenantId, 
    setViewMode, 
    toggleTenantModule 
  } = useAltivio();

  // Aggregate fleet metrics
  const totalFleetRevenue = tenants.reduce((sum, t) => sum + t.revenueProof.monthlyRevenue, 0);
  const totalAgencyMrr = tenants.reduce((sum, t) => sum + t.monthlyWebsiteFee, 0);
  const avgRoi = (
    tenants.reduce((sum, t) => sum + t.revenueProof.roiMultiplier, 0) / Math.max(1, tenants.length)
  ).toFixed(1);

  const handleLaunchTenant = (id: string) => {
    setActiveTenantId(id);
    setViewMode('tenant');
  };

  return (
    <div className="space-y-6">
      {/* Fleet Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">
                Altivio Agency Master
              </span>
              <span className="text-indigo-300 text-xs font-mono">
                Multi-Tenant Client Fleet Operations
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              "Websites that make money, with the proof."
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every client website built by Altivio is connected to this unified engine. Switch modules per client (Service Engine vs Shop Engine), monitor verified proof across the fleet, and defend agency retainers effortlessly.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={onOpenNewClientModal}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Deploy New Client Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregated Fleet Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Deployed Client Sites</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-2 tabular-nums">
            {tenants.length}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 inline-block">100% online & audited</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Client Revenue Delivered</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-2 tabular-nums">
            ${totalFleetRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">This month across all clients</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Altivio Retainer MRR</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white mt-2 tabular-nums">
            ${totalAgencyMrr.toLocaleString()}
            <span className="text-xs font-normal text-slate-500">/mo</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            ${(totalAgencyMrr * 12).toLocaleString()}/yr recurring
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Average Client ROI</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-indigo-400 mt-2 tabular-nums">
            {avgRoi}x
          </div>
          <span className="text-[11px] text-indigo-300 mt-1 inline-block">Irrefutable retainer defense</span>
        </div>
      </div>

      {/* Fleet Management Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-md">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Client Website Fleet & Module Management
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Toggle business modules on/off per client with 1 click. Client dashboards reconfigure instantaneously.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {tenants.length} Active Tenants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                <th className="py-3 px-4 font-medium">Client / Domain</th>
                <th className="py-3 px-4 font-medium">Industry</th>
                <th className="py-3 px-4 font-medium">Active Business Module (1-Click Toggle)</th>
                <th className="py-3 px-4 font-medium">Verified Earned</th>
                <th className="py-3 px-4 font-medium">Monthly Retainer</th>
                <th className="py-3 px-4 font-medium">Client ROI</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white font-mono shrink-0 shadow-xs"
                        style={{ backgroundColor: t.brandAccentHex || '#6366f1' }}
                      >
                        {t.logoInitials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{t.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{t.customDomain}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {t.industry}
                  </td>

                  {/* 1-Click Module Switcher */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
                        <button
                          onClick={() => toggleTenantModule(t.id, 'service')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            t.activeModule === 'service'
                              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Service Engine
                        </button>
                        <button
                          onClick={() => toggleTenantModule(t.id, 'shop')}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                            t.activeModule === 'shop'
                              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Shop Engine
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {t.activeModule === 'service' ? '(Quotes & Leads)' : '(Orders & Stock)'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                    ${t.revenueProof.monthlyRevenue.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-200 tabular-nums">
                    ${t.monthlyWebsiteFee}/mo
                  </td>

                  <td className="py-3 px-4 font-mono font-black text-indigo-400 tabular-nums">
                    {t.revenueProof.roiMultiplier.toFixed(1)}x
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleLaunchTenant(t.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-lg transition-colors border border-slate-700"
                    >
                      <span>Launch Client View</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400" />
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
