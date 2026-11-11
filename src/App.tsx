/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { ViewTab, Client } from './types/crm';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MetricsOverview } from './components/MetricsOverview';
import { ClientsTable } from './components/ClientsTable';
import { OnboardingWorkflowView } from './components/OnboardingWorkflowView';
import { ServicePackagesView } from './components/ServicePackagesView';
import { PMIntegrationsView } from './components/PMIntegrationsView';
import { TechSetupMatrixView } from './components/TechSetupMatrixView';
import { ProjectsSprintView } from './components/ProjectsSprintView';
import { BillingRetainersView } from './components/BillingRetainersView';
import { AnalyticsPulseView } from './components/AnalyticsPulseView';
import { ClientDetailDrawer } from './components/ClientDetailDrawer';
import { NewClientModal } from './components/NewClientModal';
import { ExportBriefModal } from './components/ExportBriefModal';
import { ClientPortalView } from './components/ClientPortalView';

const CrmApp: React.FC = () => {
  const {
    clients,
    selectedClient,
    setActiveClientId,
    addClient,
    updateClient,
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
  } = useCrm();

  const [currentTab, setCurrentTab] = useState<ViewTab>('clients');
  const [viewMode, setViewMode] = useState<'admin' | 'portal'>('admin');
  const [portalClientId, setPortalClientId] = useState<string>(clients[0]?.id || 'c-aurapay');
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportClientTarget, setExportClientTarget] = useState<Client | null>(null);

  const onboardingCount = clients.filter(
    (c) => c.health === 'onboarding' || c.currentOnboardingStage !== 'completed'
  ).length;

  const handleOpenExportForClient = (client: Client) => {
    setExportClientTarget(client);
    setIsExportOpen(true);
  };

  const currentPortalClient = clients.find((c) => c.id === portalClientId) || clients[0];
  const currentPortalPackage = packages.find((p) => p.id === currentPortalClient?.packageId) ||
    packages.find((p) => p.name === currentPortalClient?.packageName);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation - only rendered in agency admin mode */}
      {viewMode === 'admin' && (
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          clientsCount={clients.length}
          onboardingCount={onboardingCount}
          packagesCount={packages.length}
        />
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === 'admin' ? 'portal' : 'admin')}
          onOpenNewClient={() => setIsNewClientOpen(true)}
          onOpenExportModal={() => {
            setExportClientTarget(null);
            setIsExportOpen(true);
          }}
          onResetData={resetToDefaults}
          clientsCount={clients.length}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {viewMode === 'portal' ? (
            /* CLIENT PORTAL VIEW */
            <ClientPortalView
              client={currentPortalClient}
              packageItem={currentPortalPackage}
              onSwitchToAdmin={() => setViewMode('admin')}
              onSelectDifferentClient={(id) => setPortalClientId(id)}
              allClients={clients}
            />
          ) : (
            /* AGENCY ADMIN CONSOLE */
            <div className="max-w-7xl mx-auto space-y-6">
              {/* KPI Overview Strip */}
              <MetricsOverview clients={clients} />

              {/* Tab 1: Client Directory */}
              {currentTab === 'clients' && (
                <ClientsTable
                  clients={clients}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                  onOpenNewClient={() => setIsNewClientOpen(true)}
                />
              )}

              {/* Tab 2: Standardized 5-Stage Onboarding Workflow */}
              {currentTab === 'onboarding' && (
                <OnboardingWorkflowView
                  clients={clients}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                  onUpdateStage={updateClientOnboardingStage}
                  onToggleTask={toggleOnboardingTask}
                />
              )}

              {/* Tab 3: Customizable Service Packages */}
              {currentTab === 'packages' && (
                <ServicePackagesView
                  packages={packages}
                  clients={clients}
                  onAddPackage={addPackage}
                  onUpdatePackage={updatePackage}
                  onDeletePackage={deletePackage}
                  onAssignPackage={assignPackageToClient}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                />
              )}

              {/* Tab 4: PM Tool Integrations Hub (Jira, Linear, Asana, Trello) */}
              {currentTab === 'integrations' && (
                <PMIntegrationsView
                  integrations={integrations}
                  clients={clients}
                  onTriggerSync={triggerManualSync}
                  onToggleField={toggleFieldSync}
                  onToggleConnection={toggleIntegrationConnection}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                />
              )}

              {/* Tab 5: Technical Setup Matrix */}
              {currentTab === 'tech-matrix' && (
                <TechSetupMatrixView
                  clients={clients}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                  onToggleAccess={toggleAccessItem}
                />
              )}

              {/* Tab 6: Sprints & Engineering Deliverables */}
              {currentTab === 'sprints' && (
                <ProjectsSprintView
                  clients={clients}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                  onUpdateMilestone={updateMilestone}
                  onAddMilestone={addMilestone}
                />
              )}

              {/* Tab 7: Retainers & Billing Health */}
              {currentTab === 'retainers' && (
                <BillingRetainersView
                  clients={clients}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                  onUpdateClient={updateClient}
                />
              )}

              {/* Tab 8: Agency Pulse & Intelligence */}
              {currentTab === 'analytics' && (
                <AnalyticsPulseView
                  clients={clients}
                  onSelectClient={(c) => setActiveClientId(c.id)}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Client Detail Deep-Dive Drawer */}
      {selectedClient && (
        <ClientDetailDrawer
          client={selectedClient}
          packages={packages}
          onClose={() => setActiveClientId(null)}
          onUpdateClient={updateClient}
          onToggleAccess={toggleAccessItem}
          onAddActivity={addActivityLog}
          onOpenExportModal={handleOpenExportForClient}
          onUpdateStage={updateClientOnboardingStage}
          onToggleOnboardingTask={toggleOnboardingTask}
          onAssignPackage={assignPackageToClient}
        />
      )}

      {/* New Client Onboarding Wizard Modal */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onAddClient={addClient}
      />

      {/* Export Brief / Technical Dossier Modal */}
      <ExportBriefModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        clients={clients}
        initialClient={exportClientTarget}
      />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <CrmApp />
    </CrmProvider>
  );
}
