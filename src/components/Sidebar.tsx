import React from 'react';
import { ViewTab } from '../types/crm';
import { 
  Building2, 
  Layers, 
  GitBranch, 
  CircleDollarSign, 
  Activity,
  Code2,
  ShieldCheck,
  PackageCheck,
  GitPullRequest,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  clientsCount: number;
  onboardingCount: number;
  packagesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  clientsCount,
  onboardingCount,
  packagesCount = 5,
}) => {
  const clientManagementItems = [
    {
      id: 'clients' as ViewTab,
      label: 'Client Accounts',
      icon: Building2,
      count: clientsCount,
      badge: null,
    },
    {
      id: 'onboarding' as ViewTab,
      label: 'Onboarding Pipeline',
      icon: ShieldCheck,
      count: onboardingCount,
      badge: onboardingCount > 0 ? 'Active' : null,
    },
    {
      id: 'packages' as ViewTab,
      label: 'Service Packages',
      icon: PackageCheck,
      count: packagesCount,
      badge: null,
    },
    {
      id: 'integrations' as ViewTab,
      label: 'PM Tool Sync (Jira)',
      icon: GitPullRequest,
      count: null,
      badge: 'Live',
    },
  ];

  const engineeringOperationsItems = [
    {
      id: 'tech-matrix' as ViewTab,
      label: 'Tech Setup Matrix',
      icon: Layers,
      count: null,
    },
    {
      id: 'sprints' as ViewTab,
      label: 'Sprints & Deliverables',
      icon: GitBranch,
      count: null,
    },
    {
      id: 'retainers' as ViewTab,
      label: 'Retainers & Billing',
      icon: CircleDollarSign,
      count: null,
    },
    {
      id: 'analytics' as ViewTab,
      label: 'Agency Pulse',
      icon: Activity,
      count: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white font-display">
              StackAgency CRM
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Software Studio Operations
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {/* Section 1: Client Lifecycle & Setup */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Client & Commercial Hub
          </div>
          {clientManagementItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 font-medium border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== null && (
                  <span className="text-[10px] font-mono tabular-nums text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {item.count}
                  </span>
                )}
                {item.badge && item.count === null && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Section 2: Engineering Delivery & Operations */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Engineering & Contracts
          </div>
          {engineeringOperationsItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 font-medium border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Agency Quick Setup Guide */}
        <div className="pt-2 px-1">
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>5-Stage Onboarding</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standardized flow: Initial Contact → Tech Scoping → SOW Proposal → MSA Signing → Sprint 0 Kickoff.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-slate-400">DevAgency CRM</span>
          <span className="font-mono text-slate-400">v2.5 Pro</span>
        </div>
      </div>
    </aside>
  );
};
