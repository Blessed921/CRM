import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Client, 
  ActivityLog, 
  SprintMilestone, 
  ServicePackage, 
  PMIntegrationConfig, 
  OnboardingStageId 
} from '../types/crm';
import { INITIAL_CLIENTS } from '../data/mockClients';
import { INITIAL_SERVICE_PACKAGES } from '../data/mockPackages';
import { INITIAL_PM_INTEGRATIONS } from '../data/mockIntegrations';

interface CrmContextType {
  clients: Client[];
  activeClientId: string | null;
  setActiveClientId: (id: string | null) => void;
  selectedClient: Client | null;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  toggleAccessItem: (clientId: string, accessItemId: string) => void;
  addActivityLog: (clientId: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  updateMilestone: (clientId: string, milestoneId: string, updates: Partial<SprintMilestone>) => void;
  addMilestone: (clientId: string, milestone: Omit<SprintMilestone, 'id'>) => void;
  
  // Onboarding Workflow actions
  updateClientOnboardingStage: (clientId: string, stageId: OnboardingStageId) => void;
  toggleOnboardingTask: (clientId: string, stageId: OnboardingStageId, taskId: string) => void;

  // Service Packages actions
  packages: ServicePackage[];
  addPackage: (pkg: ServicePackage) => void;
  updatePackage: (id: string, updates: Partial<ServicePackage>) => void;
  deletePackage: (id: string) => void;
  assignPackageToClient: (clientId: string, packageId: string) => void;

  // PM Tool Integrations actions
  integrations: PMIntegrationConfig[];
  triggerManualSync: (integrationId: string) => void;
  toggleFieldSync: (integrationId: string, fieldId: string) => void;
  toggleIntegrationConnection: (integrationId: string) => void;

  resetToDefaults: () => void;
}

const STORAGE_CLIENTS_KEY = 'devagency_crm_clients_v2';
const STORAGE_PACKAGES_KEY = 'devagency_crm_packages_v2';
const STORAGE_INTEGRATIONS_KEY = 'devagency_crm_integrations_v2';

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CLIENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage for CRM clients', e);
    }
    return INITIAL_CLIENTS;
  });

  const [packages, setPackages] = useState<ServicePackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PACKAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage for CRM packages', e);
    }
    return INITIAL_SERVICE_PACKAGES;
  });

  const [integrations, setIntegrations] = useState<PMIntegrationConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INTEGRATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage for CRM integrations', e);
    }
    return INITIAL_PM_INTEGRATIONS;
  });

  const [activeClientId, setActiveClientId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(clients));
    } catch (e) {
      console.error('Error saving clients to localStorage', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PACKAGES_KEY, JSON.stringify(packages));
    } catch (e) {
      console.error('Error saving packages to localStorage', e);
    }
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INTEGRATIONS_KEY, JSON.stringify(integrations));
    } catch (e) {
      console.error('Error saving integrations to localStorage', e);
    }
  }, [integrations]);

  const selectedClient = clients.find((c) => c.id === activeClientId) || null;

  const addClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
    setActiveClientId(newClient.id);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (activeClientId === id) {
      setActiveClientId(null);
    }
  };

  const toggleAccessItem = (clientId: string, accessItemId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const updatedChecklist = c.accessChecklist.map((item) =>
          item.id === accessItemId
            ? { ...item, isGranted: !item.isGranted, updatedAt: new Date().toLocaleDateString() }
            : item
        );
        return { ...c, accessChecklist: updatedChecklist };
      })
    );
  };

  const addActivityLog = (clientId: string, logData: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
    };
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          activityLogs: [newLog, ...c.activityLogs],
        };
      })
    );
  };

  const updateMilestone = (clientId: string, milestoneId: string, updates: Partial<SprintMilestone>) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          milestones: c.milestones.map((m) =>
            m.id === milestoneId ? { ...m, ...updates } : m
          ),
        };
      })
    );
  };

  const addMilestone = (clientId: string, milestoneData: Omit<SprintMilestone, 'id'>) => {
    const newMilestone: SprintMilestone = {
      ...milestoneData,
      id: `m-${Date.now()}`,
    };
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          milestones: [...c.milestones, newMilestone],
        };
      })
    );
  };

  // Onboarding Workflow Methods
  const updateClientOnboardingStage = (clientId: string, stageId: OnboardingStageId) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const stages = c.onboardingStages || [];
        const stageIndex = stages.findIndex((s) => s.stageId === stageId);

        const updatedStages = stages.map((s, idx) => {
          if (idx < stageIndex) return { ...s, status: 'completed' as const };
          if (idx === stageIndex) return { ...s, status: 'in-progress' as const };
          return { ...s, status: 'pending' as const };
        });

        const newHealth = stageId === 'completed' ? 'healthy' : 'onboarding';

        return {
          ...c,
          currentOnboardingStage: stageId,
          health: c.health === 'onboarding' ? newHealth : c.health,
          onboardingStages: updatedStages,
        };
      })
    );
  };

  const toggleOnboardingTask = (clientId: string, stageId: OnboardingStageId, taskId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const updatedStages = (c.onboardingStages || []).map((stage) => {
          if (stage.stageId !== stageId) return stage;
          const updatedTasks = stage.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  isCompleted: !task.isCompleted,
                  completedAt: !task.isCompleted ? new Date().toISOString().split('T')[0] : undefined,
                }
              : task
          );
          const allCompleted = updatedTasks.every((t) => t.isCompleted);
          return {
            ...stage,
            status: allCompleted ? ('completed' as const) : ('in-progress' as const),
            tasks: updatedTasks,
          };
        });

        return { ...c, onboardingStages: updatedStages };
      })
    );
  };

  // Service Package Methods
  const addPackage = (pkg: ServicePackage) => {
    setPackages((prev) => [pkg, ...prev]);
  };

  const updatePackage = (id: string, updates: Partial<ServicePackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const assignPackageToClient = (clientId: string, packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;

    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          packageId: pkg.id,
          packageName: pkg.name,
          monthlyRetainer: pkg.pricingModel === 'retainer' ? pkg.basePrice : c.monthlyRetainer,
          hourlyRate: pkg.overageRate || pkg.basePrice || c.hourlyRate,
          hoursMonthlyCap: pkg.hoursIncluded || c.hoursMonthlyCap,
          engagementModel:
            pkg.pricingModel === 'retainer'
              ? 'dedicated-squad'
              : pkg.pricingModel === 'fixed'
              ? 'fixed-milestone'
              : 'time-and-materials',
        };
      })
    );

    // Update assigned count in packages
    setPackages((prev) =>
      prev.map((p) => {
        const count = clients.filter((c) => c.packageId === p.id || (c.id === clientId && p.id === packageId)).length;
        return { ...p, assignedClientsCount: count };
      })
    );
  };

  // PM Tool Integrations Methods
  const triggerManualSync = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId
          ? {
              ...int,
              status: 'syncing',
              lastSyncTimestamp: 'Syncing in background...',
            }
          : int
      )
    );

    // Simulate completion after 800ms
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integrationId
            ? {
                ...int,
                status: 'connected',
                lastSyncTimestamp: 'Just now',
              }
            : int
        )
      );

      // Add activity log to relevant clients
      clients.forEach((c) => {
        if (c.pmSync?.tool === integrations.find((i) => i.id === integrationId)?.tool) {
          addActivityLog(c.id, {
            type: 'sync',
            title: `Bi-directional PM Sync: ${integrations.find((i) => i.id === integrationId)?.name}`,
            description: 'Synchronized latest sprint tickets, assignees, and release dates.',
            author: 'Sync Worker',
          });
        }
      });
    }, 800);
  };

  const toggleFieldSync = (integrationId: string, fieldId: string) => {
    setIntegrations((prev) =>
      prev.map((int) => {
        if (int.id !== integrationId) return int;
        return {
          ...int,
          fields: int.fields.map((f) =>
            f.id === fieldId ? { ...f, isActive: !f.isActive } : f
          ),
        };
      })
    );
  };

  const toggleIntegrationConnection = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((int) => {
        if (int.id !== integrationId) return int;
        const newStatus = int.status === 'connected' ? 'disconnected' : 'connected';
        return {
          ...int,
          status: newStatus,
          lastSyncTimestamp: newStatus === 'connected' ? 'Just now' : 'Disconnected',
        };
      })
    );
  };

  const resetToDefaults = () => {
    setClients(INITIAL_CLIENTS);
    setPackages(INITIAL_SERVICE_PACKAGES);
    setIntegrations(INITIAL_PM_INTEGRATIONS);
    localStorage.removeItem(STORAGE_CLIENTS_KEY);
    localStorage.removeItem(STORAGE_PACKAGES_KEY);
    localStorage.removeItem(STORAGE_INTEGRATIONS_KEY);
    setActiveClientId(null);
  };

  return (
    <CrmContext.Provider
      value={{
        clients,
        activeClientId,
        setActiveClientId,
        selectedClient,
        addClient,
        updateClient,
        deleteClient,
        toggleAccessItem,
        addActivityLog,
        updateMilestone,
        addMilestone,
        updateClientOnboardingStage,
        toggleOnboardingTask,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        assignPackageToClient,
        integrations,
        triggerManualSync,
        toggleFieldSync,
        toggleIntegrationConnection,
        resetToDefaults,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
