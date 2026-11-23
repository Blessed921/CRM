/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApiApp } from '../server/app';
import { TenantStore } from '../server/store';

describe('Altivio OS RBAC, Auth & Multi-Tenant Isolation', () => {
  let store: TenantStore;
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    store = new TenantStore();
    const app = createApiApp(store);
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const addr = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  beforeEach(() => {
    store.reset();
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  async function loginAs(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    expect(res.status).toBe(200);
    return res.json();
  }

  it('rejects unauthenticated access to protected endpoints with 401', async () => {
    const adminRes = await fetch(`${baseUrl}/api/admin/tenants`);
    expect(adminRes.status).toBe(401);

    const tenantRes = await fetch(`${baseUrl}/api/tenants/t-apex-dental`);
    expect(tenantRes.status).toBe(401);

    const aiRes = await fetch(`${baseUrl}/api/gemini/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantId: 't-apex-dental' }),
    });
    expect(aiRes.status).toBe(401);
  });

  it('enforces client_owner tenant isolation and blocks admin or cross-tenant routes with 403', async () => {
    const { token, user } = await loginAs('dr.sterling@apexdentalstudio.com', 'apex-client-2026');
    expect(user.role).toBe('client_owner');
    expect(user.tenantId).toBe('t-apex-dental');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // Blocked from agency fleet routes
    const adminFleet = await fetch(`${baseUrl}/api/admin/tenants`, { headers });
    expect(adminFleet.status).toBe(403);

    const moduleToggle = await fetch(`${baseUrl}/api/admin/tenants/t-apex-dental/module`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ module: 'shop' }),
    });
    expect(moduleToggle.status).toBe(403);

    // Allowed on own tenant
    const ownTenant = await fetch(`${baseUrl}/api/tenants/t-apex-dental`, { headers });
    expect(ownTenant.status).toBe(200);
    const ownData = await ownTenant.json();
    expect(ownData.tenant.slug).toBe('apex-dental');

    // Blocked from another tenant by ID, slug, mutation, and AI insights
    const otherById = await fetch(`${baseUrl}/api/tenants/t-kova-atelier`, { headers });
    expect(otherById.status).toBe(403);

    const otherBySlug = await fetch(`${baseUrl}/api/tenants/by-slug/kova-atelier`, { headers });
    expect(otherBySlug.status).toBe(403);

    const otherMutation = await fetch(`${baseUrl}/api/tenants/t-kova-atelier/content/cb-k-1`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ content: 'Tampered content' }),
    });
    expect(otherMutation.status).toBe(403);

    const crossTenantAi = await fetch(`${baseUrl}/api/gemini/insights`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tenantId: 't-kova-atelier' }),
    });
    expect(crossTenantAi.status).toBe(403);

    // Allowed on own tenant AI insights
    const ownAi = await fetch(`${baseUrl}/api/gemini/insights`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ tenantId: 't-apex-dental' }),
    });
    expect(ownAi.status).toBe(200);
    const insights = await ownAi.json();
    expect(Array.isArray(insights.summaryCards)).toBe(true);
    expect(insights.summaryCards.length).toBe(3);
  });

  it('allows altivio_admin to manage fleet, toggle modules, and provision isolated tenants', async () => {
    const { token, user } = await loginAs('admin@altivio.com', 'altivio-admin-2026');
    expect(user.role).toBe('altivio_admin');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const fleetRes = await fetch(`${baseUrl}/api/admin/tenants`, { headers });
    expect(fleetRes.status).toBe(200);
    const fleetJson = await fleetRes.json();
    expect(fleetJson.tenants.length).toBeGreaterThanOrEqual(3);

    const toggleRes = await fetch(`${baseUrl}/api/admin/tenants/t-apex-dental/module`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ module: 'shop' }),
    });
    expect(toggleRes.status).toBe(200);
    const toggleJson = await toggleRes.json();
    expect(toggleJson.tenant.activeModule).toBe('shop');

    // Provision a brand-new tenant and verify its owner login is isolated
    const createRes = await fetch(`${baseUrl}/api/admin/tenants`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tenant: {
          id: 't-northwind-clinic',
          slug: 'northwind-clinic',
          name: 'Northwind Physiotherapy',
          tagline: 'Sports Rehab',
          subdomain: 'northwind.altivio.app',
          customDomain: 'northwindphysio.com',
          logoInitials: 'NP',
          brandAccentHex: '#059669',
          industry: 'Healthcare',
          ownerName: 'Clara Jensen',
          ownerEmail: 'clara@northwindphysio.com',
          activeModule: 'service',
          websitePlan: 'Altivio Growth + Service Engine',
          monthlyWebsiteFee: 349,
          launchedDate: 'Nov 2026',
          websiteHealth: {
            uptime: 99.99,
            speedScore: 98,
            sslValid: true,
            seoScore: 95,
            lastChecked: 'Just now',
          },
          revenueProof: {
            monthlyRevenue: 12000,
            prevMonthlyRevenue: 9800,
            conversionsCount: 24,
            conversionRate: 4.1,
            roiMultiplier: 34.4,
            trafficMonthly: 1850,
            avgValue: 500,
          },
          trafficSources: [],
          topPages: [],
          enquiries: [],
          contentBlocks: [],
          teamMembers: [],
          supportTickets: [],
          serviceData: { leads: [], quotes: [], invoices: [], followUps: [] },
        },
      }),
    });
    expect(createRes.status).toBe(201);

    const newOwner = await loginAs('clara@northwindphysio.com', 'altivio-client-2026');
    expect(newOwner.user.tenantId).toBe('t-northwind-clinic');

    const ownCheck = await fetch(`${baseUrl}/api/tenants/by-slug/northwind-clinic`, {
      headers: { Authorization: `Bearer ${newOwner.token}` },
    });
    expect(ownCheck.status).toBe(200);

    const foreignCheck = await fetch(`${baseUrl}/api/tenants/by-slug/apex-dental`, {
      headers: { Authorization: `Bearer ${newOwner.token}` },
    });
    expect(foreignCheck.status).toBe(403);
  });
});
