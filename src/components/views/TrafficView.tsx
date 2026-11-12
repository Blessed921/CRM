import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  DollarSign, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Globe, 
  MapPin, 
  Layers, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  CheckCircle2, 
  Eye, 
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';

type DateRange = '7d' | '30d' | '90d';
type MetricView = 'users' | 'sessions' | 'conversions' | 'revenue';
type AcquisitionTab = 'channel' | 'source' | 'campaign';

export const TrafficView: React.FC = () => {
  const { activeTenant } = useAltivio();
  const proof = activeTenant.revenueProof;

  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [activeMetric, setActiveMetric] = useState<MetricView>('users');
  const [acquisitionTab, setAcquisitionTab] = useState<AcquisitionTab>('channel');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(true);

  // Time-series mock data generator (30 points representing the current and comparison periods)
  const chartData = [
    { date: 'Oct 14', users: 95, sessions: 114, conversions: 1, revenue: 1200, prevUsers: 82, prevRevenue: 950 },
    { date: 'Oct 16', users: 112, sessions: 135, conversions: 1, revenue: 1400, prevUsers: 90, prevRevenue: 1100 },
    { date: 'Oct 18', users: 128, sessions: 154, conversions: 2, revenue: 2600, prevUsers: 104, prevRevenue: 1300 },
    { date: 'Oct 20', users: 104, sessions: 126, conversions: 1, revenue: 1100, prevUsers: 98, prevRevenue: 1200 },
    { date: 'Oct 22', users: 145, sessions: 178, conversions: 2, revenue: 2800, prevUsers: 115, prevRevenue: 1800 },
    { date: 'Oct 24', users: 138, sessions: 165, conversions: 1, revenue: 1300, prevUsers: 120, prevRevenue: 1400 },
    { date: 'Oct 26', users: 156, sessions: 190, conversions: 3, revenue: 3900, prevUsers: 128, prevRevenue: 2200 },
    { date: 'Oct 28', users: 142, sessions: 172, conversions: 1, revenue: 1400, prevUsers: 130, prevRevenue: 1600 },
    { date: 'Oct 30', users: 168, sessions: 205, conversions: 2, revenue: 3100, prevUsers: 135, prevRevenue: 2100 },
    { date: 'Nov 01', users: 154, sessions: 188, conversions: 2, revenue: 2700, prevUsers: 140, prevRevenue: 2400 },
    { date: 'Nov 03', users: 175, sessions: 214, conversions: 3, revenue: 4200, prevUsers: 148, prevRevenue: 2600 },
    { date: 'Nov 05', users: 189, sessions: 232, conversions: 3, revenue: 4600, prevUsers: 152, prevRevenue: 2900 },
    { date: 'Nov 07', users: 162, sessions: 198, conversions: 2, revenue: 2900, prevUsers: 145, prevRevenue: 2500 },
    { date: 'Nov 09', users: 210, sessions: 258, conversions: 4, revenue: 5800, prevUsers: 160, prevRevenue: 3400 },
    { date: 'Nov 11', users: 224, sessions: 275, conversions: 4, revenue: 6100, prevUsers: 172, prevRevenue: 3800 },
    { date: 'Nov 12', users: 198, sessions: 242, conversions: 3, revenue: 4500, prevUsers: 165, prevRevenue: 3200 },
  ];

  // Scale calculations for SVG area chart
  const maxMetric = Math.max(
    ...chartData.map((d) => (activeMetric === 'revenue' ? d.revenue : activeMetric === 'conversions' ? d.conversions : activeMetric === 'sessions' ? d.sessions : d.users))
  );

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 20;
  const paddingY = 25;

  const getPoints = (key: 'current' | 'prev') => {
    return chartData.map((d, i) => {
      const val = key === 'current'
        ? (activeMetric === 'revenue' ? d.revenue : activeMetric === 'conversions' ? d.conversions : activeMetric === 'sessions' ? d.sessions : d.users)
        : (activeMetric === 'revenue' ? d.prevRevenue : activeMetric === 'conversions' ? Math.max(0, d.conversions - 1) : activeMetric === 'sessions' ? Math.round(d.prevUsers * 1.2) : d.prevUsers);
      
      const x = paddingX + (i / (chartData.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - (val / (maxMetric || 1)) * (svgHeight - paddingY * 2);
      return { x, y, val, date: d.date };
    });
  };

  const currentPoints = getPoints('current');
  const prevPoints = getPoints('prev');

  const pathCurrent = `M ${currentPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaCurrent = `${pathCurrent} L ${currentPoints[currentPoints.length - 1].x},${svgHeight - paddingY} L ${currentPoints[0].x},${svgHeight - paddingY} Z`;
  const pathPrev = `M ${prevPoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;

  // GA4 Session Default Channel Groupings
  const channelData = [
    {
      channel: 'Organic Search',
      medium: 'google / organic',
      users: 2150,
      sessions: 2620,
      engagedSessions: 1820,
      engagementRate: 69.4,
      conversions: 24,
      revenue: 31200,
      share: 64.2,
    },
    {
      channel: 'Paid Social',
      medium: 'instagram / cpc',
      users: 940,
      sessions: 1140,
      engagedSessions: 650,
      engagementRate: 57.0,
      conversions: 8,
      revenue: 11400,
      share: 23.5,
    },
    {
      channel: 'Direct',
      medium: '(none)',
      users: 510,
      sessions: 620,
      engagedSessions: 440,
      engagementRate: 70.9,
      conversions: 4,
      revenue: 4600,
      share: 9.5,
    },
    {
      channel: 'Referral',
      medium: 'healthcare-directory / link',
      users: 220,
      sessions: 270,
      engagedSessions: 160,
      engagementRate: 59.2,
      conversions: 2,
      revenue: 1400,
      share: 2.8,
    },
  ];

  // GA4 Conversion Funnel Data
  const funnelSteps = [
    { step: 1, name: 'session_start', count: 4650, pct: 100, label: 'All Website Sessions' },
    { step: 2, name: 'page_view (Service Detail)', count: 3410, pct: 73.3, label: 'Browsed Core Offerings' },
    { step: 3, name: 'scroll_90 (Deep Interest)', count: 2180, pct: 46.9, label: 'Read Case Studies & Reviews' },
    { step: 4, name: 'form_start (Intent)', count: 412, pct: 8.9, label: 'Opened Consultation Form' },
    { step: 5, name: 'conversion_complete', count: 38, pct: 4.8, label: 'Lead Captured / Booked' },
  ];

  return (
    <div className="space-y-6">
      {/* GA4 Top Navigation & Realtime Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">
                  {activeTenant.name}
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  GA4 Stream
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Flow
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                <span>Measurement ID: G-ALTV{activeTenant.id.replace(/\D/g, '') || '9821'}</span>
                <span>·</span>
                <span>{activeTenant.customDomain}</span>
              </div>
            </div>
          </div>

          {/* Controls: Date Picker & Comparison */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Live active users right now badge */}
            <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-medium">Realtime:</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">24 active</span>
              <span className="text-slate-500 text-[10px]">(last 30 min)</span>
            </div>

            {/* Date range segmented control */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
              <button
                onClick={() => setDateRange('7d')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  dateRange === '7d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange('30d')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  dateRange === '30d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDateRange('90d')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                  dateRange === '90d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                90 Days
              </button>
            </div>

            {/* Compare toggle */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${
                showComparison
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              <span>Compare: Previous period</span>
            </button>
          </div>
        </div>
      </div>

      {/* GA4 Core Scorecard Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Users */}
        <button
          onClick={() => setActiveMetric('users')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeMetric === 'users'
              ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Users</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {proof.trafficMonthly.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2%</span>
          </div>
        </button>

        {/* Metric 2: Sessions */}
        <button
          onClick={() => setActiveMetric('sessions')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeMetric === 'sessions'
              ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sessions</span>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {Math.round(proof.trafficMonthly * 1.22).toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.8%</span>
          </div>
        </button>

        {/* Metric 3: Engagement Rate */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Engagement Rate</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
            64.8%
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Avg: 2m 48s
          </div>
        </div>

        {/* Metric 4: Bounce Rate */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Bounce Rate</span>
            <span className="text-slate-500 text-[10px]">GA4 Engaged</span>
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
            35.2%
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            <span>-3.4% (better)</span>
          </div>
        </div>

        {/* Metric 5: Key Events / Conversions */}
        <button
          onClick={() => setActiveMetric('conversions')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeMetric === 'conversions'
              ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Conversions</span>
            <Target className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1.5 tabular-nums">
            {proof.conversionsCount}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>{proof.conversionRate}% rate</span>
          </div>
        </button>

        {/* Metric 6: Event Value / Revenue */}
        <button
          onClick={() => setActiveMetric('revenue')}
          className={`p-4 rounded-xl text-left border transition-all ${
            activeMetric === 'revenue'
              ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Event Value</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1.5 tabular-nums">
            ${proof.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-emerald-300 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.0%</span>
          </div>
        </button>
      </div>

      {/* Main GA4 Time-Series Area Chart */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Users & Sessions Over Time
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {activeMetric === 'revenue' ? 'Event Value ($)' : activeMetric === 'conversions' ? 'Key Event Conversions' : activeMetric === 'sessions' ? 'Website Sessions' : 'Unique Active Users'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-500 rounded-full" />
              <span className="text-slate-300">Current Period</span>
            </div>
            {showComparison && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-500" />
                <span className="text-slate-500">Prior Period</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-60 select-none overflow-visible"
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            <defs>
              <linearGradient id="gaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Guide Grid Lines */}
            {[0.25, 0.5, 0.75, 1].map((pct, gIdx) => {
              const y = svgHeight - paddingY - pct * (svgHeight - paddingY * 2);
              return (
                <line
                  key={gIdx}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill for current period */}
            <path d={areaCurrent} fill="url(#gaAreaGradient)" />

            {/* Dotted comparison line for previous period */}
            {showComparison && (
              <path
                d={pathPrev}
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
            )}

            {/* Primary line for current period */}
            <path
              d={pathCurrent}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Dots & Crosshair Detection */}
            {currentPoints.map((pt, idx) => {
              const isHovered = hoveredPointIndex === idx;
              return (
                <g key={idx}>
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={paddingY}
                      x2={pt.x}
                      y2={svgHeight - paddingY}
                      stroke="#818cf8"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3}
                    fill="#6366f1"
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all cursor-pointer"
                  />

                  {/* Invisible wide capture area */}
                  <rect
                    x={pt.x - 15}
                    y={0}
                    width={30}
                    height={svgHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    className="cursor-pointer"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive GA4 Tooltip */}
          {hoveredPointIndex !== null && (
            <div
              className="absolute pointer-events-none bg-slate-950 border border-slate-750 p-2.5 rounded-lg shadow-xl text-xs font-mono z-30 transition-all transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${(currentPoints[hoveredPointIndex].x / svgWidth) * 100}%`,
                top: `${currentPoints[hoveredPointIndex].y - 12}px`,
              }}
            >
              <div className="text-slate-400 text-[10px] mb-1 font-sans">
                {currentPoints[hoveredPointIndex].date}, 2026
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-300">Current:</span>
                <span className="font-bold text-white">
                  {activeMetric === 'revenue'
                    ? `$${currentPoints[hoveredPointIndex].val.toLocaleString()}`
                    : currentPoints[hoveredPointIndex].val.toLocaleString()}
                </span>
              </div>
              {showComparison && (
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                  <span>Prior:</span>
                  <span>
                    {activeMetric === 'revenue'
                      ? `$${prevPoints[hoveredPointIndex].val.toLocaleString()}`
                      : prevPoints[hoveredPointIndex].val.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* X-axis date markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 px-2 pt-1 border-t border-slate-800">
          <span>{chartData[0].date}</span>
          <span>{chartData[Math.floor(chartData.length / 2)].date}</span>
          <span>{chartData[chartData.length - 1].date}</span>
        </div>
      </div>

      {/* GA4 Traffic Acquisition Table (Session Default Channel Group) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-display">
              Traffic Acquisition: Session Default Channel Group
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Standard Google Analytics 4 attribution across organic search, social ads, and direct navigation
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => setAcquisitionTab('channel')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                acquisitionTab === 'channel' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Channel Group
            </button>
            <button
              onClick={() => setAcquisitionTab('source')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                acquisitionTab === 'source' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Source / Medium
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium text-[11px]">
                <th className="py-3 px-4">Session Default Channel</th>
                <th className="py-3 px-4 font-mono text-right">Users</th>
                <th className="py-3 px-4 font-mono text-right">Sessions</th>
                <th className="py-3 px-4 font-mono text-right">Engaged Sessions</th>
                <th className="py-3 px-4 font-mono text-right">Engagement Rate</th>
                <th className="py-3 px-4 font-mono text-right">Key Events</th>
                <th className="py-3 px-4 font-mono text-right">Event Value ($)</th>
                <th className="py-3 px-4 text-right">Traffic Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {channelData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{acquisitionTab === 'channel' ? row.channel : row.medium}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300 text-right tabular-nums">
                    {row.users.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300 text-right tabular-nums">
                    {row.sessions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300 text-right tabular-nums">
                    {row.engagedSessions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-300 text-right tabular-nums">
                    {row.engagementRate}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-right tabular-nums">
                    {row.conversions}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-right tabular-nums">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${row.share}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {row.share}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Column Split: Top Landing Pages & GA4 Funnel Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pages & Screens */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Pages and Screens: Page Path
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Top viewed URLs on {activeTenant.customDomain}</p>
            </div>
            <span className="text-xs font-mono text-indigo-400">4 Active Landing Pages</span>
          </div>

          <div className="space-y-3">
            {activeTenant.topPages.map((page, pIdx) => (
              <div
                key={pIdx}
                className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-mono text-xs text-white truncate flex items-center gap-1.5">
                    <span>{page.page}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Conversion rate: {((page.conversions / page.views) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-white tabular-nums">
                    {page.views.toLocaleString()} views
                  </div>
                  <div className="text-[11px] text-emerald-400 tabular-nums font-semibold">
                    {page.conversions} leads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: GA4 Conversion Funnel Visualization */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-display">
                Funnel Exploration: User Journey
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Drop-off analysis from discovery to booking</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">4.8% Final Conversion</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {funnelSteps.map((step) => (
              <div key={step.step} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    {step.step}. <span className="font-mono text-slate-400">{step.name}</span>
                  </span>
                  <span className="font-mono text-white font-semibold tabular-nums">
                    {step.count.toLocaleString()} ({step.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Breakdown: Devices, OS & Geographic Metropolitan Origins */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Devices */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Device Category</span>
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-2.5 pt-1 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile (iOS & Android)
                </span>
                <span className="font-mono text-white font-bold">68.4%</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  Desktop & Laptops
                </span>
                <span className="font-mono text-white font-bold">28.2%</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Tablet className="w-3.5 h-3.5 text-slate-400" />
                  Tablet
                </span>
                <span className="font-mono text-white font-bold">3.4%</span>
              </div>
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '3.4%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Systems */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Operating System</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Apple iOS</span>
              <span className="text-white font-bold">54.2%</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Microsoft Windows</span>
              <span className="text-white font-bold">22.4%</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Google Android</span>
              <span className="text-white font-bold">14.1%</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Apple macOS</span>
              <span className="text-white font-bold">9.3%</span>
            </div>
          </div>
        </div>

        {/* City & Geographic Acquisition */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-white">Top User Metro Cities</span>
            <MapPin className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">New York, NY</span>
              <span className="text-emerald-400 font-bold">1,980 (51.8%)</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Brooklyn, NY</span>
              <span className="text-slate-200">840 (22.0%)</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Jersey City, NJ</span>
              <span className="text-slate-200">420 (11.0%)</span>
            </div>
            <div className="p-2 bg-slate-950/60 rounded flex justify-between items-center">
              <span className="text-slate-300">Queens, NY</span>
              <span className="text-slate-200">350 (9.2%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
