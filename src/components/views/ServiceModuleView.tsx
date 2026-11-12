import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  GitBranch, 
  FileText, 
  Receipt, 
  Clock, 
  Plus, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone,
  DollarSign,
  ArrowRight,
  X
} from 'lucide-react';
import { LeadStage, ServiceLead, ServiceQuote, ServiceInvoice } from '../../types/altivio';

interface ServiceModuleViewProps {
  initialSubTab?: 'leads-pipeline' | 'quotes' | 'invoices' | 'follow-ups';
}

export const ServiceModuleView: React.FC<ServiceModuleViewProps> = ({ initialSubTab = 'leads-pipeline' }) => {
  const { 
    activeTenant, 
    updateLeadStage, 
    addLead, 
    addQuote, 
    updateInvoiceStatus 
  } = useAltivio();
  const [subTab, setSubTab] = useState<'leads' | 'quotes' | 'invoices' | 'followups'>(
    initialSubTab === 'quotes'
      ? 'quotes'
      : initialSubTab === 'invoices'
      ? 'invoices'
      : initialSubTab === 'follow-ups'
      ? 'followups'
      : 'leads'
  );

  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);

  // New lead form
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadService, setLeadService] = useState('');
  const [leadValue, setLeadValue] = useState<number>(3500);

  // New quote form
  const [quoteClient, setQuoteClient] = useState('');
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteItemDesc, setQuoteItemDesc] = useState('');
  const [quoteItemPrice, setQuoteItemPrice] = useState<number>(2400);

  const serviceData = activeTenant.serviceData || {
    leads: [],
    quotes: [],
    invoices: [],
    followUps: [],
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;

    addLead(activeTenant.id, {
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

  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteClient.trim() || !quoteTitle.trim()) return;

    const num = `Q-2026-${Math.floor(100 + Math.random() * 900)}`;
    addQuote(activeTenant.id, {
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
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Altivio Service Module
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Active for {activeTenant.name}
              </span>
            </div>
            <h2 className="text-base font-bold text-white font-display mt-1">
              Client Pipeline, Quotes & Invoicing Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Turn website enquiries into accepted quotes, collected deposits, and scheduled follow-ups.
            </p>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSubTab('leads')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                subTab === 'leads' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Leads Pipeline ({serviceData.leads.length})</span>
            </button>
            <button
              onClick={() => setSubTab('quotes')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                subTab === 'quotes' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Quotes ({serviceData.quotes.length})</span>
            </button>
            <button
              onClick={() => setSubTab('invoices')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                subTab === 'invoices' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Invoices ({serviceData.invoices.length})</span>
            </button>
            <button
              onClick={() => setSubTab('followups')}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                subTab === 'followups' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Follow-ups ({serviceData.followUps.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: LEADS PIPELINE */}
      {subTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Active Consultation & Service Leads ({serviceData.leads.length})
            </span>
            <button
              onClick={() => setIsAddLeadOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
          </div>

          {/* Kanban Stage Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {leadStages.map((stage) => {
              const leadsInStage = serviceData.leads.filter((l) => l.stage === stage.id);
              const stageValue = leadsInStage.reduce((acc, l) => acc + l.estimatedValue, 0);

              return (
                <div key={stage.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col min-h-[380px]">
                  <div className="pb-2 mb-2 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 text-[11px] truncate">{stage.label}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded">
                      {leadsInStage.length}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-emerald-400 mb-2">
                    ${stageValue.toLocaleString()}
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {leadsInStage.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs space-y-1.5 hover:border-slate-700 transition-colors"
                      >
                        <div className="font-semibold text-slate-100 text-[11px] truncate">
                          {lead.clientName}
                        </div>
                        <div className="text-[10px] text-indigo-300 font-mono truncate">
                          {lead.serviceRequested}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                          <span>Est:</span>
                          <span className="font-bold text-emerald-400">${lead.estimatedValue.toLocaleString()}</span>
                        </div>
                        {/* Move stage dropdown */}
                        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-mono">Stage:</span>
                          <select
                            value={lead.stage}
                            onChange={(e) =>
                              updateLeadStage(activeTenant.id, lead.id, e.target.value as LeadStage)
                            }
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200 font-mono"
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
            <span className="text-xs font-semibold text-slate-200">
              Quotes & Treatment / Job Proposals ({serviceData.quotes.length})
            </span>
            <button
              onClick={() => setIsAddQuoteOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Quote</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Quote #</th>
                  <th className="py-3 px-4">Client / Patient</th>
                  <th className="py-3 px-4">Proposal Scope</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {serviceData.quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      {q.quoteNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {q.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {q.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                      ${q.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {q.validUntil}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          q.status === 'accepted'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : q.status === 'sent'
                            ? 'bg-sky-950/60 text-sky-400 border border-sky-800/40'
                            : 'bg-slate-800 text-slate-400'
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
      )}

      {/* SUB-VIEW 3: INVOICES & PAYMENTS */}
      {subTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Client Invoices & Online Payments ({serviceData.invoices.length})
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {serviceData.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {inv.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {inv.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {inv.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => updateInvoiceStatus(activeTenant.id, inv.id, 'paid')}
                          className="px-2.5 py-1 text-xs text-emerald-400 hover:text-white bg-emerald-950/50 hover:bg-emerald-600 border border-emerald-800/50 rounded transition-colors"
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
      )}

      {/* SUB-VIEW 4: AUTOMATED FOLLOW-UPS */}
      {subTab === 'followups' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Automated Client Follow-up Sequences ({serviceData.followUps.length})
            </span>
          </div>

          <div className="space-y-2">
            {serviceData.followUps.map((fu) => (
              <div
                key={fu.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-100 flex items-center gap-2">
                    <span>{fu.recipientName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {fu.channel}
                    </span>
                    <span className="text-slate-400 font-normal">({fu.recipientEmail})</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Trigger: <span className="text-indigo-400 font-medium">{fu.triggerEvent}</span> · Template: {fu.templateName}
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <span className="text-slate-400 block">{fu.scheduledDate}</span>
                  <span
                    className={`inline-block mt-0.5 text-[10px] uppercase font-semibold ${
                      fu.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display">Add Inbound Service Lead</h3>
              <button onClick={() => setIsAddLeadOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Customer / Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Victoria Vance"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Requested</label>
                <input
                  type="text"
                  placeholder="e.g. Full Smile Consultation / Heat Pump Replacement"
                  value={leadService}
                  onChange={(e) => setLeadService(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Estimated Value ($)</label>
                <input
                  type="number"
                  value={leadValue}
                  onChange={(e) => setLeadValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-indigo-600 hover:bg-indigo-500 rounded font-semibold"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display">Create Quote / Proposal</h3>
              <button onClick={() => setIsAddQuoteOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateQuote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harrison Ford-Miller"
                  value={quoteClient}
                  onChange={(e) => setQuoteClient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Invisalign Full 24-Stage Plan"
                  value={quoteTitle}
                  onChange={(e) => setQuoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Line Item Description</label>
                <input
                  type="text"
                  placeholder="Full treatment, digital scans & retainers"
                  value={quoteItemDesc}
                  onChange={(e) => setQuoteItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Total Amount ($)</label>
                <input
                  type="number"
                  value={quoteItemPrice}
                  onChange={(e) => setQuoteItemPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddQuoteOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-indigo-600 hover:bg-indigo-500 rounded font-semibold"
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
