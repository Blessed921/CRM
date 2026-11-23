/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import { useCallback } from 'react';
import { apiFetch } from '../api/client';
import { useTenant } from '../context/TenantContext';
import type { Enquiry, SupportTicket, Tenant } from '../types/altivio';

export function useBaseTenantActions() {
  const { tenant, setTenant } = useTenant();

  const updateContentBlock = useCallback(
    async (blockId: string, content: string) => {
      const res = await apiFetch<{ tenant: Tenant }>(
        `/api/tenants/${tenant.id}/content/${blockId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ content }),
        }
      );
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const updateEnquiryStatus = useCallback(
    async (enquiryId: string, status: Enquiry['status']) => {
      const res = await apiFetch<{ tenant: Tenant }>(
        `/api/tenants/${tenant.id}/enquiries/${enquiryId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const createSupportTicket = useCallback(
    async (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'altivioAssignee'>) => {
      const res = await apiFetch<{ tenant: Tenant }>(`/api/tenants/${tenant.id}/support-tickets`, {
        method: 'POST',
        body: JSON.stringify(ticket),
      });
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  return { updateContentBlock, updateEnquiryStatus, createSupportTicket };
}
