import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Tenant, 
  BusinessModule, 
  AltivioViewMode, 
  TenantTab, 
  Enquiry, 
  ServiceLead, 
  ServiceQuote, 
  ServiceInvoice, 
  ShopOrder, 
  ShopProduct, 
  SupportTicket,
  LeadStage
} from '../types/altivio';
import { INITIAL_TENANTS } from '../data/mockTenants';

interface AltivioContextType {
  tenants: Tenant[];
  activeTenantId: string;
  activeTenant: Tenant;
  viewMode: AltivioViewMode;
  activeTab: TenantTab;
  setActiveTenantId: (id: string) => void;
  setViewMode: (mode: AltivioViewMode) => void;
  setActiveTab: (tab: TenantTab) => void;
  
  // Altivio Agency Admin actions
  toggleTenantModule: (tenantId: string, module: BusinessModule) => void;
  provisionNewTenant: (newTenant: Tenant) => void;
  
  // Client Base actions
  updateContentBlock: (tenantId: string, blockId: string, newContent: string) => void;
  updateEnquiryStatus: (tenantId: string, enquiryId: string, status: Enquiry['status']) => void;
  createSupportTicket: (tenantId: string, ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'altivioAssignee'>) => void;
  
  // Service Module actions
  updateLeadStage: (tenantId: string, leadId: string, newStage: LeadStage) => void;
  addLead: (tenantId: string, lead: Omit<ServiceLead, 'id' | 'createdAt'>) => void;
  addQuote: (tenantId: string, quote: Omit<ServiceQuote, 'id' | 'sentDate'>) => void;
  updateInvoiceStatus: (tenantId: string, invoiceId: string, status: ServiceInvoice['status']) => void;
  
  // Shop Module actions
  updateOrderStatus: (tenantId: string, orderId: string, status: ShopOrder['fulfillmentStatus']) => void;
  addProduct: (tenantId: string, product: Omit<ShopProduct, 'id' | 'totalSold'>) => void;
  
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'altivio_os_tenants_v1';

const AltivioContext = createContext<AltivioContextType | undefined>(undefined);

export const AltivioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading localStorage for Altivio OS', e);
    }
    return INITIAL_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>('t-apex-dental');
  const [viewMode, setViewMode] = useState<AltivioViewMode>('tenant');
  const [activeTab, setActiveTab] = useState<TenantTab>('proof-overview');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
    } catch (e) {
      console.error('Error saving tenants to localStorage', e);
    }
  }, [tenants]);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const toggleTenantModule = (tenantId: string, module: BusinessModule) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        return {
          ...t,
          activeModule: module,
          // Initialize module data if missing
          serviceData: t.serviceData || { leads: [], quotes: [], invoices: [], followUps: [] },
          shopData: t.shopData || { orders: [], products: [], customers: [], abandonedCarts: [], discounts: [] },
        };
      })
    );
  };

  const provisionNewTenant = (newTenant: Tenant) => {
    setTenants((prev) => [newTenant, ...prev]);
    setActiveTenantId(newTenant.id);
    setViewMode('tenant');
    setActiveTab('proof-overview');
  };

  const updateContentBlock = (tenantId: string, blockId: string, newContent: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        return {
          ...t,
          contentBlocks: t.contentBlocks.map((cb) =>
            cb.id === blockId ? { ...cb, content: newContent, lastUpdated: 'Just now' } : cb
          ),
        };
      })
    );
  };

  const updateEnquiryStatus = (tenantId: string, enquiryId: string, status: Enquiry['status']) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        return {
          ...t,
          enquiries: t.enquiries.map((e) =>
            e.id === enquiryId ? { ...e, status } : e
          ),
        };
      })
    );
  };

  const createSupportTicket = (
    tenantId: string,
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'altivioAssignee'>
  ) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tic-${Date.now()}`,
      createdAt: 'Just now',
      status: 'Open',
      altivioAssignee: 'Liam (Altivio Lead Dev)',
    };

    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        return {
          ...t,
          supportTickets: [newTicket, ...t.supportTickets],
        };
      })
    );
  };

  const updateLeadStage = (tenantId: string, leadId: string, newStage: LeadStage) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId || !t.serviceData) return t;
        return {
          ...t,
          serviceData: {
            ...t.serviceData,
            leads: t.serviceData.leads.map((l) =>
              l.id === leadId ? { ...l, stage: newStage } : l
            ),
          },
        };
      })
    );
  };

  const addLead = (tenantId: string, leadData: Omit<ServiceLead, 'id' | 'createdAt'>) => {
    const newLead: ServiceLead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: 'Just now',
    };
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const currentService = t.serviceData || { leads: [], quotes: [], invoices: [], followUps: [] };
        return {
          ...t,
          serviceData: {
            ...currentService,
            leads: [newLead, ...currentService.leads],
          },
        };
      })
    );
  };

  const addQuote = (tenantId: string, quoteData: Omit<ServiceQuote, 'id' | 'sentDate'>) => {
    const newQuote: ServiceQuote = {
      ...quoteData,
      id: `q-${Date.now()}`,
      sentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const currentService = t.serviceData || { leads: [], quotes: [], invoices: [], followUps: [] };
        return {
          ...t,
          serviceData: {
            ...currentService,
            quotes: [newQuote, ...currentService.quotes],
          },
        };
      })
    );
  };

  const updateInvoiceStatus = (tenantId: string, invoiceId: string, status: ServiceInvoice['status']) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId || !t.serviceData) return t;
        return {
          ...t,
          serviceData: {
            ...t.serviceData,
            invoices: t.serviceData.invoices.map((inv) =>
              inv.id === invoiceId
                ? {
                    ...inv,
                    status,
                    paidDate: status === 'paid' ? 'Just now' : inv.paidDate,
                  }
                : inv
            ),
          },
        };
      })
    );
  };

  const updateOrderStatus = (tenantId: string, orderId: string, status: ShopOrder['fulfillmentStatus']) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId || !t.shopData) return t;
        return {
          ...t,
          shopData: {
            ...t.shopData,
            orders: t.shopData.orders.map((ord) =>
              ord.id === orderId ? { ...ord, fulfillmentStatus: status } : ord
            ),
          },
        };
      })
    );
  };

  const addProduct = (tenantId: string, productData: Omit<ShopProduct, 'id' | 'totalSold'>) => {
    const newProduct: ShopProduct = {
      ...productData,
      id: `p-${Date.now()}`,
      totalSold: 0,
    };
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const currentShop = t.shopData || { orders: [], products: [], customers: [], abandonedCarts: [], discounts: [] };
        return {
          ...t,
          shopData: {
            ...currentShop,
            products: [newProduct, ...currentShop.products],
          },
        };
      })
    );
  };

  const resetToDefaults = () => {
    setTenants(INITIAL_TENANTS);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTenantId('t-apex-dental');
    setViewMode('tenant');
    setActiveTab('proof-overview');
  };

  return (
    <AltivioContext.Provider
      value={{
        tenants,
        activeTenantId,
        activeTenant,
        viewMode,
        activeTab,
        setActiveTenantId,
        setViewMode,
        setActiveTab,
        toggleTenantModule,
        provisionNewTenant,
        updateContentBlock,
        updateEnquiryStatus,
        createSupportTicket,
        updateLeadStage,
        addLead,
        addQuote,
        updateInvoiceStatus,
        updateOrderStatus,
        addProduct,
        resetToDefaults,
      }}
    >
      {children}
    </AltivioContext.Provider>
  );
};

export const useAltivio = () => {
  const context = useContext(AltivioContext);
  if (!context) {
    throw new Error('useAltivio must be used within an AltivioProvider');
  }
  return context;
};
