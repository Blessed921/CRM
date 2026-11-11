import React, { useState } from 'react';
import { Client, OnboardingStageId, OnboardingStageState } from '../types/crm';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Users, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  Check, 
  ExternalLink,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface OnboardingWorkflowViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onUpdateStage: (clientId: string, stageId: OnboardingStageId) => void;
  onToggleTask: (clientId: string, stageId: OnboardingStageId, taskId: string) => void;
}

export const OnboardingWorkflowView: React.FC<OnboardingWorkflowViewProps> = ({
  clients,
  onSelectClient,
  onUpdateStage,
  onToggleTask,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients.find((c) => c.health === 'onboarding')?.id || clients[0]?.id || ''
  );
  const [activeStageTab, setActiveStageTab] = useState<OnboardingStageId>('needs-assessment');
  const [showRaciMatrix, setShowRaciMatrix] = useState(false);

  const activeClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const stagesMeta: {
    id: OnboardingStageId;
    name: string;
    responsibleRole: string;
    leadAssignee: string;
    coreInfo: string;
  }[] = [
    {
      id: 'initial-contact',
      name: '1. Initial Contact',
      responsibleRole: 'Account Executive / Growth Lead',
      leadAssignee: 'Sarah Jenkins',
      coreInfo: 'Referral source, budget range, target launch date, primary contact & M-NDA.',
    },
    {
      id: 'needs-assessment',
      name: '2. Needs Assessment',
      responsibleRole: 'Solutions Architect / Tech Lead',
      leadAssignee: 'Marcus Holt',
      coreInfo: 'Architecture blueprint, tech stack validation, third-party APIs, compliance.',
    },
    {
      id: 'proposal-solution',
      name: '3. Proposal & SOW',
      responsibleRole: 'Managing Director / Architect',
      leadAssignee: 'Elena Rostova',
      coreInfo: 'Service package selection, squad composition, deliverables timetable, pricing terms.',
    },
    {
      id: 'contract-signing',
      name: '4. Contract Signing',
      responsibleRole: 'Legal Counsel / Managing Director',
      leadAssignee: 'David Vance',
      coreInfo: 'DocuSign MSA execution, IP assignment exhibits, initial retainer deposit.',
    },
    {
      id: 'kickoff-handover',
      name: '5. Kickoff & Handover',
      responsibleRole: 'Delivery Lead / Project Manager',
      leadAssignee: 'Alex Thorne',
      coreInfo: 'Access Vault credential testing, PM tool board sync, Sprint 0 backlog grooming.',
    },
  ];

  const getStageState = (stageId: OnboardingStageId): OnboardingStageState | undefined => {
    return activeClient?.onboardingStages?.find((s) => s.stageId === stageId);
  };

  const getStageTasks = (stageId: OnboardingStageId) => {
    return getStageState(stageId)?.tasks || [];
  };

  const getStageArtifacts = (stageId: OnboardingStageId) => {
    return getStageState(stageId)?.collectedArtifacts || [];
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Workflow Definition Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Standardized Agency Client Onboarding Lifecycle</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Stage-gate protocol guiding clients from initial inbound qualification to technical architecture scoping, legal execution, and Sprint 0 engineering handover.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowRaciMatrix(!showRaciMatrix)}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
            >
              {showRaciMatrix ? 'Hide RACI Responsibility Matrix' : 'View Agency RACI Matrix'}
            </button>
          </div>
        </div>
      </div>

      {/* RACI Matrix Collapsible Section */}
      {showRaciMatrix && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Agency Onboarding RACI Matrix (Roles & Responsibilities)</span>
            </div>
            <span className="text-[11px] text-slate-400">
              R = Responsible (Doer), A = Accountable (Approver), C = Consulted (Input), I = Informed (Kept updated)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] font-mono uppercase">
                  <th className="py-2.5 px-3">Stage & Workflow Goal</th>
                  <th className="py-2.5 px-3 text-center">Account Executive</th>
                  <th className="py-2.5 px-3 text-center">Solutions Architect</th>
                  <th className="py-2.5 px-3 text-center">Managing Director</th>
                  <th className="py-2.5 px-3 text-center">Delivery Lead / PM</th>
                  <th className="py-2.5 px-3 text-center">DevOps & Security</th>
                  <th className="py-2.5 px-3">Primary Output Artifact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">1. Initial Contact & Fit</td>
                  <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">R / A</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">Executed Mutual NDA + Inbound Brief</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">2. Needs Assessment & Scoping</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">R / A</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">System Architecture Blueprint + Sizing</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">3. Proposal & Solution Design</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">R / A</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">Statement of Work (SOW) & Package Deck</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">4. Contract Signing & Legal</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">R / A</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">Signed MSA + Paid Retainer Deposit</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-medium text-slate-200">5. Project Kickoff & Handover</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">C</td>
                  <td className="py-2.5 px-3 text-center text-slate-400">I</td>
                  <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">R / A</td>
                  <td className="py-2.5 px-3 text-center text-indigo-300 font-bold">R</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">Access Vault Tested + Sprint 0 Backlog</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Selector Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Active Client Pipeline:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {clients.map((c) => {
              const isSelected = c.id === activeClient.id;
              const isCompleted = c.currentOnboardingStage === 'completed';
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{c.logoText}</span>
                  <span>{c.name}</span>
                  {c.health === 'onboarding' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeClient && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Stage:</span>
            <span className="font-semibold text-indigo-300 uppercase font-mono text-[11px] bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
              {activeClient.currentOnboardingStage.replace('-', ' ')}
            </span>
            <button
              onClick={() => onSelectClient(activeClient)}
              className="text-xs text-slate-400 hover:text-white underline ml-1"
            >
              Open Dossier →
            </button>
          </div>
        )}
      </div>

      {/* 5-Stage Stepper Progression Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stagesMeta.map((s, idx) => {
          const stageState = getStageState(s.id);
          const isCurrent = activeClient.currentOnboardingStage === s.id;
          const isDone = stageState?.status === 'completed';
          const isTabActive = activeStageTab === s.id;

          return (
            <div
              key={s.id}
              onClick={() => setActiveStageTab(s.id)}
              className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                isTabActive
                  ? 'bg-slate-850 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Step 0{idx + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="text-[10px] font-medium text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                    Active
                  </span>
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="font-semibold text-slate-100 truncate">{s.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">{s.responsibleRole}</div>

              {/* Progress mini indicator */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span>
                  {stageState?.tasks.filter((t) => t.isCompleted).length || 0}/
                  {stageState?.tasks.length || 0} tasks
                </span>
                {isDone ? (
                  <span className="text-emerald-400 font-medium">Passed</span>
                ) : (
                  <span>Pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Stage Deep-Dive Tasks & Collected Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
              Stage Inspection & Deliverables Checklist
            </div>
            <h3 className="text-base font-bold text-white font-display mt-0.5">
              {stagesMeta.find((s) => s.id === activeStageTab)?.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {stagesMeta.find((s) => s.id === activeStageTab)?.coreInfo}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[11px]">Stage Lead Responsible</span>
              <span className="text-slate-200 font-medium">
                {stagesMeta.find((s) => s.id === activeStageTab)?.leadAssignee} ({stagesMeta.find((s) => s.id === activeStageTab)?.responsibleRole.split(' ')[0]})
              </span>
            </div>
            {activeClient.currentOnboardingStage !== activeStageTab && (
              <button
                onClick={() => onUpdateStage(activeClient.id, activeStageTab)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Set Active Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Task Grid & Collected Data Matrix */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
            <span>Stage Action Checklist & Data Capture Points</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Click checkbox to mark task completed and record timestamp
            </span>
          </div>

          <div className="space-y-2">
            {getStageTasks(activeStageTab).map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(activeClient.id, activeStageTab, task.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                  task.isCompleted
                    ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/30'
                    : 'bg-amber-950/10 border-amber-800/30 hover:bg-amber-950/20'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-amber-400/80" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        task.isCompleted ? 'text-slate-200 line-through opacity-80' : 'text-slate-100'
                      }`}
                    >
                      {task.label}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      <span className="text-slate-500 font-medium font-mono">Data Collected: </span>
                      <span className="text-slate-300">{task.informationCollected}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-medium text-indigo-300">
                    {task.responsibleAssignee}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {task.responsibleRole}
                  </div>
                  {task.completedAt && (
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      Completed {task.completedAt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collected Artifacts & Deliverables for this Stage */}
        <div className="pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Stage Gate Verified Deliverables & Artifacts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getStageArtifacts(activeStageTab).map((art, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-3 text-xs"
              >
                <div className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{art.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{art.description}</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">Verified on {art.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
