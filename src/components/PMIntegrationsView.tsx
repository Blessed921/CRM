import React, { useState } from 'react';
import { Client, PMIntegrationConfig, PMSyncedField } from '../types/crm';
import { 
  GitPullRequest, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  ArrowLeftRight, 
  Clock, 
  Terminal, 
  Check, 
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface PMIntegrationsViewProps {
  integrations: PMIntegrationConfig[];
  clients: Client[];
  onTriggerSync: (integrationId: string) => void;
  onToggleField: (integrationId: string, fieldId: string) => void;
  onToggleConnection: (integrationId: string) => void;
  onSelectClient: (client: Client) => void;
}

export const PMIntegrationsView: React.FC<PMIntegrationsViewProps> = ({
  integrations,
  clients,
  onTriggerSync,
  onToggleField,
  onToggleConnection,
  onSelectClient,
}) => {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string>('int-jira');
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);

  const selectedIntegration =
    integrations.find((i) => i.id === selectedIntegrationId) || integrations[0];

  const handleCopyWebhook = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedWebhook(url);
    setTimeout(() => setCopiedWebhook(null), 2000);
  };

  const getToolLogoBadge = (tool: string) => {
    switch (tool) {
      case 'jira':
        return <span className="text-blue-400 font-bold font-mono">JIRA</span>;
      case 'linear':
        return <span className="text-violet-400 font-bold font-mono">LINEAR</span>;
      case 'asana':
        return <span className="text-rose-400 font-bold font-mono">ASANA</span>;
      case 'trello':
        return <span className="text-sky-400 font-bold font-mono">TRELLO</span>;
      default:
        return <span className="text-slate-400 font-bold font-mono">TOOL</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-indigo-400" />
              <span>Project Management Tools Integration Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Bi-directional synchronization between CRM client accounts, milestone deliverables, engineering sprint tickets, and worklogs in Jira, Linear, Asana, and Trello.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerSync(selectedIntegration.id)}
              disabled={selectedIntegration.status !== 'connected'}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  selectedIntegration.status === 'syncing' ? 'animate-spin' : ''
                }`}
              />
              <span>Sync All Projects Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((int) => {
          const isSelected = int.id === selectedIntegration.id;
          const isConnected = int.status === 'connected';

          return (
            <div
              key={int.id}
              onClick={() => setSelectedIntegrationId(int.id)}
              className={`p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-850 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getToolLogoBadge(int.tool)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">{int.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                      {int.externalWorkspaceName}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded capitalize ${
                    int.status === 'connected'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : int.status === 'syncing'
                      ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/40'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {int.status}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Synced Projects:</span>
                  <span className="font-mono text-slate-200 tabular-nums">
                    {int.syncedProjectsCount} boards
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-mono text-slate-300 capitalize">
                    {int.syncFrequency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="font-mono text-slate-400 truncate max-w-[110px]">
                    {int.lastSyncTimestamp}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleConnection(int.id);
                  }}
                  className={`underline ${
                    isConnected ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect Tool'}
                </button>
                <span className="text-[10px] font-mono text-slate-500">
                  {int.fields.filter((f) => f.isActive).length}/{int.fields.length} fields
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tool Synced Data Points Specification Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        {/* Tool Header & Webhook Configuration */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">
                {selectedIntegration.name} Synchronization Protocol
              </h3>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Workspace: {selectedIntegration.externalWorkspaceName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Field mapping engine translating agency CRM milestones, budgets, and squad roles to PM issues.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Webhook:</span>
            <button
              onClick={() => handleCopyWebhook(selectedIntegration.webhookUrl)}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded font-mono text-[11px] flex items-center gap-1.5 transition-colors"
              title="Click to copy webhook URL"
            >
              <span className="truncate max-w-[200px]">{selectedIntegration.webhookUrl}</span>
              {copiedWebhook === selectedIntegration.webhookUrl ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <span className="text-slate-500 text-[10px]">Copy</span>
              )}
            </button>
          </div>
        </div>

        {/* The 4 Key Synced Data Points (as specified in prompt) */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span>Key Data Points Synced Between CRM and {selectedIntegration.name}</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Toggle switch on right to pause or resume specific field mapping
            </span>
          </div>

          <div className="space-y-3">
            {selectedIntegration.fields.map((field) => (
              <div
                key={field.id}
                className={`p-4 rounded-lg border text-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  field.isActive
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-60'
                }`}
              >
                {/* Left: Entity & Mapping */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300 font-semibold">
                      {field.entity}
                    </span>
                    <span className="text-slate-500 font-mono">|</span>
                    <span className="font-semibold text-slate-100 font-mono">
                      {field.crmField}
                    </span>
                    <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                    <span className="font-semibold text-slate-300 font-mono">
                      {field.externalField}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    {field.description}
                  </p>
                </div>

                {/* Right: Direction and Active Toggle */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {field.direction === 'two-way'
                      ? '⇄ Bi-directional'
                      : field.direction === 'crm-to-tool'
                      ? '→ CRM to PM'
                      : '← PM to CRM'}
                  </span>

                  <button
                    onClick={() => onToggleField(selectedIntegration.id, field.id)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      field.isActive
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {field.isActive ? 'Active Sync' : 'Paused'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Synced Client Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Active Client Projects Linked to PM Tools ({clients.length})</span>
          </span>
          <span className="text-xs text-slate-400">
            Real-time ticket completion rates and lead engineer mappings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Client Account</th>
                <th className="py-3 px-4">Connected PM Workspace</th>
                <th className="py-3 px-4">Project Key & Title</th>
                <th className="py-3 px-4">Sprint Delivery Tickets</th>
                <th className="py-3 px-4">Lead Assignee</th>
                <th className="py-3 px-4">Sync Status</th>
                <th className="py-3 px-4 text-right">External Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.map((client) => {
                const sync = client.pmSync;
                const totalTickets = sync ? sync.activeTicketsCount + sync.completedTicketsCount : 0;
                const pct = totalTickets > 0 && sync ? Math.round((sync.completedTicketsCount / totalTickets) * 100) : 0;

                return (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-400">
                          {client.logoText}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{client.name}</div>
                          <div className="text-[10px] text-slate-400">{client.primaryDomain}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono uppercase text-xs">
                      {sync ? (
                        <span className="font-bold text-slate-300">
                          {sync.tool}
                        </span>
                      ) : (
                        <span className="text-slate-500">Unlinked</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {sync ? (
                        <div>
                          <span className="font-mono font-semibold text-indigo-300">
                            [{sync.projectKey}]
                          </span>{' '}
                          <span className="text-slate-200">{sync.projectName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">No project key</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {sync ? (
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-300">{sync.completedTicketsCount} of {totalTickets} done</span>
                            <span className="text-indigo-400">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {sync?.leadAssignee || client.assignedTeam[0]?.name || 'Unassigned'}
                    </td>

                    <td className="py-3.5 px-4">
                      {sync ? (
                        <div>
                          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Live Sync</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                            {sync.lastSyncedAt}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Offline</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {sync?.externalUrl ? (
                        <a
                          href={sync.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-xs text-indigo-400 hover:text-indigo-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Open Board</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button
                          onClick={() => onSelectClient(client)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Configure
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
