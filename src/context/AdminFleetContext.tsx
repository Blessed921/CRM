/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Tenant, BusinessModule } from '../types/altivio';
import { apiFetch } from '../api/client';
import { useTheme } from './ThemeContext';

interface AdminFleetContextType {
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
  toggleTenantModule: (tenantId: string, module: BusinessModule) => Promise<void>;
  provisionNewTenant: (newTenant: Tenant) => Promise<Tenant>;
  resetDemoData: () => Promise<void>;
  refreshFleet: () => Promise<void>;
}

const AdminFleetContext = createContext<AdminFleetContextType | undefined>(undefined);

export const AdminFleetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { applyDocumentBranding } = useTheme();

  useEffect(() => {
    applyDocumentBranding({
      title: 'Altivio Partner Console — Multi-Tenant Fleet | Altivio OS',
      accentHex: '#4f46e5',
      initials: 'AL',
    });
  }, [applyDocumentBranding]);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ tenants: Tenant[] }>('/api/admin/tenants')
      .then((res) => {
        if (!cancelled) {
          setTenants(res.tenants);
          setError(null);
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setError(err.message || 'Unable to load tenant fleet.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshFleet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ tenants: Tenant[] }>('/api/admin/tenants');
      setTenants(res.tenants);
    } catch (err: any) {
      setError(err.message || 'Unable to load tenant fleet.');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTenantModule = useCallback(async (tenantId: string, module: BusinessModule) => {
    const res = await apiFetch<{ tenant: Tenant }>(`/api/admin/tenants/${tenantId}/module`, {
      method: 'PATCH',
      body: JSON.stringify({ module }),
    });
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? res.tenant : t)));
  }, []);

  const provisionNewTenant = useCallback(async (newTenant: Tenant): Promise<Tenant> => {
    const res = await apiFetch<{ tenant: Tenant }>('/api/admin/tenants', {
      method: 'POST',
      body: JSON.stringify({ tenant: newTenant }),
    });
    setTenants((prev) => [res.tenant, ...prev]);
    return res.tenant;
  }, []);

  const resetDemoData = useCallback(async () => {
    const res = await apiFetch<{ tenants: Tenant[] }>('/api/admin/reset', { method: 'POST' });
    setTenants(res.tenants);
  }, []);

  return (
    <AdminFleetContext.Provider
      value={{
        tenants,
        loading,
        error,
        toggleTenantModule,
        provisionNewTenant,
        resetDemoData,
        refreshFleet,
      }}
    >
      {children}
    </AdminFleetContext.Provider>
  );
};

export const useAdminFleet = () => {
  const ctx = useContext(AdminFleetContext);
  if (!ctx) throw new Error('useAdminFleet must be used within AdminFleetProvider');
  return ctx;
};
