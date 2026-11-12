import React, { useState } from 'react';
import { useAltivio } from '../context/AltivioContext';
import { Tenant, BusinessModule } from '../types/altivio';
import { X, Sparkles, Layers, Globe, ShieldCheck } from 'lucide-react';

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PRESETS = [
  '#0ea5e9', // Sky Blue
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink / Rose
  '#8b5cf6', // Violet
];

export const NewTenantModal: React.FC<NewTenantModalProps> = ({ isOpen, onClose }) => {
  const { provisionNewTenant } = useAltivio();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [industry, setIndustry] = useState('Professional Services');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [activeModule, setActiveModule] = useState<BusinessModule>('service');
  const [brandAccentHex, setBrandAccentHex] = useState('#0ea5e9');
  const [monthlyWebsiteFee, setMonthlyWebsiteFee] = useState<number>(399);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!subdomain || subdomain.includes('altivio.app')) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '');
      setSubdomain(`${slug || 'client'}.altivio.app`);
      if (!customDomain) {
        setCustomDomain(`www.${slug || 'client'}.com`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subdomain.trim()) return;

    const initials = name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'NW';

    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'Premier modern website engineered by Altivio.',
      subdomain: subdomain.trim(),
      customDomain: customDomain.trim() || subdomain.trim(),
      logoInitials: initials,
      brandAccentHex,
      industry,
      ownerName: ownerName.trim() || 'Business Owner',
      ownerEmail: ownerEmail.trim() || 'owner@clientdomain.com',
      activeModule,
      websitePlan: `Altivio Growth Website + ${activeModule === 'service' ? 'Service Engine' : 'Shop Engine'}`,
      monthlyWebsiteFee: Number(monthlyWebsiteFee) || 399,
      launchedDate: new Date().toISOString().split('T')[0],
      websiteHealth: {
        uptime: 99.99,
        speedScore: 98,
        sslValid: true,
        seoScore: 95,
        lastChecked: 'Just now',
      },
      revenueProof: {
        monthlyRevenue: 12400,
        prevMonthlyRevenue: 0,
        conversionsCount: 14,
        conversionRate: 4.1,
        roiMultiplier: Number((12400 / (monthlyWebsiteFee || 399)).toFixed(1)),
        trafficMonthly: 1420,
        avgValue: 885,
      },
      trafficSources: [
        { source: 'Google Local Search (SEO)', visitors: 780, revenue: 7600, conversionRate: 4.8 },
        { source: 'Instagram & Social Ads', visitors: 420, revenue: 3400, conversionRate: 3.5 },
        { source: 'Direct Website Visitors', visitors: 220, revenue: 1400, conversionRate: 3.8 },
      ],
      topPages: [
        { page: '/', views: 980, conversions: 8 },
        { page: '/services', views: 540, conversions: 5 },
        { page: '/contact', views: 240, conversions: 9 },
      ],
      enquiries: [
        {
          id: `enq-${Date.now()}-1`,
          name: 'Sarah Jenkins',
          email: 'sarah.j@outlook.com',
          phone: '+1 (555) 234-5678',
          subjectOrService: 'New Client Inquiry',
          message: 'Found you through Google search. Would love to schedule an introductory consultation.',
          sourcePage: '/contact',
          referralSource: 'Google Local Search (SEO)',
          createdAt: '10 mins ago',
          status: 'new',
          estimatedValue: 2400,
        },
      ],
      contentBlocks: [
        {
          id: `cb-${Date.now()}-1`,
          section: 'Hero Banner',
          label: 'Headline',
          content: `${name} — Premium Quality Delivered`,
          lastUpdated: 'Today',
        },
        {
          id: `cb-${Date.now()}-2`,
          section: 'Announcement Bar',
          label: 'Top Notice',
          content: 'Book your initial consultation online for priority scheduling.',
          lastUpdated: 'Today',
        },
      ],
      teamMembers: [
        {
          id: `tm-${Date.now()}-1`,
          name: ownerName.trim() || 'Business Owner',
          email: ownerEmail.trim() || 'owner@clientdomain.com',
          role: 'Owner',
          avatarInitials: initials,
        },
      ],
      supportTickets: [
        {
          id: `tic-${Date.now()}-1`,
          subject: 'Initial website launch and analytics telemetry setup',
          category: 'Domain & DNS',
          priority: 'Normal',
          status: 'Resolved',
          createdAt: 'Today',
          resolvedAt: 'Today',
          altivioAssignee: 'Liam (Altivio Lead Dev)',
        },
      ],
      serviceData: {
        leads: [
          {
            id: `lead-${Date.now()}-1`,
            clientName: 'Harrison Ford',
            contactPerson: 'Harrison Ford',
            email: 'harrison@example.com',
            phone: '+1 (555) 345-6789',
            stage: 'new',
            estimatedValue: 3500,
            serviceRequested: 'Premium Service Package',
            source: 'Website Contact Form',
            notes: 'Client submitted form requesting quote.',
            createdAt: 'Just now',
          },
        ],
        quotes: [
          {
            id: `q-${Date.now()}-1`,
            quoteNumber: 'Q-2026-101',
            clientName: 'Harrison Ford',
            title: 'Initial Service Proposal',
            items: [{ description: 'Core implementation package', qty: 1, unitPrice: 3500 }],
            totalAmount: 3500,
            status: 'sent',
            validUntil: 'Nov 30, 2026',
            sentDate: 'Today',
          },
        ],
        invoices: [
          {
            id: `inv-${Date.now()}-1`,
            invoiceNumber: 'INV-2026-088',
            clientName: 'Harrison Ford',
            title: 'Initial Retainer Deposit',
            amount: 1750,
            status: 'pending',
            dueDate: 'Nov 25, 2026',
          },
        ],
        followUps: [
          {
            id: `fup-${Date.now()}-1`,
            recipientName: 'Harrison Ford',
            recipientEmail: 'harrison@example.com',
            triggerEvent: 'Quote Sent - 48h Follow-up',
            channel: 'Email',
            status: 'scheduled',
            scheduledDate: 'Tomorrow at 10:00 AM',
            templateName: 'Gentle Proposal Follow-up',
          },
        ],
      },
      shopData: {
        orders: [
          {
            id: `ord-${Date.now()}-1`,
            orderNumber: '#ORD-1001',
            customerName: 'Marcus Aurelius',
            customerEmail: 'marcus@roman.org',
            itemsSummary: 'Starter Product Bundle',
            totalAmount: 180,
            paymentStatus: 'paid',
            fulfillmentStatus: 'unfulfilled',
            createdAt: '15 mins ago',
            shippingCity: 'New York, NY',
          },
        ],
        products: [
          {
            id: `prod-${Date.now()}-1`,
            name: 'Flagship Signature Product',
            sku: 'SKU-001',
            price: 180,
            stock: 45,
            category: 'Best Sellers',
            status: 'in-stock',
            totalSold: 12,
          },
        ],
        customers: [
          {
            id: `cust-${Date.now()}-1`,
            name: 'Marcus Aurelius',
            email: 'marcus@roman.org',
            ordersCount: 1,
            totalSpent: 180,
            lastOrderDate: 'Today',
            segment: 'First-time',
          },
        ],
        abandonedCarts: [
          {
            id: `cart-${Date.now()}-1`,
            customerEmail: 'shopper.jane@gmail.com',
            cartValue: 180,
            itemsCount: 1,
            abandonedAt: '1 hour ago',
            emailRecoverySent: false,
            recovered: false,
          },
        ],
        discounts: [
          {
            id: `disc-${Date.now()}-1`,
            code: 'LAUNCH15',
            discountType: 'percentage',
            value: 15,
            usageCount: 4,
            usageLimit: 100,
            status: 'active',
          },
        ],
      },
    };

    provisionNewTenant(newTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            Altivio Provisioning
          </span>
          <span className="text-slate-400 text-xs">Deploy Client Dashboard</span>
        </div>
        <h2 className="text-lg font-bold text-white mt-1 font-display">
          Ship New Client Website Platform
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Provision a dedicated multi-tenant dashboard instance for a newly delivered client site.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Client Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Beacon Architectural Studio"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Altivio Subdomain *
              </label>
              <input
                type="text"
                required
                placeholder="beacon.altivio.app"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Custom Domain *
              </label>
              <input
                type="text"
                required
                placeholder="www.beaconarch.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Industry Sector
              </label>
              <input
                type="text"
                placeholder="e.g. Architecture & Design"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Monthly Retainer Fee ($/mo)
              </label>
              <input
                type="number"
                min="99"
                value={monthlyWebsiteFee}
                onChange={(e) => setMonthlyWebsiteFee(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Module Selection (Service vs Shop) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Select Client Business Engine *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveModule('service')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  activeModule === 'service'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-xs'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-xs text-white">Service Engine</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Leads pipeline, quotes, invoices, and automated follow-ups.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveModule('shop')}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  activeModule === 'shop'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-xs'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-xs text-white">Shop Engine</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Orders, product stock, customers, abandoned carts, and discounts.
                </div>
              </button>
            </div>
          </div>

          {/* Brand Accent Color */}
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1.5">
              Client Brand Accent Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBrandAccentHex(color)}
                  className={`w-7 h-7 rounded-lg transition-transform ${
                    brandAccentHex === color ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-[11px] font-mono text-slate-400 ml-2">
                {brandAccentHex}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              Provision & Launch Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
