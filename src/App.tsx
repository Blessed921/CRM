/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AltivioProvider, useAltivio } from './context/AltivioContext';
import { AltivioHeader } from './components/AltivioHeader';
import { AltivioSidebar } from './components/AltivioSidebar';
import { ProofOverviewView } from './components/views/ProofOverviewView';
import { TrafficView } from './components/views/TrafficView';
import { EnquiriesInboxView } from './components/views/EnquiriesInboxView';
import { ServiceModuleView } from './components/views/ServiceModuleView';
import { ShopModuleView } from './components/views/ShopModuleView';
import { ContentEditorView } from './components/views/ContentEditorView';
import { WebsiteHealthView } from './components/views/WebsiteHealthView';
import { ProofReportsView } from './components/views/ProofReportsView';
import { AltivioSupportView } from './components/views/AltivioSupportView';
import { AltivioAdminConsoleView } from './components/views/AltivioAdminConsoleView';
import { InsightsView } from './components/views/InsightsView';
import { NewTenantModal } from './components/NewTenantModal';

const AltivioAppMain: React.FC = () => {
  const { viewMode, activeTab, activeTenant } = useAltivio();
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090D16] text-slate-100 font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Subtle modern ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[300px] bg-indigo-600/[0.04] blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[350px] bg-emerald-600/[0.03] blur-[160px] pointer-events-none rounded-full" />

      {/* Sidebar: Only visible when inspecting a specific tenant dashboard */}
      {viewMode === 'tenant' && <AltivioSidebar />}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Universal Top Header */}
        <AltivioHeader onOpenNewClientModal={() => setIsNewTenantModalOpen(true)} />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {viewMode === 'altivio-admin' ? (
              /* Altivio Agency Super-Admin Fleet View */
              <AltivioAdminConsoleView
                onOpenNewClientModal={() => setIsNewTenantModalOpen(true)}
              />
            ) : (
              /* Multi-Tenant Client Dashboard View */
              <>
                {/* Section 1: Revenue Proof & Base Traffic */}
                {activeTab === 'proof-overview' && <ProofOverviewView />}
                {activeTab === 'traffic' && <TrafficView />}
                {activeTab === 'enquiries' && <EnquiriesInboxView />}
                {activeTab === 'insights' && <InsightsView />}

                {/* Section 2: Service Engine Module */}
                {activeTab === 'leads-pipeline' && (
                  <ServiceModuleView initialSubTab="leads-pipeline" />
                )}
                {activeTab === 'quotes' && (
                  <ServiceModuleView initialSubTab="quotes" />
                )}
                {activeTab === 'invoices' && (
                  <ServiceModuleView initialSubTab="invoices" />
                )}
                {activeTab === 'follow-ups' && (
                  <ServiceModuleView initialSubTab="follow-ups" />
                )}

                {/* Section 3: Shop Engine Module */}
                {activeTab === 'orders' && (
                  <ShopModuleView initialSubTab="orders" />
                )}
                {activeTab === 'products' && (
                  <ShopModuleView initialSubTab="products" />
                )}
                {activeTab === 'customers' && (
                  <ShopModuleView initialSubTab="customers" />
                )}
                {activeTab === 'abandoned-carts' && (
                  <ShopModuleView initialSubTab="abandoned-carts" />
                )}
                {activeTab === 'discounts' && (
                  <ShopModuleView initialSubTab="discounts" />
                )}

                {/* Section 4: Base Website Tools */}
                {activeTab === 'content-editor' && <ContentEditorView />}
                {activeTab === 'health-vitals' && <WebsiteHealthView />}
                {activeTab === 'proof-reports' && <ProofReportsView />}
                {activeTab === 'altivio-support' && <AltivioSupportView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modal: Deploy New Client Dashboard */}
      <NewTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AltivioProvider>
      <AltivioAppMain />
    </AltivioProvider>
  );
}
