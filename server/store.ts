/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import {
  Tenant,
  BusinessModule,
  Enquiry,
  LeadStage,
  ServiceLead,
  ServiceQuote,
  ServiceInvoice,
  ShopOrder,
  ShopProduct,
  SupportTicket,
} from '../src/types/altivio';
import { SEED_TENANTS } from './seedData';

function cloneTenants(): Tenant[] {
  return JSON.parse(JSON.stringify(SEED_TENANTS));
}

export class TenantStore {
  private tenants: Tenant[];

  constructor() {
    this.tenants = cloneTenants();
  }

  reset(): void {
    this.tenants = cloneTenants();
  }

  getAllTenants(): Tenant[] {
    return this.tenants;
  }

  getTenantById(id: string): Tenant | undefined {
    return this.tenants.find((t) => t.id === id);
  }

  getTenantBySlug(slug: string): Tenant | undefined {
    return this.tenants.find((t) => t.slug === slug);
  }

  toggleModule(tenantId: string, module: BusinessModule): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    tenant.activeModule = module;
    if (!tenant.serviceData) {
      tenant.serviceData = { leads: [], quotes: [], invoices: [], followUps: [] };
    }
    if (!tenant.shopData) {
      tenant.shopData = {
        orders: [],
        products: [],
        customers: [],
        abandonedCarts: [],
        discounts: [],
      };
    }
    return tenant;
  }

  provisionTenant(newTenant: Tenant): Tenant {
    this.tenants.unshift(newTenant);
    return newTenant;
  }

  updateContentBlock(tenantId: string, blockId: string, newContent: string): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    const block = tenant.contentBlocks.find((b) => b.id === blockId);
    if (!block) return null;
    block.content = newContent;
    block.lastUpdated = 'Just now';
    return tenant;
  }

  updateEnquiryStatus(
    tenantId: string,
    enquiryId: string,
    status: Enquiry['status']
  ): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    const enq = tenant.enquiries.find((e) => e.id === enquiryId);
    if (!enq) return null;
    enq.status = status;
    return tenant;
  }

  createSupportTicket(
    tenantId: string,
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'altivioAssignee'>
  ): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tic-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Open',
      altivioAssignee: 'Liam (Altivio Lead Dev)',
    };
    tenant.supportTickets.unshift(newTicket);
    return tenant;
  }

  addLead(tenantId: string, leadData: Omit<ServiceLead, 'id' | 'createdAt'>): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    if (!tenant.serviceData) {
      tenant.serviceData = { leads: [], quotes: [], invoices: [], followUps: [] };
    }
    tenant.serviceData.leads.unshift({
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: 'Just now',
    });
    return tenant;
  }

  updateLeadStage(tenantId: string, leadId: string, stage: LeadStage): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant || !tenant.serviceData) return null;
    const lead = tenant.serviceData.leads.find((l) => l.id === leadId);
    if (!lead) return null;
    lead.stage = stage;
    return tenant;
  }

  addQuote(tenantId: string, quoteData: Omit<ServiceQuote, 'id' | 'sentDate'>): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    if (!tenant.serviceData) {
      tenant.serviceData = { leads: [], quotes: [], invoices: [], followUps: [] };
    }
    tenant.serviceData.quotes.unshift({
      ...quoteData,
      id: `q-${Date.now()}`,
      sentDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });
    return tenant;
  }

  updateInvoiceStatus(
    tenantId: string,
    invoiceId: string,
    status: ServiceInvoice['status']
  ): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant || !tenant.serviceData) return null;
    const inv = tenant.serviceData.invoices.find((i) => i.id === invoiceId);
    if (!inv) return null;
    inv.status = status;
    if (status === 'paid') {
      inv.paidDate = 'Just now';
    }
    return tenant;
  }

  updateOrderStatus(
    tenantId: string,
    orderId: string,
    status: ShopOrder['fulfillmentStatus']
  ): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant || !tenant.shopData) return null;
    const order = tenant.shopData.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.fulfillmentStatus = status;
    return tenant;
  }

  addProduct(tenantId: string, productData: Omit<ShopProduct, 'id' | 'totalSold'>): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant) return null;
    if (!tenant.shopData) {
      tenant.shopData = {
        orders: [],
        products: [],
        customers: [],
        abandonedCarts: [],
        discounts: [],
      };
    }
    tenant.shopData.products.unshift({
      ...productData,
      id: `p-${Date.now()}`,
      totalSold: 0,
    });
    return tenant;
  }

  recoverCart(tenantId: string, cartId: string): Tenant | null {
    const tenant = this.getTenantById(tenantId);
    if (!tenant || !tenant.shopData) return null;
    const cart = tenant.shopData.abandonedCarts.find((c) => c.id === cartId);
    if (!cart) return null;
    cart.emailRecoverySent = true;
    return tenant;
  }
}

export const defaultTenantStore = new TenantStore();
