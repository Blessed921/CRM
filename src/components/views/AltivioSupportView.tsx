/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useBaseTenantActions } from '../../hooks/useBaseTenantActions';
import { Plus, CheckCircle2, Clock, AlertCircle, ShieldCheck, Zap, X, Send } from 'lucide-react';
import type { SupportTicket } from '../../types/altivio';

export const AltivioSupportView: React.FC = () => {
  const { tenant } = useTenant();
  const { createSupportTicket } = useBaseTenantActions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Content Change');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Normal');
  const [description, setDescription] = useState('');

  const tickets = tenant.supportTickets || [];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    await createSupportTicket({
      subject: subject.trim(),
      category,
      priority,
    });

    setSubject('');
    setDescription('');
    setCategory('Content Change');
    setPriority('Normal');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Agency Support Desk
            </span>
            <span aria-hidden="true">·</span>
            <span>Dedicated Altivio Engineering Team</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-display">
            Altivio Concierge &amp; Website Requests
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Included in your ${tenant.monthlyWebsiteFee}/mo website plan. Request changes, new
            feature integrations, or DNS assistance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Request Website Update</span>
        </button>
      </div>

      {/* SLA Guarantees Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              4-Hour Response SLA
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Agency engineers acknowledge and triage all requests within 4 hours during business
              days.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Zero Regression Deployments
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              All edits undergo automated Lighthouse speed checks before publishing to production.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Continuous Feature Updates
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Altivio upgrades your dashboard and website tech stack continuously with zero
              downtime.
            </p>
          </div>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-900 dark:text-slate-200">
            Your Active &amp; Completed Requests
          </h2>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {tickets.length} total tickets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-medium">Ticket Subject</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Submitted</th>
                <th className="py-3 px-4 font-medium text-right">Altivio Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                    {t.subject}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {t.category}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-mono ${
                        t.priority === 'Urgent'
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : t.priority === 'High'
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {t.status === 'Resolved' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                    {t.status === 'In Progress' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-600 dark:text-sky-400">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    )}
                    {t.status === 'Open' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3 h-3" />
                        Queued
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {t.createdAt}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                    {t.altivioAssignee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Request */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Request Website Update
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your request will be dispatched directly to Altivio&apos;s dedicated web developers.
            </p>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Request Summary / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Update pricing on services page"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Content Change">Content Change</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Speed & SEO">Speed &amp; SEO</option>
                    <option value="Domain & DNS">Domain &amp; DNS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SupportTicket['priority'])}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Details / Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Please describe the exact text or change requested..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
