export type BusinessModule = 'service' | 'shop';

export type AltivioViewMode = 'tenant' | 'altivio-admin';

export interface WebsiteHealth {
  uptime: number; // e.g. 99.98
  speedScore: number; // e.g. 97
  sslValid: boolean;
  seoScore: number; // e.g. 94
  lastChecked: string;
}

export interface RevenueProof {
  monthlyRevenue: number;
  prevMonthlyRevenue: number;
  conversionsCount: number;
  conversionRate: number; // e.g. 4.2%
  roiMultiplier: number; // e.g. 24.5x (revenue / altivio fee)
  trafficMonthly: number;
  avgValue: number;
}

// ------------------------------------------------------------------
// Core Base Features (Included with EVERY Website)
// ------------------------------------------------------------------
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjectOrService: string;
  message: string;
  sourcePage: string;
  referralSource: string; // 'Google Search', 'Instagram', 'Direct', 'LinkedIn'
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'archived';
  estimatedValue?: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  revenue: number;
  conversionRate: number;
}

export interface PageStat {
  page: string;
  views: number;
  conversions: number;
}

export interface ContentBlock {
  id: string;
  section: string;
  label: string;
  content: string;
  lastUpdated: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Staff';
  avatarInitials: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Content Change' | 'Feature Request' | 'Speed & SEO' | 'Domain & DNS';
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  resolvedAt?: string;
  altivioAssignee: string;
}

// ------------------------------------------------------------------
// Business Module A: Service Business (Quotes, Leads, Invoices)
// ------------------------------------------------------------------
export type LeadStage = 'new' | 'contacted' | 'consultation' | 'quoted' | 'won' | 'lost';

export interface ServiceLead {
  id: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  stage: LeadStage;
  estimatedValue: number;
  serviceRequested: string;
  source: string;
  notes: string;
  createdAt: string;
}

export interface ServiceQuote {
  id: string;
  quoteNumber: string;
  clientName: string;
  title: string;
  items: { description: string; qty: number; unitPrice: number }[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  validUntil: string;
  sentDate: string;
}

export interface ServiceInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  title: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface ServiceFollowUp {
  id: string;
  recipientName: string;
  recipientEmail: string;
  triggerEvent: string;
  channel: 'Email' | 'SMS';
  status: 'scheduled' | 'sent' | 'completed';
  scheduledDate: string;
  templateName: string;
}

// ------------------------------------------------------------------
// Business Module B: Shop / E-Commerce (Orders, Products, Carts)
// ------------------------------------------------------------------
export interface ShopOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsSummary: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'refunded';
  fulfillmentStatus: 'fulfilled' | 'unfulfilled' | 'shipping';
  createdAt: string;
  shippingCity: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  totalSold: number;
}

export interface ShopCustomer {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  segment: 'VIP Customer' | 'Repeat Buyer' | 'First-time';
}

export interface AbandonedCart {
  id: string;
  customerEmail: string;
  cartValue: number;
  itemsCount: number;
  abandonedAt: string;
  emailRecoverySent: boolean;
  recovered: boolean;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  usageCount: number;
  usageLimit: number;
  status: 'active' | 'expired';
}

// ------------------------------------------------------------------
// Tenant Definition
// ------------------------------------------------------------------
export interface Tenant {
  id: string;
  name: string;
  tagline: string;
  subdomain: string;
  customDomain: string;
  logoInitials: string;
  brandAccentHex: string;
  industry: string;
  ownerName: string;
  ownerEmail: string;
  activeModule: BusinessModule;
  websitePlan: string;
  monthlyWebsiteFee: number;
  launchedDate: string;
  websiteHealth: WebsiteHealth;
  revenueProof: RevenueProof;
  trafficSources: TrafficSource[];
  topPages: PageStat[];
  enquiries: Enquiry[];
  contentBlocks: ContentBlock[];
  teamMembers: TeamMember[];
  supportTickets: SupportTicket[];
  
  // Module-specific data
  serviceData?: {
    leads: ServiceLead[];
    quotes: ServiceQuote[];
    invoices: ServiceInvoice[];
    followUps: ServiceFollowUp[];
  };
  shopData?: {
    orders: ShopOrder[];
    products: ShopProduct[];
    customers: ShopCustomer[];
    abandonedCarts: AbandonedCart[];
    discounts: DiscountCode[];
  };
}

// ------------------------------------------------------------------
// AI Insights Module (Powered by Gemini)
// ------------------------------------------------------------------
export interface WeeklySummaryCard {
  id: string;
  title: string;
  metricValue: string;
  metricDelta: string;
  status: 'positive' | 'neutral' | 'warning';
  badge: string;
  analysis: string;
}

export interface ActionableSuggestion {
  id: string;
  title: string;
  category: string;
  impact: 'High Impact' | 'Medium Impact' | 'Quick Win';
  effort: 'Low Effort' | 'Medium Effort' | 'High Effort';
  estimatedLift: string;
  rationale: string;
  actionPlan: string[];
}

export interface GeminiInsightResponse {
  weekLabel: string;
  headline: string;
  healthRating: string;
  executiveOverview: string;
  summaryCards: WeeklySummaryCard[];
  actionableSuggestions: ActionableSuggestion[];
  generatedAt?: string;
}

export type TenantTab =
  | 'proof-overview'
  | 'traffic'
  | 'enquiries'
  | 'insights'
  // Service module tabs
  | 'leads-pipeline'
  | 'quotes'
  | 'invoices'
  | 'follow-ups'
  // Shop module tabs
  | 'orders'
  | 'products'
  | 'customers'
  | 'abandoned-carts'
  | 'discounts'
  // Base utility tabs
  | 'content-editor'
  | 'health-vitals'
  | 'proof-reports'
  | 'altivio-support';
