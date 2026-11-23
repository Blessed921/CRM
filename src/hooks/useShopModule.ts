/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import { useCallback } from 'react';
import { apiFetch } from '../api/client';
import { useTenant } from '../context/TenantContext';
import type { ShopOrder, ShopProduct, Tenant } from '../types/altivio';

export function useShopModule() {
  const { tenant, setTenant } = useTenant();

  const updateOrderStatus = useCallback(
    async (orderId: string, fulfillmentStatus: ShopOrder['fulfillmentStatus']) => {
      const res = await apiFetch<{ tenant: Tenant }>(
        `/api/tenants/${tenant.id}/shop/orders/${orderId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ fulfillmentStatus }),
        }
      );
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const addProduct = useCallback(
    async (product: Omit<ShopProduct, 'id' | 'totalSold'>) => {
      const res = await apiFetch<{ tenant: Tenant }>(`/api/tenants/${tenant.id}/shop/products`, {
        method: 'POST',
        body: JSON.stringify({ product }),
      });
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  const recoverCart = useCallback(
    async (cartId: string) => {
      const res = await apiFetch<{ tenant: Tenant }>(
        `/api/tenants/${tenant.id}/shop/carts/${cartId}/recover`,
        {
          method: 'POST',
        }
      );
      setTenant(res.tenant);
    },
    [tenant.id, setTenant]
  );

  return { updateOrderStatus, addProduct, recoverCart };
}
