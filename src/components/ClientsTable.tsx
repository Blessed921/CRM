import React, { useState, useMemo } from 'react';
import { Client, ClientHealth, EngagementModel } from '../types/crm';
import { 
  Search, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  SlidersHorizontal,
  Clock,
  ArrowUpRight,
  Server
} from 'lucide-react';

interface ClientsTableProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onOpenNewClient: () => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  onSelectClient,
  onOpenNewClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [modelFilter, setModelFilter] = useState<string>('all');

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Health filter
      if (healthFilter !== 'all' && client.health !== healthFilter) {
        return false;
      }
      // Model filter
      if (modelFilter !== 'all' && client.engagementModel !== modelFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = client.name.toLowerCase().includes(query);
        const matchesDomain = client.primaryDomain.toLowerCase().includes(query);
        const matchesIndustry = client.industry.toLowerCase().includes(query);
        const matchesTech = [
          ...client.techStack.frontend,
          ...client.techStack.backend,
          ...client.techStack.database,
          ...client.techStack.cloud,
        ].some((tech) => tech.toLowerCase().includes(query));

        if (!matchesName && !matchesDomain && !matchesIndustry && !matchesTech) {
          return false;
        }
      }
      return true;
    });
  }, [clients, searchTerm, healthFilter, modelFilter]);

  const getHealthBadge = (health: ClientHealth) => {
    switch (health) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Active & Healthy</span>
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Needs Attention</span>
          </span>
        );
      case 'at-risk':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>At Risk</span>
          </span>
        );
      case 'onboarding':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Onboarding Setup</span>
          </span>
        );
    }
  };

  const getEngagementLabel = (model: EngagementModel) => {
    switch (model) {
      case 'dedicated-squad':
        return 'Dedicated Squad';
      case 'time-and-materials':
        return 'Time & Materials';
      case 'fixed-milestone':
        return 'Fixed Milestone';
      case 'sla-maintenance':
        return 'SLA / Maintenance';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Top Filter and Search Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, domain, or tech (e.g. Go, AWS, Next.js)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Controls (Segmented buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Health Segmented Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setHealthFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                healthFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({clients.length})
            </button>
            <button
              onClick={() => setHealthFilter('healthy')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                healthFilter === 'healthy'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Healthy
            </button>
            <button
              onClick={() => setHealthFilter('onboarding')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                healthFilter === 'onboarding'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Onboarding
            </button>
            <button
              onClick={() => setHealthFilter('attention')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                healthFilter === 'attention'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setHealthFilter('at-risk')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                healthFilter === 'at-risk'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              At Risk
            </button>
          </div>

          {/* Model Filter Dropdown */}
          <div className="relative">
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Engagement Models</option>
              <option value="dedicated-squad">Dedicated Squad</option>
              <option value="time-and-materials">Time & Materials</option>
              <option value="fixed-milestone">Fixed Milestone</option>
              <option value="sla-maintenance">SLA Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Client & Domain</th>
              <th className="py-3 px-4">Business Setup & Retainer</th>
              <th className="py-3 px-4">Tech Architecture Snapshot</th>
              <th className="py-3 px-4">Access Readiness</th>
              <th className="py-3 px-4">Health Status</th>
              <th className="py-3 px-4 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-3">
                    <Server className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-medium text-slate-300">No matching clients found</p>
                    <p className="text-xs text-slate-400">
                      Try clearing search filters or add a new agency client account.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setHealthFilter('all');
                        setModelFilter('all');
                      }}
                      className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => {
                const totalAccess = client.accessChecklist.length;
                const grantedAccess = client.accessChecklist.filter((a) => a.isGranted).length;
                const accessRatio = totalAccess > 0 ? grantedAccess / totalAccess : 0;
                const hoursPercent = client.hoursMonthlyCap > 0
                  ? Math.round((client.hoursLoggedMonth / client.hoursMonthlyCap) * 100)
                  : 0;

                const primaryContact = client.stakeholders.find((s) => s.isPrimary) || client.stakeholders[0];

                return (
                  <tr
                    key={client.id}
                    onClick={() => onSelectClient(client)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Column 1: Client & Domain */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-xs text-indigo-400 shrink-0">
                          {client.logoText}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{client.name}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 shrink-0" />
                          </div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                            <span>{client.primaryDomain}</span>
                            <span aria-hidden="true">·</span>
                            <span>{client.industry}</span>
                            <span aria-hidden="true">·</span>
                            <span>{client.stage}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Business Setup & Retainer */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono tabular-nums text-slate-200 font-medium">
                        ${client.monthlyRetainer.toLocaleString()}
                        <span className="text-[11px] text-slate-400 ml-1 font-sans">/mo</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{getEngagementLabel(client.engagementModel)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {client.hoursLoggedMonth}h / {client.hoursMonthlyCap}h
                        </span>
                      </div>
                      {/* Mini hour burn line */}
                      <div className="w-28 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            hoursPercent > 100
                              ? 'bg-rose-500'
                              : hoursPercent > 85
                              ? 'bg-amber-400'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min(hoursPercent, 100)}%` }}
                        />
                      </div>
                    </td>

                    {/* Column 3: Tech Architecture Snapshot */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[11px] text-slate-200 font-mono flex flex-wrap gap-x-2 gap-y-1">
                        <span className="text-indigo-300">
                          {client.techStack.frontend[0] || 'Web'}
                        </span>
                        <span className="text-slate-600">/</span>
                        <span className="text-emerald-300">
                          {client.techStack.backend[0] || 'API'}
                        </span>
                        <span className="text-slate-600">/</span>
                        <span className="text-sky-300">
                          {client.techStack.cloud[0]?.split(' ')[0] || 'Cloud'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 truncate">
                        <span>{client.techStack.database[0] || 'PostgreSQL'}</span>
                        {client.compliance.length > 0 && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-400">{client.compliance[0]}</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Column 4: Access Readiness */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-mono tabular-nums text-slate-200 font-medium">
                          {grantedAccess}/{totalAccess}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          ({Math.round(accessRatio * 100)}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {grantedAccess === totalAccess ? (
                          <span className="text-emerald-400/90">Fully Verified</span>
                        ) : (
                          <span className="text-amber-400/90">
                            {totalAccess - grantedAccess} pending grant
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 5: Health Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getHealthBadge(client.health)}
                      {primaryContact && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                          Lead: {primaryContact.name.split(' ')[0]} ({primaryContact.role.split(' ')[0]})
                        </div>
                      )}
                    </td>

                    {/* Column 6: Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClient(client);
                        }}
                        className="px-2.5 py-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/40 rounded transition-colors inline-flex items-center gap-1 font-medium"
                      >
                        <span>View Specs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing {filteredClients.length} of {clients.length} agency clients
        </div>
        <div className="flex items-center gap-2">
          <span>Click any client row to inspect architecture and access vault</span>
        </div>
      </div>
    </div>
  );
};
