/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import { useCallback } from 'react';
import { apiFetch } from '../api/client';
import { useTenant } from '../context/TenantContext';
import type {
  LeadStage,
  ServiceInvoice,
  ServiceLead,
  ServiceQuote,
  Tenant,
} from '../types/altivio';

export function useServiceModule() {
  const { tenant, setTenant } = useTenant();

  const addLead = useCallback(
    async (lead: Omit<ServiceLead, 'id' | 'createdAt'>) => {
      const res = await apiFetch<{ tenant: Tenant }>(`/api/tenants/${tenant.id}/service/leads`, {
        method: 'POST',
        body: JSON.stringify({ lead }),
      });
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const updateLeadStage = useCallback(
    async (leadId: string, stage: LeadStage) => {
      const res = await apiFetch<{ tenant: Tenant }>(
        `/api/tenants/${tenant.id}/service/leads/${leadId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ stage }),
        }
      );
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const addQuote = useCallback(
    async (quote: Omit<ServiceQuote, 'id' | 'sentDate'>) => {
      const res = await apiFetch<{ tenant: Tenant }>(`/api/tenants/${tenant.id}/service/quotes`, {
        method: 'POST',
        body: JSON.stringify({ quote }),
      });
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const updateInvoiceStatus = useCallback(
    async (invoiceId: string, status: ServiceInvoice['status']) => {
      const res = await apiFetch<{ tenant: Tenant }>(
        `/api/tenants/${tenant.id}/service/invoices/${invoiceId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  return { addLead, updateLeadStage, addQuote, updateInvoiceStatus };
}
