/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import {
  BarChart3,
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
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ExternalLink,
} from 'lucide-react';

type DateRange = '7d' | '30d' | '90d';
type MetricView = 'users' | 'sessions' | 'conversions' | 'revenue';
type AcquisitionTab = 'channel' | 'source';

export const TrafficView: React.FC = () => {
  const { tenant } = useTenant();
  const proof = tenant.revenueProof;

  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [activeMetric, setActiveMetric] = useState<MetricView>('users');
  const [acquisitionTab, setAcquisitionTab] = useState<AcquisitionTab>('channel');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(true);

  const rangeFactor = dateRange === '7d' ? 0.25 : dateRange === '90d' ? 2.8 : 1;

  const chartData = [
    {
      date: 'Oct 14',
      users: 95,
      sessions: 114,
      conversions: 1,
      revenue: 1200,
      prevUsers: 82,
      prevRevenue: 950,
    },
    {
      date: 'Oct 16',
      users: 112,
      sessions: 135,
      conversions: 1,
      revenue: 1400,
      prevUsers: 90,
      prevRevenue: 1100,
    },
    {
      date: 'Oct 18',
      users: 128,
      sessions: 154,
      conversions: 2,
      revenue: 2600,
      prevUsers: 104,
      prevRevenue: 1300,
    },
    {
      date: 'Oct 20',
      users: 104,
      sessions: 126,
      conversions: 1,
      revenue: 1100,
      prevUsers: 98,
      prevRevenue: 1200,
    },
    {
      date: 'Oct 22',
      users: 145,
      sessions: 178,
      conversions: 2,
      revenue: 2800,
      prevUsers: 115,
      prevRevenue: 1800,
    },
    {
      date: 'Oct 24',
      users: 138,
      sessions: 165,
      conversions: 1,
      revenue: 1300,
      prevUsers: 120,
      prevRevenue: 1400,
    },
    {
      date: 'Oct 26',
      users: 156,
      sessions: 190,
      conversions: 3,
      revenue: 3900,
      prevUsers: 128,
      prevRevenue: 2200,
    },
    {
      date: 'Oct 28',
      users: 142,
      sessions: 172,
      conversions: 1,
      revenue: 1400,
      prevUsers: 130,
      prevRevenue: 1600,
    },
    {
      date: 'Oct 30',
      users: 168,
      sessions: 205,
      conversions: 2,
      revenue: 3100,
      prevUsers: 135,
      prevRevenue: 2100,
    },
    {
      date: 'Nov 01',
      users: 154,
      sessions: 188,
      conversions: 2,
      revenue: 2700,
      prevUsers: 140,
      prevRevenue: 2400,
    },
    {
      date: 'Nov 03',
      users: 175,
      sessions: 214,
      conversions: 3,
      revenue: 4200,
      prevUsers: 148,
      prevRevenue: 2600,
    },
    {
      date: 'Nov 05',
      users: 189,
      sessions: 232,
      conversions: 3,
      revenue: 4600,
      prevUsers: 152,
      prevRevenue: 2900,
    },
    {
      date: 'Nov 07',
      users: 162,
      sessions: 198,
      conversions: 2,
      revenue: 2900,
      prevUsers: 145,
      prevRevenue: 2500,
    },
    {
      date: 'Nov 09',
      users: 210,
      sessions: 258,
      conversions: 4,
      revenue: 5800,
      prevUsers: 160,
      prevRevenue: 3400,
    },
    {
      date: 'Nov 11',
      users: 224,
      sessions: 275,
      conversions: 4,
      revenue: 6100,
      prevUsers: 172,
      prevRevenue: 3800,
    },
    {
      date: 'Nov 12',
      users: 198,
      sessions: 242,
      conversions: 3,
      revenue: 4500,
      prevUsers: 165,
      prevRevenue: 3200,
    },
  ].map((pt) => ({
    ...pt,
    users: Math.round(pt.users * rangeFactor),
    sessions: Math.round(pt.sessions * rangeFactor),
    conversions: Math.max(1, Math.round(pt.conversions * rangeFactor)),
    revenue: Math.round(pt.revenue * rangeFactor),
    prevUsers: Math.round(pt.prevUsers * rangeFactor),
    prevRevenue: Math.round(pt.prevRevenue * rangeFactor),
  }));

  const maxMetric = Math.max(
    ...chartData.map((d) =>
      activeMetric === 'revenue'
        ? d.revenue
        : activeMetric === 'conversions'
          ? d.conversions
          : activeMetric === 'sessions'
            ? d.sessions
            : d.users
    )
  );

  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 20;
  const paddingY = 25;

  const getPoints = (key: 'current' | 'prev') => {
    return chartData.map((d, i) => {
      const val =
        key === 'current'
          ? activeMetric === 'revenue'
            ? d.revenue
            : activeMetric === 'conversions'
              ? d.conversions
              : activeMetric === 'sessions'
                ? d.sessions
                : d.users
          : activeMetric === 'revenue'
            ? d.prevRevenue
            : activeMetric === 'conversions'
              ? Math.max(0, d.conversions - 1)
              : activeMetric === 'sessions'
                ? Math.round(d.prevUsers * 1.2)
                : d.prevUsers;

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

  const channelData = tenant.trafficSources.map((src) => ({
    channel: src.source,
    medium: src.source.toLowerCase().replace(/[^a-z0-9]+/g, ' / '),
    users: Math.round(src.visitors * rangeFactor),
    sessions: Math.round(src.visitors * 1.22 * rangeFactor),
    engagedSessions: Math.round(src.visitors * 0.84 * rangeFactor),
    engagementRate: Number((58 + src.conversionRate * 2).toFixed(1)),
    conversions: Math.max(
      1,
      Math.round(src.visitors * (src.conversionRate / 100) * 0.35 * rangeFactor)
    ),
    revenue: Math.round(src.revenue * rangeFactor),
    share: Math.round((src.revenue / Math.max(1, proof.monthlyRevenue)) * 100),
  }));

  const funnelSteps = [
    { step: 1, name: 'session_start', count: Math.round(proof.trafficMonthly * 1.22), pct: 100 },
    {
      step: 2,
      name: 'page_view (Offering Detail)',
      count: Math.round(proof.trafficMonthly * 0.89),
      pct: 73.3,
    },
    {
      step: 3,
      name: 'scroll_90 (Deep Interest)',
      count: Math.round(proof.trafficMonthly * 0.57),
      pct: 46.9,
    },
    {
      step: 4,
      name: 'form_start (Intent)',
      count: Math.round(proof.trafficMonthly * 0.11),
      pct: 8.9,
    },
    {
      step: 5,
      name: 'conversion_complete',
      count: proof.conversionsCount,
      pct: proof.conversionRate,
    },
  ];

  return (
    <div className="space-y-6">
      {/* GA4 Stream Top Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-display">
                {tenant.name} · Google Analytics 4
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                <span>Stream G-ALTV{tenant.id.replace(/\D/g, '') || '9821'}</span>
                <span aria-hidden="true">·</span>
                <span>{tenant.customDomain}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  24 active users (last 30m)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                    dateRange === range
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                showComparison
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
            >
              Compare: Previous period
            </button>
          </div>
        </div>
      </div>

      {/* GA4 Core Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => setActiveMetric('users')}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            activeMetric === 'users'
              ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Users</span>
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {Math.round(proof.trafficMonthly * rangeFactor).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.2%</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetric('sessions')}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            activeMetric === 'sessions'
              ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Sessions</span>
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {Math.round(proof.trafficMonthly * 1.22 * rangeFactor).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.8%</span>
          </div>
        </button>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Engagement Rate</span>
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            64.8%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Avg: 2m 48s
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Bounce Rate</span>
            <span className="text-slate-400 text-[10px]">GA4</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            35.2%
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            <span>-3.4%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveMetric('conversions')}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            activeMetric === 'conversions'
              ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Conversions</span>
            <Target className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1.5 tabular-nums">
            {Math.max(1, Math.round(proof.conversionsCount * rangeFactor))}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {proof.conversionRate}% rate
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveMetric('revenue')}
          className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
            activeMetric === 'revenue'
              ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Event Value</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1.5 tabular-nums">
            ${Math.round(proof.monthlyRevenue * rangeFactor).toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-300 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.0%</span>
          </div>
        </button>
      </div>

      {/* Main GA4 Time-Series Area Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-slate-900 dark:text-white font-display">
              Users &amp; Sessions Over Time
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              · {activeMetric}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-1 rounded-full"
                style={{ backgroundColor: tenant.brandAccentHex || '#4f46e5' }}
              />
              <span className="text-slate-700 dark:text-slate-300">Current Period</span>
            </div>
            {showComparison && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                <span className="text-slate-500">Prior Period</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-48 sm:h-60 select-none overflow-visible"
            onMouseLeave={() => setHoveredPointIndex(null)}
          >
            <defs>
              <linearGradient id="gaAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={tenant.brandAccentHex || '#4f46e5'}
                  stopOpacity="0.28"
                />
                <stop
                  offset="100%"
                  stopColor={tenant.brandAccentHex || '#4f46e5'}
                  stopOpacity="0.0"
                />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75, 1].map((pct, gIdx) => {
              const y = svgHeight - paddingY - pct * (svgHeight - paddingY * 2);
              return (
                <line
                  key={gIdx}
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            <path d={areaCurrent} fill="url(#gaAreaGradient)" />

            {showComparison && (
              <path
                d={pathPrev}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            )}

            <path
              d={pathCurrent}
              fill="none"
              stroke={tenant.brandAccentHex || '#4f46e5'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

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
                      stroke={tenant.brandAccentHex || '#4f46e5'}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3}
                    fill={tenant.brandAccentHex || '#4f46e5'}
                    className="stroke-white dark:stroke-slate-900 transition-all cursor-pointer"
                    strokeWidth="2"
                  />
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

          {hoveredPointIndex !== null && (
            <div
              className="absolute pointer-events-none bg-slate-900 dark:bg-slate-950 text-white border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono z-30 transform -translate-x-1/2 -translate-y-full"
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
                <span className="font-bold">
                  {activeMetric === 'revenue'
                    ? `$${currentPoints[hoveredPointIndex].val.toLocaleString()}`
                    : currentPoints[hoveredPointIndex].val.toLocaleString()}
                </span>
              </div>
              {showComparison && (
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
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

        <div className="flex justify-between text-[11px] font-mono text-slate-500 px-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <span>{chartData[0].date}</span>
          <span>{chartData[Math.floor(chartData.length / 2)].date}</span>
          <span>{chartData[chartData.length - 1].date}</span>
        </div>
      </div>

      {/* GA4 Traffic Acquisition Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-200 font-display">
              Traffic Acquisition: Session Default Channel Group
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Attribution across organic search, social campaigns, and direct navigation
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={() => setAcquisitionTab('channel')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                acquisitionTab === 'channel'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Channel Group
            </button>
            <button
              type="button"
              onClick={() => setAcquisitionTab('source')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                acquisitionTab === 'source'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Source / Medium
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                <th className="py-3 px-4">Session Default Channel</th>
                <th className="py-3 px-4 font-mono text-right">Users</th>
                <th className="py-3 px-4 font-mono text-right">Sessions</th>
                <th className="py-3 px-4 font-mono text-right">Engaged</th>
                <th className="py-3 px-4 font-mono text-right">Engagement Rate</th>
                <th className="py-3 px-4 font-mono text-right">Key Events</th>
                <th className="py-3 px-4 font-mono text-right">Event Value</th>
                <th className="py-3 px-4 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {channelData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{acquisitionTab === 'channel' ? row.channel : row.medium}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 text-right tabular-nums">
                    {row.users.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 text-right tabular-nums">
                    {row.sessions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 text-right tabular-nums">
                    {row.engagedSessions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-600 dark:text-indigo-300 text-right tabular-nums">
                    {row.engagementRate}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white text-right tabular-nums">
                    {row.conversions}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-right tabular-nums">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.share}%`,
                            backgroundColor: tenant.brandAccentHex || '#4f46e5',
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
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

      {/* Pages & Funnel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white font-display">
                Pages and Screens: Page Path
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Top viewed URLs on {tenant.customDomain}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {tenant.topPages.length} Pages
            </span>
          </div>

          <div className="space-y-2.5">
            {tenant.topPages.map((page, pIdx) => (
              <div
                key={pIdx}
                className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-mono text-xs text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                    <span>{page.page}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Conversion rate: {((page.conversions / page.views) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    {page.views.toLocaleString()} views
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 tabular-nums font-semibold">
                    {page.conversions} leads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white font-display">
                Funnel Exploration: User Journey
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Drop-off analysis from discovery to booking
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {proof.conversionRate}% Final
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {funnelSteps.map((step) => (
              <div key={step.step} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {step.step}. <span className="font-mono text-slate-500">{step.name}</span>
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-semibold tabular-nums">
                    {step.count.toLocaleString()} ({step.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${step.pct}%`,
                      backgroundColor: tenant.brandAccentHex || '#4f46e5',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tech & Geo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Device Category
            </span>
            <Smartphone className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2.5 pt-1 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  Mobile
                </span>
                <span className="font-mono font-bold">68.4%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  Desktop
                </span>
                <span className="font-mono font-bold">28.2%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28.2%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Tablet className="w-3.5 h-3.5 text-slate-400" />
                  Tablet
                </span>
                <span className="font-mono font-bold">3.4%</span>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '3.4%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Operating System
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2 text-xs font-mono">
            {[
              ['Apple iOS', '54.2%'],
              ['Microsoft Windows', '22.4%'],
              ['Google Android', '14.1%'],
              ['Apple macOS', '9.3%'],
            ].map(([os, pct]) => (
              <div
                key={os}
                className="p-2 bg-slate-50 dark:bg-slate-950/60 rounded flex justify-between items-center"
              >
                <span className="text-slate-700 dark:text-slate-300">{os}</span>
                <span className="text-slate-900 dark:text-white font-bold">{pct}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Top User Metro Cities
            </span>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-2 text-xs font-mono">
            {[
              ['New York, NY', '1,980 (51.8%)'],
              ['Brooklyn, NY', '840 (22.0%)'],
              ['Jersey City, NJ', '420 (11.0%)'],
              ['Queens, NY', '350 (9.2%)'],
            ].map(([city, val]) => (
              <div
                key={city}
                className="p-2 bg-slate-50 dark:bg-slate-950/60 rounded flex justify-between items-center"
              >
                <span className="text-slate-700 dark:text-slate-300">{city}</span>
                <span className="text-slate-900 dark:text-white font-semibold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
