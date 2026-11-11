import React from 'react';
import { Client } from '../types/crm';
import { DollarSign, ShieldCheck, Users, Cpu } from 'lucide-react';

interface MetricsOverviewProps {
  clients: Client[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ clients }) => {
  const totalMrr = clients.reduce((acc, c) => acc + c.monthlyRetainer, 0);

  const totalEngineers = clients.reduce((acc, c) => acc + (c.assignedTeam?.length || 0), 0);

  // Total access items granted vs total
  let totalAccessItems = 0;
  let grantedAccessItems = 0;
  clients.forEach((c) => {
    c.accessChecklist.forEach((item) => {
      totalAccessItems++;
      if (item.isGranted) grantedAccessItems++;
    });
  });
  const accessPercentage = totalAccessItems > 0 ? Math.round((grantedAccessItems / totalAccessItems) * 100) : 0;

  const healthyCount = clients.filter((c) => c.health === 'healthy').length;
  const attentionCount = clients.filter((c) => c.health === 'attention').length;
  const atRiskCount = clients.filter((c) => c.health === 'at-risk').length;
  const onboardingCount = clients.filter((c) => c.health === 'onboarding').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Monthly Retainer Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Monthly Active Retainers</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          ${totalMrr.toLocaleString()}
          <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Active billing contracts</span>
          <span aria-hidden="true">·</span>
          <span>Avg ${(Math.round(totalMrr / (clients.length || 1))).toLocaleString()} / client</span>
        </div>
      </div>

      {/* Metric 2: Setup & Credentials Readiness */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Tech & Access Readiness</span>
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          {accessPercentage}%
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span>{grantedAccessItems} of {totalAccessItems} verified</span>
          <span aria-hidden="true">·</span>
          <span className={onboardingCount > 0 ? 'text-amber-400' : 'text-slate-400'}>
            {onboardingCount} pending setup
          </span>
        </div>
      </div>

      {/* Metric 3: Engineering Squad Allocations */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Squad Eng Deployments</span>
          <Users className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          {totalEngineers}
          <span className="text-xs font-normal text-slate-400 ml-1">assigned</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Across {clients.length} client squads</span>
          <span aria-hidden="true">·</span>
          <span>100% capacity</span>
        </div>
      </div>

      {/* Metric 4: Client Health Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Client Accounts Status</span>
          <Cpu className="w-4 h-4 text-violet-400" />
        </div>
        <div className="text-2xl font-bold font-mono tabular-nums text-white">
          {clients.length}
          <span className="text-xs font-normal text-slate-400 ml-1">clients</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
          <span className="text-emerald-400">{healthyCount} healthy</span>
          <span aria-hidden="true">·</span>
          {attentionCount > 0 && (
            <>
              <span className="text-amber-400">{attentionCount} review</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          {atRiskCount > 0 && <span className="text-rose-400">{atRiskCount} risk</span>}
          {onboardingCount > 0 && <span className="text-blue-400">{onboardingCount} new</span>}
        </div>
      </div>
    </div>
  );
};
