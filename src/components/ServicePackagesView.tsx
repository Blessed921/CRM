import React, { useState } from 'react';
import { Client, ServicePackage, PackagePricingModel } from '../types/crm';
import { 
  PackageCheck, 
  Plus, 
  CircleDollarSign, 
  Clock, 
  Check, 
  Building2, 
  SlidersHorizontal, 
  X, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ServicePackagesViewProps {
  packages: ServicePackage[];
  clients: Client[];
  onAddPackage: (pkg: ServicePackage) => void;
  onUpdatePackage: (id: string, updates: Partial<ServicePackage>) => void;
  onDeletePackage: (id: string) => void;
  onAssignPackage: (clientId: string, packageId: string) => void;
  onSelectClient: (client: Client) => void;
}

export const ServicePackagesView: React.FC<ServicePackagesViewProps> = ({
  packages,
  clients,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  onAssignPackage,
  onSelectClient,
}) => {
  const [modelFilter, setModelFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assigningPackage, setAssigningPackage] = useState<ServicePackage | null>(null);
  const [targetClientId, setTargetClientId] = useState<string>(clients[0]?.id || '');

  // Form states for new package
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ServicePackage['category']>('Full-Stack Squad');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPricingModel, setFormPricingModel] = useState<PackagePricingModel>('retainer');
  const [formBasePrice, setFormBasePrice] = useState<number>(24000);
  const [formCadence, setFormCadence] = useState('/ month');
  const [formHoursIncluded, setFormHoursIncluded] = useState<number | null>(140);
  const [formOverageRate, setFormOverageRate] = useState<number | null>(175);
  const [formTurnaroundWeeks, setFormTurnaroundWeeks] = useState<number | undefined>(undefined);
  const [formFeatures, setFormFeatures] = useState('');
  const [formDeliverables, setFormDeliverables] = useState('');
  const [formIdealFor, setFormIdealFor] = useState('');
  const [formSlaTier, setFormSlaTier] = useState<ServicePackage['slaTier']>('Priority 4h SLA');

  const filteredPackages = packages.filter((p) => {
    if (modelFilter === 'all') return true;
    return p.pricingModel === modelFilter;
  });

  const handleOpenAssign = (pkg: ServicePackage) => {
    setAssigningPackage(pkg);
    setTargetClientId(clients[0]?.id || '');
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningPackage || !targetClientId) return;
    onAssignPackage(targetClientId, assigningPackage.id);
    setAssigningPackage(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newPkg: ServicePackage = {
      id: `pkg-${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      tagline: formTagline.trim() || 'Custom engineered software package.',
      description: formDescription.trim(),
      pricingModel: formPricingModel,
      basePrice: Number(formBasePrice) || 10000,
      billingCadence: formCadence.trim(),
      hoursIncluded: formPricingModel === 'retainer' ? Number(formHoursIncluded) || null : null,
      overageRate: formPricingModel === 'retainer' ? Number(formOverageRate) || null : null,
      turnaroundWeeks: formPricingModel === 'fixed' ? Number(formTurnaroundWeeks) || 6 : undefined,
      includedFeatures: formFeatures.split('\n').filter((f) => f.trim() !== ''),
      deliverables: formDeliverables.split('\n').filter((d) => d.trim() !== ''),
      idealFor: formIdealFor.trim() || 'Growing tech startups and enterprises.',
      slaTier: formSlaTier,
      assignedClientsCount: 0,
    };

    onAddPackage(newPkg);
    setIsCreateModalOpen(false);

    // Reset form
    setFormName('');
    setFormTagline('');
    setFormDescription('');
    setFormFeatures('');
    setFormDeliverables('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Agency Customizable Service Packages & Pricing Catalog</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Standardized and bespoke offering tiers (Dedicated Squads, MVP Sprints, 24/7 SLA) linked to active client contracts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setModelFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  modelFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Models ({packages.length})
              </button>
              <button
                onClick={() => setModelFilter('retainer')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  modelFilter === 'retainer' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly Retainers
              </button>
              <button
                onClick={() => setModelFilter('fixed')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  modelFilter === 'fixed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Fixed Milestone
              </button>
              <button
                onClick={() => setModelFilter('hourly')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  modelFilter === 'hourly' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hourly T&M
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPackages.map((pkg) => {
          const assignedClients = clients.filter(
            (c) => c.packageId === pkg.id || c.packageName === pkg.name
          );

          return (
            <div
              key={pkg.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                      {pkg.category}
                    </div>
                    <h3 className="text-base font-bold text-white font-display mt-0.5">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {pkg.tagline}
                    </p>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 uppercase shrink-0">
                    {pkg.pricingModel}
                  </span>
                </div>

                {/* Pricing Structure Bar */}
                <div className="py-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-mono">Investment Terms</span>
                    <div className="text-xl font-bold font-mono tabular-nums text-white mt-0.5">
                      ${pkg.basePrice.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 ml-1 font-sans">
                        {pkg.billingCadence}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    {pkg.hoursIncluded && (
                      <div className="text-slate-200 font-mono tabular-nums">
                        {pkg.hoursIncluded} hrs / month included
                      </div>
                    )}
                    {pkg.overageRate && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        +${pkg.overageRate}/hr overage cap
                      </div>
                    )}
                    {pkg.turnaroundWeeks && (
                      <div className="text-indigo-300 font-medium">
                        {pkg.turnaroundWeeks}-week guaranteed delivery
                      </div>
                    )}
                    <div className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
                      {pkg.slaTier}
                    </div>
                  </div>
                </div>

                {/* Scope & Features Checklist */}
                <div className="py-4 space-y-2 border-b border-slate-800 text-xs">
                  <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider font-mono">
                    Included Engineering Capabilities
                  </span>
                  <div className="space-y-1.5 pt-1">
                    {pkg.includedFeatures.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concrete Deliverables */}
                <div className="py-3 text-xs border-b border-slate-800 space-y-1.5">
                  <span className="font-semibold text-slate-400 block text-[10px] uppercase tracking-wider font-mono">
                    Tangible Deliverables
                  </span>
                  {pkg.deliverables.map((deliv, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-600">›</span>
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>

                {/* Subscribed Clients */}
                <div className="pt-3 pb-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Associated Active Clients ({assignedClients.length}):</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedClients.length === 0 ? (
                      <span className="text-slate-500 text-[11px] italic">
                        No clients currently linked to this package.
                      </span>
                    ) : (
                      assignedClients.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => onSelectClient(c)}
                          className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded text-[11px] font-mono flex items-center gap-1 transition-colors"
                        >
                          <span>{c.name}</span>
                          <span className="text-slate-500">→</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 max-w-xs truncate" title={pkg.idealFor}>
                  Target: {pkg.idealFor}
                </span>

                <button
                  onClick={() => handleOpenAssign(pkg)}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-white bg-indigo-950/50 hover:bg-indigo-600 border border-indigo-800/60 rounded transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Assign to Client</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Assign Package to Client */}
      {assigningPackage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Assign Service Package
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Link <span className="text-indigo-300 font-semibold">{assigningPackage.name}</span> to a client.
                </p>
              </div>
              <button
                onClick={() => setAssigningPackage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Select Target Client Account:
                </label>
                <select
                  value={targetClientId}
                  onChange={(e) => setTargetClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Current: ${c.monthlyRetainer.toLocaleString()}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-950/80 rounded border border-slate-800 space-y-2 text-[11px] text-slate-300">
                <div className="font-semibold text-indigo-400 font-mono">
                  Contract Terms to be Updated:
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Investment:</span>
                  <span className="font-mono text-white">
                    ${assigningPackage.basePrice.toLocaleString()} {assigningPackage.billingCadence}
                  </span>
                </div>
                {assigningPackage.hoursIncluded && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Included Monthly Hours:</span>
                    <span className="font-mono text-white">{assigningPackage.hoursIncluded}h</span>
                  </div>
                )}
                {assigningPackage.overageRate && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billable Overage Rate:</span>
                    <span className="font-mono text-white">${assigningPackage.overageRate}/hr</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Commitment:</span>
                  <span className="font-mono text-emerald-400">{assigningPackage.slaTier}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningPackage(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition-colors"
                >
                  Confirm & Apply Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Custom Service Package */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-display">
                Create Agency Service Package
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Model Integration Sprint"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Category Tier
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full-Stack Squad">Full-Stack Squad</option>
                    <option value="Specialized MVP">Specialized MVP</option>
                    <option value="Advisory & Architecture">Advisory & Architecture</option>
                    <option value="DevOps & Reliability">DevOps & Reliability</option>
                    <option value="Mobile Engineering">Mobile Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tagline (1-line value proposition)
                </label>
                <input
                  type="text"
                  placeholder="e.g. End-to-end LLM fine-tuning and retrieval pipeline in 4 weeks."
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={formPricingModel}
                    onChange={(e) => setFormPricingModel(e.target.value as PackagePricingModel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="retainer">Monthly Retainer</option>
                    <option value="fixed">Fixed Milestone</option>
                    <option value="hourly">Hourly T&M</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Base Investment ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Cadence Suffix
                  </label>
                  <input
                    type="text"
                    value={formCadence}
                    onChange={(e) => setFormCadence(e.target.value)}
                    placeholder="/ month or flat milestone"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {formPricingModel === 'retainer' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Included Monthly Hours
                    </label>
                    <input
                      type="number"
                      value={formHoursIncluded || ''}
                      onChange={(e) => setFormHoursIncluded(parseFloat(e.target.value) || null)}
                      placeholder="160"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Overage Rate ($/hr)
                    </label>
                    <input
                      type="number"
                      value={formOverageRate || ''}
                      onChange={(e) => setFormOverageRate(parseFloat(e.target.value) || null)}
                      placeholder="175"
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {formPricingModel === 'fixed' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Turnaround Timeline (weeks)
                  </label>
                  <input
                    type="number"
                    value={formTurnaroundWeeks || ''}
                    onChange={(e) => setFormTurnaroundWeeks(parseInt(e.target.value) || undefined)}
                    placeholder="8"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Included Features (1 per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`1 Staff Systems Architect\n2 Senior Full-Stack Developers\nDaily async standups in Slack Connect\nAutomated staging & production CI/CD`}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Concrete Deliverables (1 per line)
                </label>
                <textarea
                  rows={2}
                  placeholder={`Bi-weekly deployed feature increments\nFull OpenAPI and Architecture Decision Records\nAutomated E2E test coverage suite`}
                  value={formDeliverables}
                  onChange={(e) => setFormDeliverables(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    SLA Tier
                  </label>
                  <select
                    value={formSlaTier}
                    onChange={(e) => setFormSlaTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Standard 24h SLA">Standard 24h SLA</option>
                    <option value="Priority 4h SLA">Priority 4h SLA</option>
                    <option value="Enterprise 1h Mission-Critical">Enterprise 1h Mission-Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Ideal Client Profile
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Series A fintech teams scaling to $5M ARR"
                    value={formIdealFor}
                    onChange={(e) => setFormIdealFor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition-colors"
                >
                  Save & Publish Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
