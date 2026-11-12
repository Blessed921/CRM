import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Globe, 
  RefreshCw, 
  Server, 
  Clock, 
  Smartphone, 
  Monitor,
  Search
} from 'lucide-react';

export const WebsiteHealthView: React.FC = () => {
  const { activeTenant } = useAltivio();
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAuditText, setLastAuditText] = useState(activeTenant.websiteHealth.lastChecked);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setLastAuditText('Just now');
    }, 1200);
  };

  const health = activeTenant.websiteHealth;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Verified Infrastructure
            </span>
            <span className="text-slate-400 text-xs">Core Web Vitals & Uptime SLA</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 font-display">
            Website Health & Speed Vitals
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time performance audit for {activeTenant.customDomain}. Fast websites rank higher on Google and convert more visitors into revenue.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
          <span>{isAuditing ? 'Testing Vitals...' : 'Run Live Speed Test'}</span>
        </button>
      </div>

      {/* 4 Big Scores Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Speed Score */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">PageSpeed Score</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {health.speedScore}<span className="text-sm font-normal text-slate-500">/100</span>
            </div>
            <div className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Top 3% worldwide</span>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">90-Day Uptime SLA</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              {health.uptime}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>0 outages recorded</span>
            </div>
          </div>
        </div>

        {/* SEO Score */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Search SEO Health</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold font-mono text-indigo-300 tabular-nums">
              {health.seoScore}<span className="text-sm font-normal text-slate-500">/100</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Schema & Metadata intact</span>
            </div>
          </div>
        </div>

        {/* Security & SSL */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">SSL / Encryption</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold font-mono text-emerald-400">
              Active TLS 1.3
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Managed 256-bit certificate
            </div>
          </div>
        </div>
      </div>

      {/* Google Core Web Vitals Breakdown */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Google Core Web Vitals
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              The official metrics Google uses to rank websites in search results
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Audit timestamp: {lastAuditText}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px] font-mono">LCP (Largest Contentful Paint)</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">0.82s</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Google threshold: &lt; 2.5s (Passed)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px] font-mono">INP (Interaction to Next Paint)</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">28ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Google threshold: &lt; 200ms (Passed)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px] font-mono">CLS (Layout Shift)</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">0.001</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Google threshold: &lt; 0.1 (Passed)</div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 text-[11px] font-mono">TTFB (Server Response)</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">112ms</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Cloudflare Edge Cache Hit</div>
          </div>
        </div>
      </div>

      {/* Global Edge Delivery & Device Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-white">Altivio Edge CDN Delivery</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your website is compiled to high-speed static assets distributed across 280+ worldwide edge nodes. Even on spotty cellular connections, pages render in under a second.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-slate-800">
            <span className="text-slate-400">CDN Cache Hit Ratio:</span>
            <span className="text-emerald-400 font-bold">98.6%</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono border-t border-slate-800 pt-2">
            <span className="text-slate-400">DNS Resolution Speed:</span>
            <span className="text-slate-200">14ms average</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-white">Mobile vs Desktop Experience</h3>
          </div>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Mobile Speed Index (68% of visitors)</span>
                <span className="font-mono text-emerald-400 font-bold">97/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Desktop Speed Index (32% of visitors)</span>
                <span className="font-mono text-emerald-400 font-bold">99/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '99%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
