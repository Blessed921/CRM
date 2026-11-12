import React from 'react';
import { useAltivio } from '../context/AltivioContext';
import { 
  Globe, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Sparkles,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface AltivioHeaderProps {
  onOpenNewClientModal: () => void;
}

export const AltivioHeader: React.FC<AltivioHeaderProps> = ({ onOpenNewClientModal }) => {
  const { 
    tenants, 
    activeTenant, 
    setActiveTenantId, 
    viewMode, 
    setViewMode, 
    resetToDefaults 
  } = useAltivio();

  return (
    <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Zone 1: Current Tenant & Live Domain */}
      <div className="flex items-center gap-3 min-w-0">
        {viewMode === 'tenant' ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white font-mono shadow-xs shrink-0"
              style={{ backgroundColor: activeTenant.brandAccentHex || '#6366f1' }}
            >
              {activeTenant.logoInitials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs truncate font-display">
                  {activeTenant.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {activeTenant.activeModule.toUpperCase()} ENGINE
                </span>
              </div>
              <a
                href={`https://${activeTenant.customDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 font-mono transition-colors truncate"
              >
                <span>{activeTenant.customDomain}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
              ALT
            </div>
            <div>
              <div className="font-bold text-white font-display">Altivio Partner Console</div>
              <div className="text-[11px] text-slate-400">Multi-Tenant Client Websites Fleet</div>
            </div>
          </div>
        )}
      </div>

      {/* Zone 2: Fast Tenant Switcher Dropdown */}
      <div className="hidden md:flex items-center gap-3 text-xs">
        <span className="text-slate-400 text-[11px]">Client Site:</span>
        <select
          value={activeTenant.id}
          onChange={(e) => {
            setActiveTenantId(e.target.value);
            if (viewMode === 'altivio-admin') setViewMode('tenant');
          }}
          className="bg-slate-950/80 border border-slate-750 hover:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium transition-colors cursor-pointer shadow-xs"
        >
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.activeModule === 'service' ? 'Service Engine' : 'Shop Engine'})
            </option>
          ))}
        </select>

        <span className="text-slate-700">|</span>

        <button
          onClick={resetToDefaults}
          title="Reset to initial sample tenants"
          className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Zone 3: Mode Switcher & Altivio Admin Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Toggle between Client Portal vs Altivio Master Admin */}
        <button
          onClick={() => setViewMode(viewMode === 'tenant' ? 'altivio-admin' : 'tenant')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
            viewMode === 'altivio-admin'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-slate-950 text-indigo-300 border-indigo-500/30 hover:border-indigo-500/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>
            {viewMode === 'altivio-admin' ? 'Viewing Altivio Fleet' : 'Altivio Master Admin'}
          </span>
        </button>

        {viewMode === 'altivio-admin' && (
          <button
            onClick={onOpenNewClientModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy Client Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
};
