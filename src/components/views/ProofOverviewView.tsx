import React from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  Award, 
  CheckCircle2, 
  Layers, 
  Globe, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

export const ProofOverviewView: React.FC = () => {
  const { activeTenant, setActiveTab } = useAltivio();
  const proof = activeTenant.revenueProof;
  const growthPct = Math.round(
    ((proof.monthlyRevenue - proof.prevMonthlyRevenue) / proof.prevMonthlyRevenue) * 100
  );

  return (
    <div className="space-y-6">
      {/* Proof Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Altivio Verified Revenue Proof
              </span>
              <span className="text-xs text-slate-400 font-mono">
                November 2026 Live Tracking
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              What Your Website Earned This Month
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every website Altivio delivers is engineered as a profit center. Real-time attribution tracking all inbound form submissions, bookings, and customer transactions directly back to your website pages.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 shrink-0 flex items-center gap-6">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                Website Investment ROI
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                {proof.roiMultiplier.toFixed(1)}x
              </div>
              <span className="text-[11px] text-slate-400">
                ${proof.monthlyRevenue.toLocaleString()} earned vs ${activeTenant.monthlyWebsiteFee}/mo fee
              </span>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                Speed & Vitals
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-indigo-400 mt-0.5">
                {activeTenant.websiteHealth.speedScore}/100
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>99.98% Uptime</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Monthly Attributed Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Attributed Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            ${proof.monthlyRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold font-mono">+{growthPct}%</span>
            <span>vs last month (${proof.prevMonthlyRevenue.toLocaleString()})</span>
          </div>
        </div>

        {/* Metric 2: Total Conversions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">
              {activeTenant.activeModule === 'service' ? 'Client Enquiries / Bookings' : 'Online Orders'}
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {proof.conversionsCount}
            <span className="text-xs font-normal text-slate-400 ml-1">conversions</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>Avg Deal / Order:</span>
            <span className="font-mono text-slate-200 tabular-nums">${proof.avgValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 3: Conversion Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Site Conversion Rate</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {proof.conversionRate}%
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>2.8x industry benchmark</span>
          </div>
        </div>

        {/* Metric 4: Total Visitors */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Website Visitors</span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {proof.trafficMonthly.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>98/100 Core Web Vitals</span>
          </div>
        </div>
      </div>

      {/* Traffic Attribution & Top Pages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Source Attribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                <span>Revenue Attribution by Traffic Channel</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Which channels generate paying clients for your website.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('traffic')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View GA4 Analytics</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {activeTenant.trafficSources.map((src, i) => {
              const pctOfRevenue = Math.round((src.revenue / proof.monthlyRevenue) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{src.source}</span>
                    <div className="font-mono text-right">
                      <span className="text-white font-bold tabular-nums">
                        ${src.revenue.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[11px] ml-1.5">
                        ({pctOfRevenue}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pctOfRevenue}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{src.visitors.toLocaleString()} visitors</span>
                    <span>{src.conversionRate}% conversion rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Converting Website Pages */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-semibold text-slate-100">
                Top Converting Pages on Your Website
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The exact landing pages driving enquiries and purchases.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('content-editor')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Edit Pages</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {activeTenant.topPages.map((page, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-medium text-slate-200 flex items-center gap-1.5">
                    <span>{page.page}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {page.views.toLocaleString()} page views
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400 tabular-nums">
                    {page.conversions} conversions
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {((page.conversions / page.views) * 100).toFixed(1)}% conv. rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Enquiries / Actions Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
            <span>Recent Website Enquiries & Lead Submissions</span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
              Live Form Attribution
            </span>
          </div>
          <button
            onClick={() => setActiveTab('enquiries')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Open All Enquiries ({activeTenant.enquiries.length}) →
          </button>
        </div>

        <div className="space-y-2">
          {activeTenant.enquiries.slice(0, 3).map((enq) => (
            <div
              key={enq.id}
              className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-slate-100 flex items-center gap-2">
                  <span>{enq.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300 font-normal">{enq.subjectOrService}</span>
                  {enq.estimatedValue && (
                    <span className="text-emerald-400 font-mono text-[11px]">
                      (~${enq.estimatedValue.toLocaleString()})
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>From: {enq.sourcePage}</span>
                  <span aria-hidden="true">·</span>
                  <span>Via: {enq.referralSource}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-400">{enq.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {enq.status}
                </span>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="px-2.5 py-1 text-xs text-indigo-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
