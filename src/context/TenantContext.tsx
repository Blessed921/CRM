/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Tenant } from '../types/altivio';
import { apiFetch } from '../api/client';
import { useTheme } from './ThemeContext';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  setTenant: (updated: Tenant) => void;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantLoadState {
  slug: string | null;
  tenant: Tenant | null;
  error: string | null;
}

export const TenantProvider: React.FC<{ slug: string; children: React.ReactNode }> = ({
  slug,
  children,
}) => {
  const [state, setState] = useState<TenantLoadState>({
    slug: null,
    tenant: null,
    error: null,
  });
  const { applyDocumentBranding } = useTheme();

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ tenant: Tenant }>(`/api/tenants/by-slug/${slug}`)
      .then((res) => {
        if (!cancelled) {
          setState({ slug, tenant: res.tenant, error: null });
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          setState({
            slug,
            tenant: null,
            error: err.message || 'Failed to load workspace.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loading = state.slug !== slug;
  const tenant = state.slug === slug ? state.tenant : null;
  const error = state.slug === slug ? state.error : null;

  const setTenant = useCallback(
    (updated: Tenant) => {
      setState({ slug: updated.slug || slug, tenant: updated, error: null });
    },
    [slug]
  );

  const refreshTenant = useCallback(async () => {
    try {
      const res = await apiFetch<{ tenant: Tenant }>(`/api/tenants/by-slug/${slug}`);
      setState({ slug, tenant: res.tenant, error: null });
    } catch (err: any) {
      setState({ slug, tenant: null, error: err.message || 'Failed to load workspace.' });
    }
  }, [slug]);

  useEffect(() => {
    if (tenant) {
      applyDocumentBranding({
        title: `${tenant.name} — Client Growth Platform | Altivio OS`,
        accentHex: tenant.brandAccentHex,
        initials: tenant.logoInitials,
      });
    }
  }, [tenant, applyDocumentBranding]);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        loading,
        error,
        setTenant,
        refreshTenant,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  if (!ctx.tenant) {
    throw new Error('useTenant accessed before tenant loaded');
  }
  return {
    tenant: ctx.tenant,
    setTenant: ctx.setTenant,
    refreshTenant: ctx.refreshTenant,
  };
};

export const useTenantState = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenantState must be used within TenantProvider');
  return ctx;
};
