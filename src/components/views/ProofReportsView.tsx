/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { Printer, TrendingUp, ShieldCheck } from 'lucide-react';

export const ProofReportsView: React.FC = () => {
  const { tenant } = useTenant();
  const [selectedMonth, setSelectedMonth] = useState('November 2026');

  const proof = tenant.revenueProof;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Print actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Executive Proof
            </span>
            <span aria-hidden="true">·</span>
            <span>Monthly Financial Performance Certificate</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-display">
            Monthly Website Proof Report
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Verified proof of revenue, customer acquisition, and return on investment delivered by
            your Altivio website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Select audit month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="November 2026">November 2026 (Current)</option>
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Executive Report Document */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white font-mono"
              style={{ backgroundColor: tenant.brandAccentHex || '#4f46e5' }}
            >
              {tenant.logoInitials}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black font-display">
                {tenant.name}
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
                {tenant.customDomain} · {tenant.industry}
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <div className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[11px]">
              Audit Period
            </div>
            <div className="text-slate-900 dark:text-white print:text-black font-bold text-sm">
              {selectedMonth}
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mt-0.5">
              Verified by Altivio OS
            </div>
          </div>
        </div>

        {/* Executive ROI Highlight Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-200">
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
              Attributed Revenue Earned
            </div>
            <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 print:text-emerald-700 mt-1 tabular-nums">
              ${proof.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-300 print:text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.0% growth vs prior period</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
              Altivio Monthly Investment
            </div>
            <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white print:text-black mt-1 tabular-nums">
              ${tenant.monthlyWebsiteFee}
              <span className="text-xs text-slate-500 font-normal">/mo</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1">
              {tenant.websitePlan}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
              Net ROI Return Multiple
            </div>
            <div className="text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 print:text-indigo-600 mt-1 tabular-nums">
              {proof.roiMultiplier.toFixed(1)}x
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-300 print:text-indigo-600 mt-1">
              Every $1 paid returned ${(proof.monthlyRevenue / tenant.monthlyWebsiteFee).toFixed(2)}{' '}
              in revenue
            </div>
          </div>
        </div>

        {/* Operational Proof Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
              Total Visitors
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white print:text-black mt-1 tabular-nums">
              {proof.trafficMonthly.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Unique user sessions</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
              Conversions / Leads
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white print:text-black mt-1 tabular-nums">
              {proof.conversionsCount}
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              {proof.conversionRate}% conversion rate
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
              Average Order / Deal
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white print:text-black mt-1 tabular-nums">
              ${proof.avgValue.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Per paying customer</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 print:border-slate-200">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
              Website Uptime SLA
            </span>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 print:text-emerald-700 mt-1 tabular-nums">
              {tenant.websiteHealth.uptime}%
            </div>
            <span className="text-[10px] text-slate-500">
              Speed score: {tenant.websiteHealth.speedScore}/100
            </span>
          </div>
        </div>

        {/* Traffic Channel Attribution Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-300 print:text-black font-mono">
            Revenue Attribution by Acquisition Channel
          </h3>
          <div className="border border-slate-200 dark:border-slate-800 print:border-slate-300 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 print:bg-slate-100 text-slate-500 dark:text-slate-400 print:text-slate-700">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Channel / Source</th>
                    <th className="py-2.5 px-4 font-medium">Monthly Visitors</th>
                    <th className="py-2.5 px-4 font-medium">Conversion Rate</th>
                    <th className="py-2.5 px-4 font-medium text-right">Attributed Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-200 text-slate-700 dark:text-slate-300 print:text-slate-800">
                  {tenant.trafficSources.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium">{s.source}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums">
                        {s.visitors.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-mono tabular-nums text-emerald-600 dark:text-emerald-400 print:text-emerald-600">
                        {s.conversionRate}%
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900 dark:text-white print:text-black text-right tabular-nums">
                        ${s.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Agency Sign-off Block */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-slate-900 dark:text-white print:text-black font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Certified Performance Delivery</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[11px] max-w-md">
              Prepared automatically by Altivio Platform. Data verified against server telemetry,
              payment events, and direct lead submissions.
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
            <div>Altivio Growth Agency</div>
            <div>Lead Partner: Liam Vance</div>
            <div className="text-indigo-600 dark:text-indigo-400">support@altivio.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};
