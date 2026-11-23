/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { DollarSign, TrendingUp, Sparkles, ArrowUpRight, Globe } from 'lucide-react';

export const ProofOverviewView: React.FC = () => {
  const { tenant } = useTenant();
  const navigate = useNavigate();
  const proof = tenant.revenueProof;
  const growthPct = proof.prevMonthlyRevenue
    ? Math.round(
        ((proof.monthlyRevenue - proof.prevMonthlyRevenue) / proof.prevMonthlyRevenue) * 100
      )
    : 18;

  const basePath = `/app/${tenant.slug}`;

  return (
    <div className="space-y-6">
      {/* Proof Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
              Verified Website Revenue Proof · November 2026
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              What Your Website Earned This Month
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every website Altivio delivers is engineered as a profit center. Real-time attribution
              tracking inbound form submissions, bookings, and customer transactions back to{' '}
              {tenant.customDomain}.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shrink-0 flex items-center gap-6">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                Website Investment ROI
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                {proof.roiMultiplier.toFixed(1)}x
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                ${proof.monthlyRevenue.toLocaleString()} vs ${tenant.monthlyWebsiteFee}/mo
              </span>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-6">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
                Core Web Vitals
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {tenant.websiteHealth.speedScore}/100
              </div>
              <button
                type="button"
                onClick={() => navigate(`${basePath}/health`)}
                className="text-[11px] font-medium hover:underline flex items-center gap-0.5 cursor-pointer"
                style={{ color: 'var(--brand-accent)' }}
              >
                <span>{tenant.websiteHealth.uptime}% uptime</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Attributed Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            ${proof.monthlyRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              +{growthPct}%
            </span>
            <span>vs last month (${proof.prevMonthlyRevenue.toLocaleString()})</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">
              {tenant.activeModule === 'service' ? 'Client Enquiries / Bookings' : 'Online Orders'}
            </span>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--brand-accent)' }} />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {proof.conversionsCount}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
              conversions
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>Avg Value:</span>
            <span className="font-mono text-slate-900 dark:text-slate-200 tabular-nums">
              ${proof.avgValue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Site Conversion Rate</span>
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {proof.conversionRate}%
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            2.8x industry benchmark
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Website Visitors</span>
            <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {proof.trafficMonthly.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            98/100 Core Web Vitals
          </div>
        </div>
      </div>

      {/* Traffic Attribution & Top Pages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Source Attribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Revenue Attribution by Traffic Channel
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Which channels generate paying clients for your website.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/analytics`)}
              className="text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: 'var(--brand-accent)' }}
            >
              <span>View GA4 Analytics</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {tenant.trafficSources.map((src, i) => {
              const pctOfRevenue = Math.round((src.revenue / proof.monthlyRevenue) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {src.source}
                    </span>
                    <div className="font-mono text-right">
                      <span className="text-slate-900 dark:text-white font-bold tabular-nums">
                        ${src.revenue.toLocaleString()}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-1.5">
                        ({pctOfRevenue}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${pctOfRevenue}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{src.visitors.toLocaleString()} visitors</span>
                    <span>{src.conversionRate}% conversion rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Converting Website Pages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Top Converting Pages on Your Website
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                The exact landing pages driving enquiries and purchases.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/content`)}
              className="text-xs font-medium flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: 'var(--brand-accent)' }}
            >
              <span>Edit Pages</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {tenant.topPages.map((page, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-medium text-slate-900 dark:text-slate-200">
                    {page.page}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {page.views.toLocaleString()} page views
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {page.conversions} conversions
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {((page.conversions / page.views) * 100).toFixed(1)}% conv. rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Enquiries */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
          <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
            Recent Website Enquiries · Live Form Attribution
          </div>
          <button
            type="button"
            onClick={() => navigate(`${basePath}/enquiries`)}
            className="text-xs font-medium hover:underline cursor-pointer"
            style={{ color: 'var(--brand-accent)' }}
          >
            Open All Enquiries ({tenant.enquiries.length}) →
          </button>
        </div>

        <div className="space-y-2">
          {tenant.enquiries.slice(0, 3).map((enq) => (
            <div
              key={enq.id}
              className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-2">
                  <span>{enq.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 dark:text-slate-300 font-normal">
                    {enq.subjectOrService}
                  </span>
                  {enq.estimatedValue && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] tabular-nums">
                      ~${enq.estimatedValue.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>From: {enq.sourcePage}</span>
                  <span aria-hidden="true">·</span>
                  <span>Via: {enq.referralSource}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{enq.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 capitalize">
                  {enq.status}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`${basePath}/enquiries`)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
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
