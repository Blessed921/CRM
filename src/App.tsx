/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TenantProvider, useTenantState } from './context/TenantContext';
import { AdminFleetProvider } from './context/AdminFleetContext';
import { LoginPage } from './components/LoginPage';
import { AltivioHeader } from './components/AltivioHeader';
import { AltivioSidebar } from './components/AltivioSidebar';
import { NewTenantModal } from './components/NewTenantModal';
import { AltivioAdminConsoleView } from './components/views/AltivioAdminConsoleView';
import { ProofOverviewView } from './components/views/ProofOverviewView';
import { TrafficView } from './components/views/TrafficView';
import { EnquiriesInboxView } from './components/views/EnquiriesInboxView';
import { InsightsView } from './components/views/InsightsView';
import { ServiceModuleView } from './components/views/ServiceModuleView';
import { ShopModuleView } from './components/views/ShopModuleView';
import { ContentEditorView } from './components/views/ContentEditorView';
import { WebsiteHealthView } from './components/views/WebsiteHealthView';
import { ProofReportsView } from './components/views/ProofReportsView';
import { AltivioSupportView } from './components/views/AltivioSupportView';

const FullScreenLoader: React.FC<{ label?: string }> = ({ label = 'Loading workspace...' }) => (
  <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 text-xs font-mono">
    {label}
  </div>
);

const HomeRedirect: React.FC = () => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'altivio_admin') return <Navigate to="/admin" replace />;
  if (user.tenantSlug) return <Navigate to={`/app/${user.tenantSlug}/overview`} replace />;
  return <Navigate to="/login" replace />;
};

const RequireAdmin: React.FC = () => {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'altivio_admin') {
    const target = user.tenantSlug ? `/app/${user.tenantSlug}/overview` : '/login';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
};

const RequireTenantAccess: React.FC = () => {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'client_owner' && user.tenantSlug !== tenantSlug) {
    return (
      <Navigate to={user.tenantSlug ? `/app/${user.tenantSlug}/overview` : '/login'} replace />
    );
  }
  if (!tenantSlug) return <Navigate to="/" replace />;

  return (
    <TenantProvider slug={tenantSlug}>
      <TenantShell />
    </TenantProvider>
  );
};

const AdminShell: React.FC = () => {
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);
  const { applyDocumentBranding } = useTheme();

  useEffect(() => {
    applyDocumentBranding({
      title: 'Altivio Partner Console | Agency Fleet Operations',
      accentHex: '#4f46e5',
      initials: 'AL',
    });
  }, [applyDocumentBranding]);

  return (
    <AdminFleetProvider>
      <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans">
        <AltivioHeader mode="admin" onOpenNewClientModal={() => setIsNewTenantModalOpen(true)} />
        <main className="flex-1 lg:overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <AltivioAdminConsoleView onOpenNewClientModal={() => setIsNewTenantModalOpen(true)} />
          </div>
        </main>
        <NewTenantModal
          isOpen={isNewTenantModalOpen}
          onClose={() => setIsNewTenantModalOpen(false)}
        />
      </div>
    </AdminFleetProvider>
  );
};

const TenantShell: React.FC = () => {
  const { tenant, loading, error } = useTenantState();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) {
    return <FullScreenLoader label="Loading client workspace..." />;
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-2">
          <h1 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Workspace Unavailable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {error || 'You do not have access to this workspace.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full lg:h-screen lg:overflow-hidden flex bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 font-sans">
      <AltivioSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:h-full lg:overflow-hidden">
        <AltivioHeader
          mode="tenant"
          tenant={tenant}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 lg:overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomeRedirect />} />

            {/* Altivio Agency Admin Route */}
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminShell />} />
            </Route>

            {/* Isolated Multi-Tenant Client Portal Routes */}
            <Route path="/app/:tenantSlug" element={<RequireTenantAccess />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<ProofOverviewView />} />
              <Route path="analytics" element={<TrafficView />} />
              <Route path="enquiries" element={<EnquiriesInboxView />} />
              <Route path="insights" element={<InsightsView />} />

              {/* Service Module Routes */}
              <Route
                path="service/leads"
                element={<ServiceModuleView initialSubTab="leads-pipeline" />}
              />
              <Route path="service/quotes" element={<ServiceModuleView initialSubTab="quotes" />} />
              <Route
                path="service/invoices"
                element={<ServiceModuleView initialSubTab="invoices" />}
              />
              <Route
                path="service/follow-ups"
                element={<ServiceModuleView initialSubTab="follow-ups" />}
              />

              {/* Shop Module Routes */}
              <Route path="shop/orders" element={<ShopModuleView initialSubTab="orders" />} />
              <Route path="shop/products" element={<ShopModuleView initialSubTab="products" />} />
              <Route path="shop/customers" element={<ShopModuleView initialSubTab="customers" />} />
              <Route
                path="shop/abandoned-carts"
                element={<ShopModuleView initialSubTab="abandoned-carts" />}
              />
              <Route path="shop/discounts" element={<ShopModuleView initialSubTab="discounts" />} />

              {/* Base Website Utility Routes */}
              <Route path="content" element={<ContentEditorView />} />
              <Route path="health" element={<WebsiteHealthView />} />
              <Route path="reports" element={<ProofReportsView />} />
              <Route path="support" element={<AltivioSupportView />} />

              <Route path="*" element={<Navigate to="overview" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
