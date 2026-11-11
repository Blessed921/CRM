import React from 'react';
import { ViewTab } from '../types/crm';
import { Plus, Download, Terminal, RefreshCw, Eye, Shield } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  viewMode: 'admin' | 'portal';
  onToggleViewMode: () => void;
  onOpenNewClient: () => void;
  onOpenExportModal: () => void;
  onResetData: () => void;
  clientsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  viewMode,
  onToggleViewMode,
  onOpenNewClient,
  onOpenExportModal,
  onResetData,
  clientsCount,
}) => {
  const getTabTitle = (tab: ViewTab) => {
    switch (tab) {
      case 'clients':
        return 'Client Accounts';
      case 'onboarding':
        return 'Standardized Onboarding Pipeline';
      case 'packages':
        return 'Customizable Service Packages';
      case 'integrations':
        return 'PM Tools & Bi-Directional Sync';
      case 'tech-matrix':
        return 'Technical Setup Matrix';
      case 'sprints':
        return 'Engineering Sprints & Deliverables';
      case 'retainers':
        return 'Retainers & Billing Health';
      case 'analytics':
        return 'Agency Performance Pulse';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="h-16 px-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Zone 1: Breadcrumbs / Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-slate-500">
            {viewMode === 'admin' ? 'Agency CRM' : 'Client Portal'}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-semibold truncate">
            {viewMode === 'admin' ? getTabTitle(currentTab) : 'Client Project Hub'}
          </span>
        </div>
        {viewMode === 'admin' && (
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            ({clientsCount} {clientsCount === 1 ? 'account' : 'accounts'})
          </span>
        )}
      </div>

      {/* Zone 2: Navigation contextual shortcuts / quick status */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400">
        <button
          onClick={onToggleViewMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
            viewMode === 'portal'
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-950 text-indigo-300 border-indigo-500/30 hover:border-indigo-500/60'
          }`}
        >
          {viewMode === 'admin' ? (
            <>
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Preview Client Portal Mode</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-white" />
              <span>Switch to Agency Admin Mode</span>
            </>
          )}
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={onResetData}
          title="Reset to default agency client dataset"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Zone 3: Primary Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {viewMode === 'admin' ? (
          <>
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Tech Brief</span>
            </button>
            <button
              onClick={onOpenNewClient}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Onboard Client</span>
            </button>
          </>
        ) : (
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Return to Admin Console</span>
          </button>
        )}
      </div>
    </header>
  );
};
