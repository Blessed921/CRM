import React, { useState } from 'react';
import { Client } from '../types/crm';
import { 
  CircleDollarSign, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Receipt,
  PlusCircle,
  FileCheck2
} from 'lucide-react';

interface BillingRetainersViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
}

export const BillingRetainersView: React.FC<BillingRetainersViewProps> = ({
  clients,
  onSelectClient,
  onUpdateClient,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState<number>(4);

  const totalMrr = clients.reduce((acc, c) => acc + c.monthlyRetainer, 0);
  const totalHoursLogged = clients.reduce((acc, c) => acc + c.hoursLoggedMonth, 0);
  const totalHoursCap = clients.reduce((acc, c) => acc + c.hoursMonthlyCap, 0);

  const handleAddHours = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    const newHours = client.hoursLoggedMonth + hoursToAdd;
    onUpdateClient(clientId, { hoursLoggedMonth: newHours });
    setSelectedClientId(null);
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-emerald-400" />
              <span>Agency Retainer Contracts & Burn Rate Ledger</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active engineering retainers, monthly hours budget consumption, and overage tracking.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                Total Agency Retainers
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-white">
                ${totalMrr.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
              </div>
            </div>
            <div className="text-right border-l border-slate-800 pl-6">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                Total Hours Burned
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-indigo-300">
                {totalHoursLogged} / {totalHoursCap} hrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retainer Client Ledger Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            Client Billing Accounts ({clients.length})
          </span>
          <span className="text-xs text-slate-400">
            Billing Cycle: Nov 1 – Nov 30, 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Monthly Retainer</th>
                <th className="py-3 px-4">Hourly Rate</th>
                <th className="py-3 px-4">Hours Used / Cap</th>
                <th className="py-3 px-4">Burn Percentage</th>
                <th className="py-3 px-4">Renewal Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.map((client) => {
                const burnPct = Math.round((client.hoursLoggedMonth / client.hoursMonthlyCap) * 100);
                const isOverCap = client.hoursLoggedMonth > client.hoursMonthlyCap;
                const overageHours = Math.max(0, client.hoursLoggedMonth - client.hoursMonthlyCap);
                const overageCost = overageHours * (client.hourlyRate || 175);

                return (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-400">
                          {client.logoText}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{client.name}</div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {client.engagementModel.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-200 font-medium">
                      ${client.monthlyRetainer.toLocaleString()}
                      <span className="text-[11px] text-slate-400 ml-1 font-sans">/mo</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                      ${client.hourlyRate || 175}/hr
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums">
                      <span className={isOverCap ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {client.hoursLoggedMonth}h
                      </span>
                      <span className="text-slate-500"> / {client.hoursMonthlyCap}h</span>
                      {isOverCap && (
                        <div className="text-[10px] text-rose-400 flex items-center gap-1 mt-0.5 font-sans font-medium">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>+{overageHours}h billable (${overageCost})</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className={burnPct > 100 ? 'text-rose-400' : 'text-slate-300'}>
                            {burnPct}%
                          </span>
                          <span className="text-slate-400">{client.hoursMonthlyCap - client.hoursLoggedMonth}h left</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              burnPct > 100
                                ? 'bg-rose-500'
                                : burnPct > 85
                                ? 'bg-amber-400'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(burnPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300 text-xs">
                      {client.contractRenewalDate}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedClientId(client.id)}
                          className="px-2 py-1 text-[11px] text-indigo-400 hover:text-indigo-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
                        >
                          Log Hours
                        </button>
                        <button
                          onClick={() => onSelectClient(client)}
                          className="px-2 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Hours Modal Dialog */}
      {selectedClientId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Log Development Hours
              </h3>
              <button
                onClick={() => setSelectedClientId(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Add logged engineering sprint hours for{' '}
              <span className="text-white font-medium">
                {clients.find((c) => c.id === selectedClientId)?.name}
              </span>
            </p>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Hours to add</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedClientId(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAddHours(selectedClientId)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
              >
                Add {hoursToAdd} Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
