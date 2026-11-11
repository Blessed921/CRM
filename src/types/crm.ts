export type ClientHealth = 'healthy' | 'attention' | 'at-risk' | 'onboarding';

export type EngagementModel = 'dedicated-squad' | 'time-and-materials' | 'fixed-milestone' | 'sla-maintenance';

export type ClientStage = 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Enterprise' | 'Bootstrapped';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  slack?: string;
  isPrimary: boolean;
}

export interface TechStackConfig {
  frontend: string[];
  backend: string[];
  database: string[];
  cloud: string[];
  cicd: string[];
  integrations: string[];
}

export interface EnvironmentUrls {
  production?: string;
  staging?: string;
  devPreview?: string;
  repositoryUrl?: string;
  figmaUrl?: string;
  documentationUrl?: string;
}

export interface AccessItem {
  id: string;
  category: 'legal' | 'code' | 'cloud' | 'data' | 'communication' | 'billing';
  label: string;
  isGranted: boolean;
  notes?: string;
  updatedAt?: string;
}

export interface SprintMilestone {
  id: string;
  title: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  completionPercentage: number;
  leadEngineer: string;
  deliverablesCount: number;
}

export interface ActivityLog {
  id: string;
  type: 'meeting' | 'deployment' | 'contract' | 'architecture' | 'alert' | 'onboarding' | 'sync';
  title: string;
  description: string;
  timestamp: string;
  author: string;
}

// ----------------------------------------------------
// Standardized Onboarding Workflow Types
// ----------------------------------------------------
export type OnboardingStageId =
  | 'initial-contact'
  | 'needs-assessment'
  | 'proposal-solution'
  | 'contract-signing'
  | 'kickoff-handover'
  | 'completed';

export interface OnboardingTask {
  id: string;
  label: string;
  responsibleRole: string; // e.g., "Account Executive", "Solutions Architect", "Managing Director", "Delivery Lead"
  responsibleAssignee: string;
  informationCollected: string; // specific data collected at this task
  isCompleted: boolean;
  completedAt?: string;
}

export interface OnboardingStageState {
  stageId: OnboardingStageId;
  stageName: string;
  ownerRole: string;
  ownerName: string;
  status: 'pending' | 'in-progress' | 'completed';
  targetDays: number;
  tasks: OnboardingTask[];
  collectedArtifacts: {
    title: string;
    description: string;
    date: string;
    category: 'brief' | 'architecture' | 'legal' | 'estimate' | 'backlog';
  }[];
}

// ----------------------------------------------------
// Project Management Tool Integration Types
// ----------------------------------------------------
export type PMToolType = 'jira' | 'linear' | 'asana' | 'trello';

export type PMSyncStatus = 'connected' | 'syncing' | 'error' | 'disconnected';

export interface PMSyncedField {
  id: string;
  crmField: string;
  externalField: string;
  direction: 'two-way' | 'crm-to-tool' | 'tool-to-crm';
  entity: 'Client Info' | 'Project Status' | 'Task Assignments' | 'Sprint Deadlines';
  description: string;
  isActive: boolean;
}

export interface PMIntegrationConfig {
  id: string;
  tool: PMToolType;
  name: string;
  iconName: string;
  status: PMSyncStatus;
  lastSyncTimestamp: string;
  externalWorkspaceName: string;
  externalWorkspaceUrl: string;
  syncedProjectsCount: number;
  webhookUrl: string;
  apiTokenMasked: string;
  syncFrequency: 'real-time' | 'every-15m' | 'hourly' | 'daily';
  fields: PMSyncedField[];
}

export interface ClientPMSyncInfo {
  tool: PMToolType;
  projectKey: string;
  projectName: string;
  externalUrl: string;
  lastSyncedAt: string;
  syncHealth: 'healthy' | 'warning' | 'synced';
  activeTicketsCount: number;
  completedTicketsCount: number;
  leadAssignee: string;
}

// ----------------------------------------------------
// Customizable Service Packages Types
// ----------------------------------------------------
export type PackagePricingModel = 'fixed' | 'hourly' | 'retainer';

export interface ServicePackage {
  id: string;
  name: string;
  category: 'Full-Stack Squad' | 'Specialized MVP' | 'Advisory & Architecture' | 'DevOps & Reliability' | 'Mobile Engineering';
  tagline: string;
  description: string;
  pricingModel: PackagePricingModel;
  basePrice: number; // in USD
  billingCadence: string; // e.g. "/ month", "flat milestone", "/ hour"
  hoursIncluded: number | null;
  overageRate: number | null; // $/hr when exceeding
  turnaroundWeeks?: number;
  includedFeatures: string[];
  deliverables: string[];
  idealFor: string;
  slaTier: 'Standard 24h SLA' | 'Priority 4h SLA' | 'Enterprise 1h Mission-Critical';
  assignedClientsCount?: number;
}

// ----------------------------------------------------
// Main Client Model
// ----------------------------------------------------
export interface Client {
  id: string;
  name: string;
  logoText: string;
  industry: string;
  stage: ClientStage;
  timezone: string;
  health: ClientHealth;
  engagementModel: EngagementModel;
  monthlyRetainer: number; // in USD
  hourlyRate?: number;
  hoursLoggedMonth: number;
  hoursMonthlyCap: number;
  contractStartDate: string;
  contractRenewalDate: string;
  primaryDomain: string;
  compliance: string[];
  stakeholders: Stakeholder[];
  techStack: TechStackConfig;
  environments: EnvironmentUrls;
  accessChecklist: AccessItem[];
  milestones: SprintMilestone[];
  activityLogs: ActivityLog[];
  assignedTeam: {
    role: string;
    name: string;
    avatarInitials: string;
  }[];
  // New: Associated package
  packageId?: string;
  packageName?: string;
  // New: Onboarding workflow state
  currentOnboardingStage: OnboardingStageId;
  onboardingStages: OnboardingStageState[];
  // New: PM Tool Sync metadata
  pmSync?: ClientPMSyncInfo;
}

export type ViewTab =
  | 'clients'
  | 'onboarding'
  | 'packages'
  | 'integrations'
  | 'tech-matrix'
  | 'sprints'
  | 'retainers'
  | 'analytics';
