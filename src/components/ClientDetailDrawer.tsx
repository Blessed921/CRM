import React, { useState } from 'react';
import { 
  Client, 
  ClientHealth, 
  AccessItem, 
  ActivityLog, 
  ServicePackage, 
  OnboardingStageId 
} from '../types/crm';
import { 
  X, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  XCircle, 
  Server, 
  ShieldCheck, 
  Users, 
  History, 
  Plus, 
  Mail, 
  MessageSquare, 
  Calendar,
  AlertTriangle,
  Cpu,
  Layers,
  FileText,
  PackageCheck,
  GitPullRequest,
  Circle,
  ArrowRight,
  Clock
} from 'lucide-react';

interface ClientDetailDrawerProps {
  client: Client | null;
  packages?: ServicePackage[];
  onClose: () => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onToggleAccess: (clientId: string, accessId: string) => void;
  onAddActivity: (clientId: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onOpenExportModal: (client: Client) => void;
  onUpdateStage?: (clientId: string, stageId: OnboardingStageId) => void;
  onToggleOnboardingTask?: (clientId: string, stageId: OnboardingStageId, taskId: string) => void;
  onAssignPackage?: (clientId: string, packageId: string) => void;
}

export const ClientDetailDrawer: React.FC<ClientDetailDrawerProps> = ({
  client,
  packages = [],
  onClose,
  onUpdateClient,
  onToggleAccess,
  onAddActivity,
  onOpenExportModal,
  onUpdateStage,
  onToggleOnboardingTask,
  onAssignPackage,
}) => {
  const [activeTab, setActiveTab] = useState<
    'architecture' | 'vault' | 'onboarding' | 'package' | 'team' | 'activity'
  >('architecture');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // New access item state
  const [newAccessLabel, setNewAccessLabel] = useState('');
  const [newAccessCategory, setNewAccessCategory] = useState<AccessItem['category']>('cloud');

  // New activity log state
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogDescription, setNewLogDescription] = useState('');
  const [newLogType, setNewLogType] = useState<ActivityLog['type']>('meeting');
  const [newLogAuthor, setNewLogAuthor] = useState('Alex Thorne (PM)');

  if (!client) return null;

  const currentPackage = packages.find((p) => p.id === client.packageId) ||
    packages.find((p) => p.name === client.packageName);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleAddAccessItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccessLabel.trim()) return;

    const newItem: AccessItem = {
      id: `acc-${Date.now()}`,
      category: newAccessCategory,
      label: newAccessLabel.trim(),
      isGranted: false,
    };

    onUpdateClient(client.id, {
      accessChecklist: [...client.accessChecklist, newItem],
    });

    setNewAccessLabel('');
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogTitle.trim()) return;

    onAddActivity(client.id, {
      title: newLogTitle.trim(),
      description: newLogDescription.trim(),
      type: newLogType,
      author: newLogAuthor,
    });

    setNewLogTitle('');
    setNewLogDescription('');
  };

  const totalAccess = client.accessChecklist.length;
  const grantedAccess = client.accessChecklist.filter((a) => a.isGranted).length;
  const accessPct = totalAccess > 0 ? Math.round((grantedAccess / totalAccess) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-base text-indigo-400">
                {client.logoText}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white font-display">
                    {client.name}
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    ({client.stage})
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>{client.primaryDomain}</span>
                  <span aria-hidden="true">·</span>
                  <span>{client.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span>{client.timezone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenExportModal(client)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export Handover</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Business, Retainer & PM Integration Status Bar */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly Retainer</span>
                <span className="font-mono tabular-nums text-white font-semibold">
                  ${client.monthlyRetainer.toLocaleString()}/mo
                </span>
              </div>
              <span className="text-slate-700">|</span>
              <div>
                <span className="text-slate-400 block text-[11px]">Package</span>
                <span className="text-indigo-300 font-medium truncate max-w-[140px] block">
                  {client.packageName || 'Dedicated Squad'}
                </span>
              </div>
              <span className="text-slate-700">|</span>
              <div>
                <span className="text-slate-400 block text-[11px]">PM Tool</span>
                {client.pmSync ? (
                  <a
                    href={client.pmSync.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-mono flex items-center gap-1"
                  >
                    <span>{client.pmSync.tool.toUpperCase()}: {client.pmSync.projectKey}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="text-slate-500 font-mono">Unlinked</span>
                )}
              </div>
            </div>

            {/* Health Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Status:</span>
              <select
                value={client.health}
                onChange={(e) =>
                  onUpdateClient(client.id, { health: e.target.value as ClientHealth })
                }
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="healthy">Active & Healthy</option>
                <option value="attention">Needs Attention</option>
                <option value="at-risk">At Risk</option>
                <option value="onboarding">In Onboarding</option>
              </select>
            </div>
          </div>

          {/* Drawer Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Architecture & Envs</span>
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'vault'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Access Vault ({grantedAccess}/{totalAccess})</span>
            </button>
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'onboarding'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Onboarding Lifecycle</span>
            </button>
            <button
              onClick={() => setActiveTab('package')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'package'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Service Package</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'team'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Stakeholders & Squad</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-2.5 font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Activity Log</span>
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: TECH ARCHITECTURE & ENVS */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Environments Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Client Environments & Repositories</span>
                  <span className="text-[11px] text-slate-400 font-normal">Click icon to copy URL</span>
                </div>

                <div className="space-y-2 text-xs">
                  {client.environments.production && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          Production
                        </span>
                        <span className="font-mono text-slate-300 truncate">
                          {client.environments.production}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleCopy(client.environments.production!)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Copy URL"
                        >
                          {copiedUrl === client.environments.production ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={client.environments.production}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {client.environments.staging && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase bg-indigo-950/60 px-1.5 py-0.5 rounded">
                          Staging
                        </span>
                        <span className="font-mono text-slate-300 truncate">
                          {client.environments.staging}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleCopy(client.environments.staging!)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {copiedUrl === client.environments.staging ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={client.environments.staging}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {client.environments.repositoryUrl && (
                    <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-slate-300 uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                          Git Repository
                        </span>
                        <span className="font-mono text-slate-300 truncate">
                          {client.environments.repositoryUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleCopy(client.environments.repositoryUrl!)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {copiedUrl === client.environments.repositoryUrl ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={client.environments.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">
                    Frontend Layer
                  </div>
                  <div className="mt-2 text-slate-200 font-mono space-y-1">
                    {client.techStack.frontend.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-600">›</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                    Backend & APIs
                  </div>
                  <div className="mt-2 text-slate-200 font-mono space-y-1">
                    {client.techStack.backend.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-600">›</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-sky-400 font-semibold uppercase">
                    Databases & Caching
                  </div>
                  <div className="mt-2 text-slate-200 font-mono space-y-1">
                    {client.techStack.database.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-600">›</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                    Cloud & Hosting
                  </div>
                  <div className="mt-2 text-slate-200 font-mono space-y-1">
                    {client.techStack.cloud.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-600">›</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCESS & SECURITY VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Credentials & Access Verification Checklist</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toggle items as credentials, IAM roles, and repository permissions are verified.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono tabular-nums text-white">
                    {grantedAccess} / {totalAccess}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {accessPct}% secured
                  </div>
                </div>
              </div>

              {/* Checklist items list */}
              <div className="space-y-2">
                {client.accessChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleAccess(client.id, item.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      item.isGranted
                        ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/30'
                        : 'bg-amber-950/15 border-amber-800/40 hover:bg-amber-950/25'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5">
                        {item.isGranted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            item.isGranted ? 'text-slate-200' : 'text-amber-200'
                          }`}
                        >
                          {item.label}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-amber-300/80 mt-1 italic">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.isGranted ? 'Granted' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Access Item */}
              <form
                onSubmit={handleAddAccessItem}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-3"
              >
                <div className="text-xs font-semibold text-slate-300">
                  Add Access / Credential Requirement
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Supabase Admin Key / Sentry DSN"
                    value={newAccessLabel}
                    onChange={(e) => setNewAccessLabel(e.target.value)}
                    className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newAccessCategory}
                    onChange={(e) =>
                      setNewAccessCategory(e.target.value as AccessItem['category'])
                    }
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="cloud">Cloud / IAM</option>
                    <option value="code">Code / Repo</option>
                    <option value="data">Data / DB</option>
                    <option value="legal">Legal / NDA</option>
                    <option value="communication">Slack / Comms</option>
                    <option value="billing">Billing / ACH</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: ONBOARDING PROTOCOL */}
          {activeTab === 'onboarding' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Client Onboarding Lifecycle Status</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current Active Stage:{' '}
                    <span className="font-semibold text-indigo-300 uppercase font-mono">
                      {client.currentOnboardingStage}
                    </span>
                  </p>
                </div>

                {onUpdateStage && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Set Stage:</span>
                    <select
                      value={client.currentOnboardingStage}
                      onChange={(e) =>
                        onUpdateStage(client.id, e.target.value as OnboardingStageId)
                      }
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="initial-contact">1. Initial Contact</option>
                      <option value="needs-assessment">2. Needs Assessment</option>
                      <option value="proposal-solution">3. Proposal & SOW</option>
                      <option value="contract-signing">4. Contract Signing</option>
                      <option value="kickoff-handover">5. Kickoff & Handover</option>
                      <option value="completed">Completed & Active</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Stepper breakdown */}
              <div className="space-y-4">
                {(client.onboardingStages || []).map((stage) => {
                  const isCurrent = client.currentOnboardingStage === stage.stageId;
                  const isCompleted = stage.status === 'completed';

                  return (
                    <div
                      key={stage.stageId}
                      className={`p-4 rounded-lg border text-xs ${
                        isCurrent
                          ? 'bg-slate-950 border-indigo-500/80 shadow-md'
                          : isCompleted
                          ? 'bg-slate-950/60 border-slate-800'
                          : 'bg-slate-950/30 border-slate-800/40 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                          <span className="font-semibold text-slate-100">{stage.stageName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Owner: {stage.ownerName} ({stage.ownerRole.split(' ')[0]})
                        </div>
                      </div>

                      {/* Tasks */}
                      <div className="mt-3 space-y-1.5">
                        {stage.tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() =>
                              onToggleOnboardingTask &&
                              onToggleOnboardingTask(client.id, stage.stageId, task.id)
                            }
                            className={`p-2 rounded border flex items-start justify-between gap-3 cursor-pointer ${
                              task.isCompleted
                                ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                                : 'bg-slate-900 border-slate-800/60 text-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {task.isCompleted ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                              )}
                              <span className={task.isCompleted ? 'line-through opacity-75' : ''}>
                                {task.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {task.responsibleAssignee}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICE PACKAGE */}
          {activeTab === 'package' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-5 space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">
                      Associated Service Offering
                    </span>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      {currentPackage?.name || client.packageName || 'Dedicated Full-Stack Squad'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {currentPackage?.description || 'Retainer engineering contract with committed hours and squad allocation.'}
                    </p>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 uppercase">
                    {currentPackage?.pricingModel || 'Retainer'}
                  </span>
                </div>

                {/* Investment & SLA metrics */}
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Monthly Retainer</span>
                    <span className="text-white text-base font-bold tabular-nums">
                      ${client.monthlyRetainer.toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">Included Monthly Hours</span>
                    <span className="text-white text-base font-bold tabular-nums">
                      {client.hoursMonthlyCap}h cap
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block uppercase">SLA Commitment</span>
                    <span className="text-emerald-400 text-sm font-semibold">
                      {currentPackage?.slaTier || 'Priority 4h SLA'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {currentPackage && (
                  <div className="pt-2 space-y-2 text-xs">
                    <span className="font-semibold text-slate-300 block text-[11px] uppercase tracking-wider font-mono">
                      Contractual Inclusions
                    </span>
                    <div className="space-y-1.5">
                      {currentPackage.includedFeatures.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reassign Package Dropdown */}
                {onAssignPackage && (
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Switch or Reassign Package:</span>
                    <select
                      value={currentPackage?.id || ''}
                      onChange={(e) => onAssignPackage(client.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} (${pkg.basePrice.toLocaleString()} {pkg.billingCadence})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: STAKEHOLDERS & SQUAD */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Client Stakeholders */}
              <div>
                <h3 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Client Stakeholders & Key Contacts</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {client.stakeholders.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span>{s.name}</span>
                            {s.isPrimary && (
                              <span className="text-[10px] text-indigo-400 font-mono">
                                (Primary)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">{s.role}</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <a href={`mailto:${s.email}`} className="hover:underline">
                            {s.email}
                          </a>
                        </div>
                        {s.slack && (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <MessageSquare className="w-3 h-3 text-slate-500" />
                            <span>Slack: {s.slack}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agency Assigned Squad */}
              <div>
                <h3 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Assigned Agency Engineering Squad</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {client.assignedTeam.map((member, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3 text-xs"
                    >
                      <div className="w-9 h-9 rounded-md bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center font-mono font-bold text-xs text-indigo-300 shrink-0">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{member.name}</div>
                        <div className="text-[11px] text-slate-400">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY & DEPLOYMENT LOG */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Add Activity Form */}
              <form
                onSubmit={handleAddActivitySubmit}
                className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3"
              >
                <div className="text-xs font-semibold text-slate-200">
                  Log Agency Action / Meeting / Release
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Title (e.g. Staging v2.15 deployed)"
                    value={newLogTitle}
                    onChange={(e) => setNewLogTitle(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newLogType}
                    onChange={(e) => setNewLogType(e.target.value as ActivityLog['type'])}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="deployment">Deployment</option>
                    <option value="meeting">Sprint / Client Meeting</option>
                    <option value="architecture">Architecture Decision</option>
                    <option value="contract">Contract / Retainer</option>
                    <option value="onboarding">Onboarding Update</option>
                    <option value="sync">PM Tool Sync</option>
                    <option value="alert">Technical Alert</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="Details, key outcomes, next steps..."
                  value={newLogDescription}
                  onChange={(e) => setNewLogDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Author name"
                    value={newLogAuthor}
                    onChange={(e) => setNewLogAuthor(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 w-44"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                  >
                    Post to Client Feed
                  </button>
                </div>
              </form>

              {/* Feed of logs */}
              <div className="space-y-3">
                {client.activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                          {log.type}
                        </span>
                        <span>{log.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {log.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      By {log.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
