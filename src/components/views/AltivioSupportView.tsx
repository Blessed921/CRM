import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { 
  Headphones, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  MessageSquare,
  X,
  Send
} from 'lucide-react';
import { SupportTicket } from '../../types/altivio';

export const AltivioSupportView: React.FC = () => {
  const { activeTenant, createSupportTicket } = useAltivio();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Content Change');
  const [priority, setPriority] = useState<SupportTicket['priority']>('Normal');
  const [description, setDescription] = useState('');

  const tickets = activeTenant.supportTickets || [];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    createSupportTicket(activeTenant.id, {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Agency Support Desk
            </span>
            <span className="text-slate-400 text-xs">Dedicated Altivio Engineering Team</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1 font-display">
            Altivio Concierge & Website Requests
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Included in your ${activeTenant.monthlyWebsiteFee}/mo website plan. Request changes, new feature integrations, or DNS assistance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Request Website Update</span>
        </button>
      </div>

      {/* SLA Guarantees Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-white">4-Hour Response SLA</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Agency engineers acknowledge and triage all requests within 4 hours during business days.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-white">Zero Regression Deployments</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              All edits undergo automated Lighthouse speed checks before publishing to production.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-white">Continuous Feature Updates</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Altivio upgrades your dashboard and website tech stack continuously with zero downtime.
            </p>
          </div>
        </div>
      </div>

      {/* Support Tickets Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Your Active & Completed Requests
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {tickets.length} total tickets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400">
                <th className="py-3 px-4 font-medium">Ticket Subject</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Submitted</th>
                <th className="py-3 px-4 font-medium text-right">Altivio Assignee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">
                    {t.subject}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {t.category}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                          : t.priority === 'High'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {t.status === 'Resolved' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                    {t.status === 'In Progress' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    )}
                    {t.status === 'Open' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                        <AlertCircle className="w-3 h-3" />
                        Queued
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {t.createdAt}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 text-[11px]">
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white font-display">
              Request Website Update
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your request will be dispatched directly to Altivio's dedicated web developers.
            </p>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Request Summary / Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Update pricing on services page"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Content Change">Content Change</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Speed & SEO">Speed & SEO</option>
                    <option value="Domain & DNS">Domain & DNS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Details / Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Please describe the exact text or change requested..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
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
