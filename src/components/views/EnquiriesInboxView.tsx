/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useBaseTenantActions } from '../../hooks/useBaseTenantActions';
import type { Enquiry } from '../../types/altivio';
import { Mail, Phone } from 'lucide-react';

export const EnquiriesInboxView: React.FC = () => {
  const { tenant } = useTenant();
  const { updateEnquiryStatus } = useBaseTenantActions();

  const [filter, setFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredEnquiries = tenant.enquiries.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const selectedEnquiry =
    filteredEnquiries.find((e) => e.id === selectedId) || filteredEnquiries[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Website Form Submissions &amp; Enquiries Inbox</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Every lead and contact form inquiry submitted on {tenant.customDomain} captured with
              source attribution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            {[
              { id: 'all', label: `All (${tenant.enquiries.length})` },
              {
                id: 'new',
                label: `New (${tenant.enquiries.filter((e) => e.status === 'new').length})`,
              },
              { id: 'contacted', label: 'Contacted' },
              { id: 'qualified', label: 'Qualified' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  filter === item.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-2.5">
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No enquiries match the current filter.
            </div>
          ) : (
            filteredEnquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <button
                  key={enq.id}
                  type="button"
                  onClick={() => setSelectedId(enq.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/30 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                      {enq.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 capitalize">
                      {enq.status}
                    </span>
                  </div>

                  <div
                    className="font-medium truncate mb-1"
                    style={{ color: 'var(--brand-accent)' }}
                  >
                    {enq.subjectOrService}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    "{enq.message}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>{enq.createdAt}</span>
                    {enq.estimatedValue && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                        ~${enq.estimatedValue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {selectedEnquiry.name}
                  </h2>
                  <div
                    className="text-xs font-medium mt-0.5"
                    style={{ color: 'var(--brand-accent)' }}
                  >
                    {selectedEnquiry.subjectOrService}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                    Received {selectedEnquiry.createdAt}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      updateEnquiryStatus(selectedEnquiry.id, e.target.value as Enquiry['status'])
                    }
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified Lead</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg flex items-center gap-2.5 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                      Email Address
                    </span>
                    <span className="truncate block font-medium">{selectedEnquiry.email}</span>
                  </div>
                </a>

                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg flex items-center gap-2.5 text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                      Phone Number
                    </span>
                    <span className="truncate block font-medium">{selectedEnquiry.phone}</span>
                  </div>
                </a>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  Customer Message
                </span>
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 text-xs">
                <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold block">
                  Website Attribution Footprint
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      Submitted on Page:
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">
                      {selectedEnquiry.sourcePage}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">
                      Referral Channel:
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-200">
                      {selectedEnquiry.referralSource}
                    </span>
                  </div>
                  {selectedEnquiry.estimatedValue && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block">
                        Estimated Value:
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        ${selectedEnquiry.estimatedValue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-xs text-slate-500 dark:text-slate-400">
              Select an enquiry from the list to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
