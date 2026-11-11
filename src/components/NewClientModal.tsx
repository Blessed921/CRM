import React, { useState } from 'react';
import { Client, ClientHealth, ClientStage, EngagementModel, AccessItem } from '../types/crm';
import { X, Check, ArrowRight, ArrowLeft, Building2, Server, CircleDollarSign } from 'lucide-react';
import { createDefaultOnboardingStages } from '../data/onboardingStagesTemplate';
import { INITIAL_SERVICE_PACKAGES } from '../data/mockPackages';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Company Profile
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [industry, setIndustry] = useState('FinTech & SaaS');
  const [stage, setStage] = useState<ClientStage>('Series A');
  const [timezone, setTimezone] = useState('UTC-5 (New York)');

  // Step 2: Tech Setup
  const [frontend, setFrontend] = useState('Next.js 15, TypeScript, Tailwind CSS');
  const [backend, setBackend] = useState('Node.js (NestJS), PostgreSQL');
  const [database, setDatabase] = useState('PostgreSQL, Redis');
  const [cloud, setCloud] = useState('AWS (EKS, us-east-1)');
  const [repoUrl, setRepoUrl] = useState('');
  const [stagingUrl, setStagingUrl] = useState('');
  const [compliance, setCompliance] = useState('SOC2 Type II');

  // Step 3: Contract & Stakeholder
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-squad-enterprise');
  const [model, setModel] = useState<EngagementModel>('dedicated-squad');
  const [retainer, setRetainer] = useState<number>(28500);
  const [hourlyRate, setHourlyRate] = useState<number>(175);
  const [hoursCap, setHoursCap] = useState<number>(160);
  const [stakeholderName, setStakeholderName] = useState('');
  const [stakeholderRole, setStakeholderRole] = useState('VP of Engineering');
  const [stakeholderEmail, setStakeholderEmail] = useState('');
  const [stakeholderSlack, setStakeholderSlack] = useState('');

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    const pkg = INITIAL_SERVICE_PACKAGES.find((p) => p.id === pkgId);
    if (pkg) {
      if (pkg.pricingModel === 'retainer') {
        setModel('dedicated-squad');
        setRetainer(pkg.basePrice);
        setHoursCap(pkg.hoursIncluded || 160);
        setHourlyRate(pkg.overageRate || 175);
      } else if (pkg.pricingModel === 'fixed') {
        setModel('fixed-milestone');
        setRetainer(pkg.basePrice);
        setHoursCap(80);
        setHourlyRate(185);
      } else {
        setModel('time-and-materials');
        setRetainer(12000);
        setHourlyRate(pkg.basePrice);
        setHoursCap(pkg.hoursIncluded || 80);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    // Generate initials for logo text
    const initials = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CL';

    const defaultAccessChecklist: AccessItem[] = [
      { id: `acc-init-1-${Date.now()}`, category: 'legal', label: 'Mutual NDA Signed', isGranted: true },
      { id: `acc-init-2-${Date.now()}`, category: 'legal', label: 'Master Services Agreement (MSA)', isGranted: true },
      { id: `acc-init-3-${Date.now()}`, category: 'code', label: 'GitHub / GitLab Org Access', isGranted: false, notes: 'Pending client IT invite' },
      { id: `acc-init-4-${Date.now()}`, category: 'cloud', label: 'Cloud IAM / Staging Access', isGranted: false },
      { id: `acc-init-5-${Date.now()}`, category: 'data', label: 'Database Credentials & Seed Data', isGranted: false },
      { id: `acc-init-6-${Date.now()}`, category: 'communication', label: 'Slack Connect Channel Created', isGranted: true },
      { id: `acc-init-7-${Date.now()}`, category: 'billing', label: 'Retainer Deposit / ACH On File', isGranted: true },
    ];

    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      logoText: initials,
      industry: industry.trim(),
      stage,
      timezone,
      health: 'onboarding',
      engagementModel: model,
      monthlyRetainer: Number(retainer) || 20000,
      hourlyRate: Number(hourlyRate) || 175,
      hoursLoggedMonth: 0,
      hoursMonthlyCap: Number(hoursCap) || 140,
      contractStartDate: new Date().toISOString().split('T')[0],
      contractRenewalDate: '2027-11-01',
      primaryDomain: domain.trim().replace(/^https?:\/\//, ''),
      compliance: compliance ? compliance.split(',').map((c) => c.trim()) : [],
      packageId: selectedPackageId,
      packageName: INITIAL_SERVICE_PACKAGES.find((p) => p.id === selectedPackageId)?.name || 'Custom Package',
      currentOnboardingStage: 'initial-contact',
      onboardingStages: createDefaultOnboardingStages(name.trim(), stakeholderName.trim()),
      pmSync: {
        tool: 'jira',
        projectKey: initials,
        projectName: `${name.trim()} Core Engine`,
        externalUrl: 'https://agency-squads.atlassian.net',
        lastSyncedAt: 'Just provisioned',
        syncHealth: 'synced',
        activeTicketsCount: 3,
        completedTicketsCount: 0,
        leadAssignee: 'Marcus Holt',
      },
      stakeholders: [
        {
          id: `stk-${Date.now()}`,
          name: stakeholderName.trim() || 'Client Lead',
          role: stakeholderRole.trim() || 'Product Lead',
          email: stakeholderEmail.trim() || `contact@${domain.trim()}`,
          slack: stakeholderSlack.trim() || undefined,
          isPrimary: true,
        },
      ],
      techStack: {
        frontend: frontend.split(',').map((s) => s.trim()),
        backend: backend.split(',').map((s) => s.trim()),
        database: database.split(',').map((s) => s.trim()),
        cloud: cloud.split(',').map((s) => s.trim()),
        cicd: ['GitHub Actions', 'Docker'],
        integrations: ['Sentry', 'Stripe'],
      },
      environments: {
        production: `https://${domain.trim()}`,
        staging: stagingUrl.trim() || `https://staging.${domain.trim()}`,
        repositoryUrl: repoUrl.trim() || undefined,
      },
      accessChecklist: defaultAccessChecklist,
      milestones: [
        {
          id: `m-init-${Date.now()}`,
          title: 'Architecture Review & Environment Bring-up',
          status: 'in-progress',
          dueDate: '2026-11-30',
          completionPercentage: 20,
          leadEngineer: 'Agency Tech Lead',
          deliverablesCount: 3,
        },
      ],
      activityLogs: [
        {
          id: `act-init-${Date.now()}`,
          type: 'contract',
          title: 'Client Account Onboarded',
          description: 'Client onboarded to DevAgency CRM. Automated setup checklist initialized.',
          timestamp: 'Just now',
          author: 'System',
        },
      ],
      assignedTeam: [
        { role: 'Agency Tech Lead', name: 'Marcus Holt', avatarInitials: 'MH' },
        { role: 'Senior Engineer', name: 'Ananya Roy', avatarInitials: 'AR' },
      ],
    };

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Onboard New Agency Client
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {step} of 3: {step === 1 ? 'Company Profile' : step === 2 ? 'Technical Setup' : 'Contract & Team'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Progress */}
        <div className="px-5 pt-3 pb-1 border-b border-slate-800/60 bg-slate-950/30 flex items-center gap-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: COMPANY PROFILE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Building2 className="w-4 h-4" />
                <span>Client Business Information</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zenith Robotics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary Web Domain *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="zenithrobotics.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Industry Domain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HealthTech, FinTech"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Client Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ClientStage)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Pre-seed">Pre-seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Bootstrapped">Bootstrapped</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Client Timezone
                  </label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="e.g. UTC-5 (New York)"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TECH ARCHITECTURE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Server className="w-4 h-4" />
                <span>Technical Architecture & Environments</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Frontend Framework & Tech (comma-separated)
                </label>
                <input
                  type="text"
                  value={frontend}
                  onChange={(e) => setFrontend(e.target.value)}
                  placeholder="Next.js 15, TypeScript, Tailwind"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Backend & Database (comma-separated)
                </label>
                <input
                  type="text"
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                  placeholder="Go microservices, PostgreSQL, Redis"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cloud / Infrastructure
                  </label>
                  <input
                    type="text"
                    value={cloud}
                    onChange={(e) => setCloud(e.target.value)}
                    placeholder="AWS (EKS, us-east-1)"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Compliance Standards
                  </label>
                  <input
                    type="text"
                    value={compliance}
                    onChange={(e) => setCompliance(e.target.value)}
                    placeholder="SOC2, HIPAA, GDPR"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Staging Environment URL
                  </label>
                  <input
                    type="text"
                    value={stagingUrl}
                    onChange={(e) => setStagingUrl(e.target.value)}
                    placeholder="https://staging.domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Git Repository URL
                  </label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/org/repo"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONTRACT & STAKEHOLDER */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <CircleDollarSign className="w-4 h-4" />
                <span>Agency Engagement Terms & Key Contact</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Agency Service Package
                </label>
                <select
                  value={selectedPackageId}
                  onChange={(e) => handlePackageSelect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {INITIAL_SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ${pkg.basePrice.toLocaleString()} {pkg.billingCadence}
                    </option>
                  ))}
                  <option value="custom">Custom Bespoke Scope</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Engagement Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as EngagementModel)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="dedicated-squad">Dedicated Engineering Squad</option>
                  <option value="time-and-materials">Time & Materials (T&M)</option>
                  <option value="fixed-milestone">Fixed Milestone Contract</option>
                  <option value="sla-maintenance">24/7 SLA & Maintenance</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-sans">
                    Monthly Retainer ($)
                  </label>
                  <input
                    type="number"
                    value={retainer}
                    onChange={(e) => setRetainer(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-sans">
                    Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 font-sans">
                    Monthly Hours Cap
                  </label>
                  <input
                    type="number"
                    value={hoursCap}
                    onChange={(e) => setHoursCap(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="text-xs font-medium text-slate-300">
                  Primary Client Contact
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Contact Name (e.g. Alex Mercer)"
                    value={stakeholderName}
                    onChange={(e) => setStakeholderName(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. VP Engineering)"
                    value={stakeholderRole}
                    onChange={(e) => setStakeholderRole(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={stakeholderEmail}
                    onChange={(e) => setStakeholderEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Slack handle (e.g. @alex_zenith)"
                    value={stakeholderSlack}
                    onChange={(e) => setStakeholderSlack(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && (!name.trim() || !domain.trim())) {
                    alert('Please enter company name and primary domain');
                    return;
                  }
                  setStep((s) => (s + 1) as any);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded flex items-center gap-1.5 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Complete Client Setup</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
