/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useServiceModule } from '../../hooks/useServiceModule';
import { GitBranch, FileText, Receipt, Clock, Plus, X } from 'lucide-react';
import type { LeadStage } from '../../types/altivio';

interface ServiceModuleViewProps {
  initialSubTab?: 'leads-pipeline' | 'quotes' | 'invoices' | 'follow-ups';
}

type ServiceSubTab = 'leads' | 'quotes' | 'invoices' | 'followups';

function mapPropToTab(prop: ServiceModuleViewProps['initialSubTab']): ServiceSubTab {
  if (prop === 'quotes') return 'quotes';
  if (prop === 'invoices') return 'invoices';
  if (prop === 'follow-ups') return 'followups';
  return 'leads';
}

export const ServiceModuleView: React.FC<ServiceModuleViewProps> = ({
  initialSubTab = 'leads-pipeline',
}) => {
  const { tenant } = useTenant();
  const { addLead, updateLeadStage, addQuote, updateInvoiceStatus } = useServiceModule();
  const navigate = useNavigate();

  const subTab = mapPropToTab(initialSubTab);

  const switchSubTab = (routeSegment: string) => {
    navigate(`/app/${tenant.slug}/service/${routeSegment}`);
  };

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);

  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadService, setLeadService] = useState('');
  const [leadValue, setLeadValue] = useState<number>(3500);

  const [quoteClient, setQuoteClient] = useState('');
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteItemDesc, setQuoteItemDesc] = useState('');
  const [quoteItemPrice, setQuoteItemPrice] = useState<number>(2400);

  const serviceData = tenant.serviceData || {
    leads: [],
    quotes: [],
    invoices: [],
    followUps: [],
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;

    await addLead({
      clientName: leadName.trim(),
      contactPerson: leadName.trim(),
      email: leadEmail.trim(),
      phone: leadPhone.trim() || '+1 (555) 000-0000',
      stage: 'new',
      estimatedValue: Number(leadValue) || 2000,
      serviceRequested: leadService.trim() || 'General Consultation',
      source: 'Direct Website Lead Form',
      notes: 'Submitted via Altivio service module.',
    });

    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadService('');
    setIsAddLeadOpen(false);
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteClient.trim() || !quoteTitle.trim()) return;

    const num = `Q-2026-${Math.floor(100 + Math.random() * 900)}`;
    await addQuote({
      quoteNumber: num,
      clientName: quoteClient.trim(),
      title: quoteTitle.trim(),
      items: [
        {
          description: quoteItemDesc.trim() || quoteTitle.trim(),
          qty: 1,
          unitPrice: Number(quoteItemPrice) || 2000,
        },
      ],
      totalAmount: Number(quoteItemPrice) || 2000,
      status: 'sent',
      validUntil: 'Nov 30, 2026',
    });

    setQuoteClient('');
    setQuoteTitle('');
    setQuoteItemDesc('');
    setIsAddQuoteOpen(false);
  };

  const leadStages: { id: LeadStage; label: string }[] = [
    { id: 'new', label: 'New Inbound' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'consultation', label: 'Consultation Booked' },
    { id: 'quoted', label: 'Quote Sent' },
    { id: 'won', label: 'Won / Signed' },
    { id: 'lost', label: 'Lost' },
  ];

  return (
    <div className="space-y-6">
      {/* Module Navigation Sub-Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                Altivio Service Engine
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{tenant.name}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white font-display mt-1">
              Client Pipeline, Quotes &amp; Invoicing Engine
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Turn website enquiries into accepted quotes, collected deposits, and scheduled
              follow-ups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => switchSubTab('leads')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                subTab === 'leads'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Leads Pipeline ({serviceData.leads.length})</span>
            </button>
            <button
              type="button"
              onClick={() => switchSubTab('quotes')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                subTab === 'quotes'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Quotes ({serviceData.quotes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => switchSubTab('invoices')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                subTab === 'invoices'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Invoices ({serviceData.invoices.length})</span>
            </button>
            <button
              type="button"
              onClick={() => switchSubTab('follow-ups')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                subTab === 'followups'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Follow-ups ({serviceData.followUps.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: LEADS PIPELINE */}
      {subTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Active Consultation &amp; Service Leads ({serviceData.leads.length})
            </span>
            <button
              type="button"
              onClick={() => setIsAddLeadOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {leadStages.map((stage) => {
              const leadsInStage = serviceData.leads.filter((l) => l.stage === stage.id);
              const stageValue = leadsInStage.reduce((acc, l) => acc + l.estimatedValue, 0);

              return (
                <div
                  key={stage.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col min-h-[340px]"
                >
                  <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {leadsInStage.length}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 mb-2 tabular-nums">
                    ${stageValue.toLocaleString()}
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {leadsInStage.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] truncate">
                          {lead.clientName}
                        </div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-300 font-mono truncate">
                          {lead.serviceRequested}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex justify-between">
                          <span>Est:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            ${lead.estimatedValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                            Stage:
                          </span>
                          <select
                            aria-label={`Stage for ${lead.clientName}`}
                            value={lead.stage}
                            onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-800 dark:text-slate-200 font-mono"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="consultation">Consultation</option>
                            <option value="quoted">Quoted</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: QUOTES & PROPOSALS */}
      {subTab === 'quotes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Quotes &amp; Proposals ({serviceData.quotes.length})
            </span>
            <button
              type="button"
              onClick={() => setIsAddQuoteOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Quote</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                    <th className="py-3 px-4">Quote #</th>
                    <th className="py-3 px-4">Client / Patient</th>
                    <th className="py-3 px-4">Proposal Scope</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Valid Until</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {serviceData.quotes.map((q) => (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {q.quoteNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-200">
                        {q.clientName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{q.title}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        ${q.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {q.validUntil}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-mono capitalize font-semibold ${
                            q.status === 'accepted'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : q.status === 'sent'
                                ? 'text-sky-600 dark:text-sky-400'
                                : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INVOICES & PAYMENTS */}
      {subTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Client Invoices &amp; Online Payments ({serviceData.invoices.length})
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {serviceData.invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-200">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-200">
                        {inv.clientName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {inv.title}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {inv.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-mono capitalize font-semibold ${
                            inv.status === 'paid'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {inv.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => updateInvoiceStatus(inv.id, 'paid')}
                            className="px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300 hover:text-white bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-200 dark:border-emerald-800/50 rounded-md transition-colors cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: AUTOMATED FOLLOW-UPS */}
      {subTab === 'followups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Automated Client Follow-up Sequences ({serviceData.followUps.length})
            </span>
          </div>

          <div className="space-y-2">
            {serviceData.followUps.map((fu) => (
              <div
                key={fu.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-2">
                    <span>{fu.recipientName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-300">
                      {fu.channel}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                      ({fu.recipientEmail})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    Trigger:{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {fu.triggerEvent}
                    </span>{' '}
                    · Template: {fu.templateName}
                  </div>
                </div>

                <div className="sm:text-right font-mono text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 block">
                    {fu.scheduledDate}
                  </span>
                  <span
                    className={`inline-block mt-0.5 text-[10px] capitalize font-semibold ${
                      fu.status === 'completed'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {fu.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD LEAD */}
      {isAddLeadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Add Inbound Service Lead
              </h2>
              <button
                type="button"
                onClick={() => setIsAddLeadOpen(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Customer / Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Vance"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Service Requested
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Smile Consultation"
                  value={leadService}
                  onChange={(e) => setLeadService(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  value={leadValue}
                  onChange={(e) => setLeadValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold cursor-pointer"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE QUOTE */}
      {isAddQuoteOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                Create Quote / Proposal
              </h2>
              <button
                type="button"
                onClick={() => setIsAddQuoteOpen(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateQuote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harrison Ford-Miller"
                  value={quoteClient}
                  onChange={(e) => setQuoteClient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Invisalign Full 24-Stage Plan"
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Line Item Description
                </label>
                <input
                  type="text"
                  placeholder="Full treatment, digital scans & retainers"
                  value={quoteItemDesc}
                  onChange={(e) => setQuoteItemDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Total Amount ($)
                </label>
                <input
                  type="number"
                  value={quoteItemPrice}
                  onChange={(e) => setQuoteItemPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddQuoteOpen(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold cursor-pointer"
                >
                  Issue Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
