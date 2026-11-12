import React, { useState } from 'react';
import { useAltivio } from '../../context/AltivioContext';
import { Enquiry } from '../../types/altivio';
import { 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Archive, 
  ExternalLink, 
  ArrowUpRight,
  Filter,
  DollarSign
} from 'lucide-react';

export const EnquiriesInboxView: React.FC = () => {
  const { activeTenant, updateEnquiryStatus } = useAltivio();
  const [filter, setFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(
    activeTenant.enquiries[0] || null
  );

  const filteredEnquiries = activeTenant.enquiries.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Website Form Submissions & Enquiries Inbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Every lead and contact form inquiry submitted on {activeTenant.customDomain} captured with source attribution.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({activeTenant.enquiries.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'new' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              New ({activeTenant.enquiries.filter((e) => e.status === 'new').length})
            </button>
            <button
              onClick={() => setFilter('contacted')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'contacted' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Contacted
            </button>
            <button
              onClick={() => setFilter('qualified')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filter === 'qualified' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Qualified
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Master List on Left, Detail Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Enquiry Cards List (5 columns) */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredEnquiries.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center text-xs text-slate-400">
              No enquiries match the current filter.
            </div>
          ) : (
            filteredEnquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`p-4 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-1.5">
                    <span className="font-semibold text-slate-100 text-sm truncate">
                      {enq.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        enq.status === 'new'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          : enq.status === 'qualified'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <div className="text-indigo-300 font-medium truncate mb-1">
                    {enq.subjectOrService}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    "{enq.message}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{enq.createdAt}</span>
                    {enq.estimatedValue && (
                      <span className="text-emerald-400 font-bold">
                        ~${enq.estimatedValue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Enquiry Detail View (7 columns) */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedEnquiry.name}
                  </h3>
                  <div className="text-xs text-indigo-400 font-medium mt-0.5">
                    Interest: {selectedEnquiry.subjectOrService}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    Received {selectedEnquiry.createdAt}
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      updateEnquiryStatus(
                        activeTenant.id,
                        selectedEnquiry.id,
                        e.target.value as Enquiry['status']
                      )
                    }
                    className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified Lead</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Contact Actions Bar */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-2.5 text-slate-200 transition-colors"
                >
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Email Address</span>
                    <span className="truncate block font-medium">{selectedEnquiry.email}</span>
                  </div>
                </a>

                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-2.5 text-slate-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Phone Number</span>
                    <span className="truncate block font-medium">{selectedEnquiry.phone}</span>
                  </div>
                </a>
              </div>

              {/* Message Payload */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  Customer Message:
                </span>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Attribution Meta Box */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 text-xs">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold block">
                  Website Attribution Footprint
                </span>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Submitted on Page:</span>
                    <span className="font-mono text-slate-200">{selectedEnquiry.sourcePage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Referral Channel:</span>
                    <span className="font-mono text-slate-200">{selectedEnquiry.referralSource}</span>
                  </div>
                  {selectedEnquiry.estimatedValue && (
                    <div>
                      <span className="text-slate-400 block">Estimated Potential Value:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ${selectedEnquiry.estimatedValue.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center text-xs text-slate-400">
              Select an enquiry from the list to view details and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
