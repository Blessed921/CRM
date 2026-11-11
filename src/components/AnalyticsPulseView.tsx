import React from 'react';
import { Client } from '../types/crm';
import { 
  Activity, 
  AlertCircle, 
  ShieldAlert, 
  Cpu, 
  Cloud, 
  Clock, 
  TrendingUp,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AnalyticsPulseViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export const AnalyticsPulseView: React.FC<AnalyticsPulseViewProps> = ({
  clients,
  onSelectClient,
}) => {
  // Aggregate tech counts
  const cloudCounts: Record<string, number> = {};
  const frontendCounts: Record<string, number> = {};
  const dbCounts: Record<string, number> = {};

  clients.forEach((c) => {
    c.techStack.cloud.forEach((item) => {
      const provider = item.split(' ')[0] || item;
      cloudCounts[provider] = (cloudCounts[provider] || 0) + 1;
    });
    c.techStack.frontend.forEach((item) => {
      const fw = item.split(' ')[0] || item;
      frontendCounts[fw] = (frontendCounts[fw] || 0) + 1;
    });
    c.techStack.database.forEach((item) => {
      const db = item.split(' ')[0] || item;
      dbCounts[db] = (dbCounts[db] || 0) + 1;
    });
  });

  // Identify setup bottlenecks
  const clientsWithPendingAccess = clients.filter(
    (c) => c.accessChecklist.some((a) => !a.isGranted)
  );

  const clientsOverCap = clients.filter(
    (c) => c.hoursLoggedMonth > c.hoursMonthlyCap
  );

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Agency Operational Health & Architecture Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cross-agency telemetry on capacity utilization, cloud distribution, and technical bottlenecks.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            <span>Portfolio Scope: </span>
            <span className="text-white font-semibold font-mono tabular-nums">{clients.length} active client accounts</span>
          </div>
        </div>
      </div>

      {/* Actionable Alerts & Bottlenecks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgent Action 1: Credential Blockers */}
        <div className="bg-slate-900 border border-amber-800/40 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Pending Technical Access / Credentials ({clientsWithPendingAccess.length})</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            The following client environments are missing verified IAM credentials or database dumps:
          </p>
          <div className="space-y-2">
            {clientsWithPendingAccess.map((c) => {
              const pendingItems = c.accessChecklist.filter((a) => !a.isGranted);
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectClient(c)}
                  className="p-2.5 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-amber-700/50 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-200">{c.name}</span>
                    <span className="text-slate-400 text-[11px] block mt-0.5">
                      {pendingItems.length} pending: {pendingItems.map((p) => p.label).join(', ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium whitespace-nowrap ml-2">
                    Resolve Vault →
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Action 2: Retainer Cap Overages */}
        <div className="bg-slate-900 border border-rose-800/40 rounded-lg p-4">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Retainer Cap Burn Overages ({clientsOverCap.length})</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Clients exceeding monthly billable caps requiring change orders or contract adjustments:
          </p>
          <div className="space-y-2">
            {clientsOverCap.length === 0 ? (
              <div className="p-3 bg-slate-950/60 rounded border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>All clients within contracted hours.</span>
              </div>
            ) : (
              clientsOverCap.map((c) => {
                const overage = c.hoursLoggedMonth - c.hoursMonthlyCap;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectClient(c)}
                    className="p-2.5 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-rose-700/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">{c.name}</span>
                      <span className="text-slate-400 text-[11px] block mt-0.5 font-mono tabular-nums">
                        {c.hoursLoggedMonth}h logged / {c.hoursMonthlyCap}h limit (+{overage}h billable)
                      </span>
                    </div>
                    <span className="text-[11px] text-rose-400 font-medium whitespace-nowrap ml-2">
                      Review Contract →
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Tech Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cloud Distributions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-3">
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cloud Platforms</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Deployments</span>
          </div>
          <div className="space-y-2 text-xs">
            {Object.entries(cloudCounts).map(([provider, count]) => (
              <div key={provider} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-mono">{provider}</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {count} {count === 1 ? 'client' : 'clients'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Frontend Frameworks */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-3">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Frontend Stacks</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Adoption</span>
          </div>
          <div className="space-y-2 text-xs">
            {Object.entries(frontendCounts).map(([fw, count]) => (
              <div key={fw} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-mono">{fw}</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {count} {count === 1 ? 'client' : 'clients'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Technologies */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-3">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Database Engines</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Engines</span>
          </div>
          <div className="space-y-2 text-xs">
            {Object.entries(dbCounts).map(([db, count]) => (
              <div key={db} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-300 font-mono">{db}</span>
                <span className="font-mono tabular-nums text-slate-400">
                  {count} {count === 1 ? 'client' : 'clients'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
