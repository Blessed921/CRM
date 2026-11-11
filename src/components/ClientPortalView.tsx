import React, { useState } from 'react';
import { Client, ServicePackage } from '../types/crm';
import { 
  Building2, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Server, 
  Users, 
  GitBranch, 
  Calendar, 
  Mail, 
  MessageSquare,
  ShieldCheck,
  PackageCheck,
  FileText
} from 'lucide-react';

interface ClientPortalViewProps {
  client: Client;
  packageItem?: ServicePackage;
  onSwitchToAdmin: () => void;
  onSelectDifferentClient: (clientId: string) => void;
  allClients: Client[];
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  client,
  packageItem,
  onSwitchToAdmin,
  onSelectDifferentClient,
  allClients,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const currentStageState = client.onboardingStages?.find(
    (s) => s.stageId === client.currentOnboardingStage
  );

  const pendingClientTasks = currentStageState?.tasks.filter((t) => !t.isCompleted) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner explaining Client Portal Mode */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-300">
            Previewing <strong className="text-white">Client Portal View</strong> for{' '}
            <strong className="text-indigo-300">{client.name}</strong>. This is what your client sees when they log into their private dashboard.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={client.id}
            onChange={(e) => onSelectDifferentClient(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-medium"
          >
            {allClients.map((c) => (
              <option key={c.id} value={c.id}>
                Simulate: {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={onSwitchToAdmin}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors"
          >
            Return to Agency Admin
          </button>
        </div>
      </div>

      {/* Client Welcome Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-lg text-indigo-400">
              {client.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white font-display">
                  {client.name}
                </h1>
                <span className="text-xs text-slate-400 font-mono">
                  ({client.stage})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Project Delivery & Technical Operations Portal · Engineering Partner: <strong>StackAgency</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Active Plan</span>
              <span className="text-indigo-300 font-semibold">
                {packageItem?.name || client.packageName || 'Dedicated Full-Stack Squad'}
              </span>
            </div>
            <div className="border-l border-slate-800 pl-3 text-right">
              <span className="text-slate-400 block text-[11px]">SLA Response</span>
              <span className="text-emerald-400 font-semibold font-mono">
                {packageItem?.slaTier || 'Priority 4h SLA'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Stage Gate Banner (if in onboarding or recent) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Onboarding Status: Stage {client.currentOnboardingStage.replace('-', ' ').toUpperCase()}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {client.currentOnboardingStage === 'completed'
              ? 'Onboarding Complete · Active Sprints'
              : 'Action items pending completion'}
          </span>
        </div>

        {/* 5-step miniature bar */}
        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono">
          {['1. Discovery', '2. Scoping', '3. Proposal', '4. Contract', '5. Kickoff'].map((st, i) => {
            const isCompleted =
              client.currentOnboardingStage === 'completed' ||
              (client.onboardingStages && client.onboardingStages[i]?.status === 'completed');
            return (
              <div
                key={i}
                className={`p-2 rounded border ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 font-medium'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                {st}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Main Portal Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Milestones & Live Deployments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sprint Deliverables */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <span>Active Engineering Milestones & Deliverables</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Updated in real-time from PM Tool
              </span>
            </div>

            <div className="space-y-3">
              {client.milestones.map((m) => (
                <div key={m.id} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{m.title}</span>
                    <span className="text-indigo-400 font-mono tabular-nums font-medium">
                      {m.completionPercentage}% Complete
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        m.completionPercentage === 100
                          ? 'bg-emerald-500'
                          : m.completionPercentage > 60
                          ? 'bg-indigo-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${m.completionPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Target Delivery: {m.dueDate}</span>
                    </span>
                    <span>Lead: {m.leadEngineer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Environments Quick Access */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Verified Deployments & Preview Environments</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Click to open</span>
            </div>

            <div className="space-y-2 text-xs">
              {client.environments.production && (
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      Production
                    </span>
                    <span className="font-mono text-slate-200 truncate">
                      {client.environments.production}
                    </span>
                  </div>
                  <a
                    href={client.environments.production}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {client.environments.staging && (
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase bg-indigo-950/60 px-1.5 py-0.5 rounded">
                      Staging
                    </span>
                    <span className="font-mono text-slate-200 truncate">
                      {client.environments.staging}
                    </span>
                  </div>
                  <a
                    href={client.environments.staging}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {client.environments.figmaUrl && (
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-violet-400 uppercase bg-violet-950/60 px-1.5 py-0.5 rounded">
                      Figma
                    </span>
                    <span className="font-mono text-slate-200 truncate">
                      {client.environments.figmaUrl}
                    </span>
                  </div>
                  <a
                    href={client.environments.figmaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Squad & Retainer Hours Meter */}
        <div className="space-y-6">
          {/* Assigned Agency Squad */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Your Assigned Engineering Squad</span>
            </div>

            <div className="space-y-2.5">
              {client.assignedTeam.map((member, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-indigo-950 border border-indigo-800/80 text-indigo-300 font-mono font-bold text-[11px] flex items-center justify-center">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{member.name}</div>
                      <div className="text-[11px] text-slate-400">{member.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
              Reach your squad anytime in your dedicated shared Slack channel.
            </div>
          </div>

          {/* Monthly Hours & Retainer Utilization */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Sprint Hours Consumption</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Month:</span>
                <span className="font-mono text-white tabular-nums font-semibold">
                  {client.hoursLoggedMonth}h / {client.hoursMonthlyCap}h cap
                </span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.round((client.hoursLoggedMonth / client.hoursMonthlyCap) * 100),
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>{client.hoursMonthlyCap - client.hoursLoggedMonth} hours remaining</span>
                <span>Billing cycle resets Dec 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
