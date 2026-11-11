import React, { useState } from 'react';
import { Client, AccessItem } from '../types/crm';
import { 
  Server, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Globe, 
  GitBranch, 
  Database, 
  Cloud,
  Copy,
  Check
} from 'lucide-react';

interface TechSetupMatrixViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onToggleAccess: (clientId: string, accessId: string) => void;
}

export const TechSetupMatrixView: React.FC<TechSetupMatrixViewProps> = ({
  clients,
  onSelectClient,
  onToggleAccess,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" />
              <span>Agency Technical Architecture & Infrastructure Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Cross-client ledger of hosting, repos, cloud environments, and verified access credentials.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Category:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Infra
              </button>
              <button
                onClick={() => setSelectedCategory('cloud')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedCategory === 'cloud'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cloud & IAM
              </button>
              <button
                onClick={() => setSelectedCategory('repos')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedCategory === 'repos'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Repos & CI/CD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Client Tech Setups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {clients.map((client) => {
          const grantedCount = client.accessChecklist.filter((a) => a.isGranted).length;
          const totalCount = client.accessChecklist.length;
          const isFullyConfigured = grantedCount === totalCount;

          return (
            <div
              key={client.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-xs text-indigo-400">
                      {client.logoText}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                        <span>{client.name}</span>
                        <span className="text-slate-500 font-mono text-xs font-normal">
                          ({client.stage})
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span>{client.primaryDomain}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{client.timezone.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectClient(client)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700 transition-colors whitespace-nowrap"
                  >
                    Open Spec
                  </button>
                </div>

                {/* Tech Blueprint Matrix */}
                <div className="py-4 space-y-3 text-xs border-b border-slate-800">
                  {/* Row 1: Frontend & Backend */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                        Frontend Layer
                      </div>
                      <div className="text-slate-200 font-mono text-xs mt-1">
                        {client.techStack.frontend.join(' · ')}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                        Backend & APIs
                      </div>
                      <div className="text-slate-200 font-mono text-xs mt-1">
                        {client.techStack.backend.join(' · ')}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Database & Cloud */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Database className="w-3 h-3 text-slate-500" />
                        <span>Database & Cache</span>
                      </div>
                      <div className="text-slate-200 font-mono text-xs mt-1 truncate">
                        {client.techStack.database.join(' · ')}
                      </div>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Cloud className="w-3 h-3 text-slate-500" />
                        <span>Cloud & Infra</span>
                      </div>
                      <div className="text-slate-200 font-mono text-xs mt-1 truncate">
                        {client.techStack.cloud.join(' · ')}
                      </div>
                    </div>
                  </div>

                  {/* Environments URL bar */}
                  <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 space-y-1.5">
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                      <span>Live Deployments & Environments</span>
                      <span className="text-[10px] text-slate-400">Click to copy URL</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {client.environments.production && (
                        <button
                          onClick={() => handleCopy(client.environments.production!)}
                          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono transition-colors"
                          title="Copy Production URL"
                        >
                          <span className="text-emerald-400">PROD</span>
                          <span className="text-slate-400">:</span>
                          <span className="truncate max-w-[120px]">{client.environments.production.replace('https://', '')}</span>
                          {copiedUrl === client.environments.production ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
                          )}
                        </button>
                      )}

                      {client.environments.staging && (
                        <button
                          onClick={() => handleCopy(client.environments.staging!)}
                          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono transition-colors"
                          title="Copy Staging URL"
                        >
                          <span className="text-indigo-400">STAGE</span>
                          <span className="text-slate-400">:</span>
                          <span className="truncate max-w-[120px]">{client.environments.staging.replace('https://', '')}</span>
                          {copiedUrl === client.environments.staging ? (
                            <Check className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400 ml-0.5" />
                          )}
                        </button>
                      )}

                      {client.environments.repositoryUrl && (
                        <a
                          href={client.environments.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono transition-colors"
                        >
                          <GitBranch className="w-2.5 h-2.5 text-slate-400" />
                          <span>Repo</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Access Checklist Preview & Quick Toggles */}
                <div className="pt-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Access & Security Vault Readiness</span>
                    </span>
                    <span className="font-mono text-slate-400 tabular-nums">
                      {grantedCount}/{totalCount} secured ({Math.round((grantedCount / totalCount) * 100)}%)
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {client.accessChecklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onToggleAccess(client.id, item.id)}
                        className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer transition-colors ${
                          item.isGranted
                            ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/30'
                            : 'bg-amber-950/15 border-amber-800/30 hover:bg-amber-950/25'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.isGranted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span
                            className={`truncate ${
                              item.isGranted ? 'text-slate-300' : 'text-amber-200 font-medium'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 shrink-0 ml-2">
                          {item.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span>Compliance:</span>
                  <span className="text-slate-300 font-mono">
                    {client.compliance.length > 0 ? client.compliance.join(', ') : 'Standard IP'}
                  </span>
                </div>
                <div className="font-mono text-slate-400">
                  {client.assignedTeam.length} Squad Devs Assigned
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
