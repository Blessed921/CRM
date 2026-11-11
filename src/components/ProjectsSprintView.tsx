import React, { useState } from 'react';
import { Client, SprintMilestone } from '../types/crm';
import { 
  GitBranch, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProjectsSprintViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onUpdateMilestone: (clientId: string, milestoneId: string, updates: Partial<SprintMilestone>) => void;
  onAddMilestone: (clientId: string, milestone: Omit<SprintMilestone, 'id'>) => void;
}

export const ProjectsSprintView: React.FC<ProjectsSprintViewProps> = ({
  clients,
  onSelectClient,
  onUpdateMilestone,
  onAddMilestone,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddingForClientId, setIsAddingForClientId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-12-15');
  const [newEngineer, setNewEngineer] = useState('Senior Fullstack Engineer');

  // Flatten milestones with their parent client info
  const allMilestones = clients.flatMap((client) =>
    client.milestones.map((milestone) => ({
      ...milestone,
      clientId: client.id,
      clientName: client.name,
      clientLogo: client.logoText,
      clientModel: client.engagementModel,
    }))
  );

  const filteredMilestones = allMilestones.filter((m) => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddingForClientId || !newTitle.trim()) return;

    onAddMilestone(isAddingForClientId, {
      title: newTitle.trim(),
      status: 'planning',
      dueDate: newDueDate,
      completionPercentage: 0,
      leadEngineer: newEngineer,
      deliverablesCount: 3,
    });

    setNewTitle('');
    setIsAddingForClientId(null);
  };

  const getStatusBadge = (status: SprintMilestone['status']) => {
    switch (status) {
      case 'in-progress':
        return (
          <span className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            <span>In Development</span>
          </span>
        );
      case 'review':
        return (
          <span className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Client QA & Review</span>
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Shipped to Prod</span>
          </span>
        );
      case 'planning':
        return (
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            <span>Scoping & Planning</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>Agency Engineering Sprints & Deliverables</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active engineering milestones, progress tracking, and squad allocation across client projects.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Sprints ({allMilestones.length})
              </button>
              <button
                onClick={() => setStatusFilter('in-progress')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'in-progress' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In Dev
              </button>
              <button
                onClick={() => setStatusFilter('review')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'review' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In Review
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  statusFilter === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Shipped
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Milestone Quick Inline Form */}
      {isAddingForClientId && (
        <form
          onSubmit={handleCreateMilestone}
          className="bg-slate-900 border border-indigo-500/40 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300">
              Add New Milestone for {clients.find((c) => c.id === isAddingForClientId)?.name}
            </span>
            <button
              type="button"
              onClick={() => setIsAddingForClientId(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Milestone Deliverable Title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Lead Engineer (e.g. Marcus Holt)"
              value={newEngineer}
              onChange={(e) => setNewEngineer(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded"
            >
              Create Milestone
            </button>
          </div>
        </form>
      )}

      {/* Milestone List */}
      <div className="space-y-3">
        {filteredMilestones.map((m) => {
          const client = clients.find((c) => c.id === m.clientId)!;
          return (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Client & Title */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 shrink-0 mt-0.5">
                    {m.clientLogo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectClient(client)}
                        className="text-xs text-slate-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        {m.clientName}
                      </button>
                      <span className="text-slate-600">/</span>
                      <span className="text-xs font-semibold text-slate-100">{m.title}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>Lead: {m.leadEngineer}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Target: {m.dueDate}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{m.deliverablesCount} key deliverables</span>
                    </div>
                  </div>
                </div>

                {/* Right: Progress bar & status actions */}
                <div className="flex items-center gap-6 shrink-0">
                  {/* Progress Slider / Meter */}
                  <div className="w-44 space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Completion</span>
                      <span className="text-slate-200 tabular-nums">{m.completionPercentage}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          m.completionPercentage === 100
                            ? 'bg-emerald-500'
                            : m.completionPercentage > 60
                            ? 'bg-indigo-500'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${m.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="shrink-0">
                    <select
                      value={m.status}
                      onChange={(e) =>
                        onUpdateMilestone(m.clientId, m.id, {
                          status: e.target.value as SprintMilestone['status'],
                          completionPercentage:
                            e.target.value === 'completed'
                              ? 100
                              : m.status === 'completed'
                              ? 90
                              : m.completionPercentage,
                        })
                      }
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="planning">Scoping / Plan</option>
                      <option value="in-progress">In Development</option>
                      <option value="review">Client Review</option>
                      <option value="completed">Shipped / Complete</option>
                    </select>
                  </div>

                  {/* Percentage Adjust Quick Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onUpdateMilestone(m.clientId, m.id, {
                          completionPercentage: Math.max(0, m.completionPercentage - 10),
                        })
                      }
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-mono"
                      title="Decrease 10%"
                    >
                      -
                    </button>
                    <button
                      onClick={() => {
                        const newPercent = Math.min(100, m.completionPercentage + 10);
                        onUpdateMilestone(m.clientId, m.id, {
                          completionPercentage: newPercent,
                          status: newPercent === 100 ? 'completed' : m.status,
                        });
                      }}
                      className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-mono"
                      title="Increase 10%"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Milestone Footer per Client */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="text-xs font-medium text-slate-300 mb-2">
          Schedule New Sprint Milestone for Client:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setIsAddingForClientId(c.id)}
              className="px-2.5 py-1 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3 h-3 text-indigo-400" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
