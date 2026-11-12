import React from 'react';
import { useAltivio } from '../context/AltivioContext';
import { TenantTab } from '../types/altivio';
import { 
  DollarSign, 
  TrendingUp, 
  Mail, 
  GitBranch, 
  FileText, 
  Receipt, 
  Clock, 
  ShoppingCart, 
  Package, 
  Users, 
  RotateCcw, 
  Tag, 
  Edit3, 
  Activity, 
  Award, 
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';

export const AltivioSidebar: React.FC = () => {
  const { activeTenant, activeTab, setActiveTab } = useAltivio();

  const isService = activeTenant.activeModule === 'service';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Client Brand & Website Header */}
      <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white font-mono shadow-xs shrink-0"
            style={{ backgroundColor: activeTenant.brandAccentHex || '#6366f1' }}
          >
            {activeTenant.logoInitials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate font-display">
              {activeTenant.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Powered by Altivio
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {/* Section 1: Revenue Proof & Audience (Base Features) */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Revenue & Proof
          </div>
          <button
            onClick={() => setActiveTab('proof-overview')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'proof-overview'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className={`w-4 h-4 ${activeTab === 'proof-overview' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>What Website Earned</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Proof
            </span>
          </button>

          <button
            onClick={() => setActiveTab('traffic')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'traffic'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className={`w-4 h-4 ${activeTab === 'traffic' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Google Analytics</span>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
              GA4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'enquiries'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className={`w-4 h-4 ${activeTab === 'enquiries' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Enquiries Inbox</span>
            </div>
            {activeTenant.enquiries.length > 0 && (
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                {activeTenant.enquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'insights'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className={`w-4 h-4 ${activeTab === 'insights' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>Weekly Insights</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/50">
              Gemini
            </span>
          </button>
        </div>

        {/* Section 2: Business Module (Service vs Shop) */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400 flex items-center justify-between">
            <span>{isService ? 'Service Engine' : 'Shop Engine'}</span>
            <span className="text-[9px] font-mono text-indigo-400 lowercase">module active</span>
          </div>

          {isService ? (
            /* SERVICE BUSINESS MODULE */
            <>
              <button
                onClick={() => setActiveTab('leads-pipeline')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'leads-pipeline'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <GitBranch className={`w-4 h-4 ${activeTab === 'leads-pipeline' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>Leads Pipeline</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {activeTenant.serviceData?.leads.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('quotes')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'quotes'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === 'quotes' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Quotes & Proposals</span>
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'invoices'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <Receipt className={`w-4 h-4 ${activeTab === 'invoices' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Invoices & Payments</span>
              </button>

              <button
                onClick={() => setActiveTab('follow-ups')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'follow-ups'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <Clock className={`w-4 h-4 ${activeTab === 'follow-ups' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Automated Follow-ups</span>
              </button>
            </>
          ) : (
            /* SHOP / E-COMMERCE MODULE */
            <>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingCart className={`w-4 h-4 ${activeTab === 'orders' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>Orders</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {activeTenant.shopData?.orders.length || 0}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'products'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Products & Stock</span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'customers'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <Users className={`w-4 h-4 ${activeTab === 'customers' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Customers & LTV</span>
              </button>

              <button
                onClick={() => setActiveTab('abandoned-carts')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'abandoned-carts'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <RotateCcw className={`w-4 h-4 ${activeTab === 'abandoned-carts' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Abandoned Carts</span>
              </button>

              <button
                onClick={() => setActiveTab('discounts')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                  activeTab === 'discounts'
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                <Tag className={`w-4 h-4 ${activeTab === 'discounts' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>Discounts & Promos</span>
              </button>
            </>
          )}
        </div>

        {/* Section 3: Website Controls & Base Utilities */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            Website & Studio
          </div>

          <button
            onClick={() => setActiveTab('content-editor')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'content-editor'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <Edit3 className={`w-4 h-4 ${activeTab === 'content-editor' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span>Content Quick Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('health-vitals')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'health-vitals'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className={`w-4 h-4 ${activeTab === 'health-vitals' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Speed & Vitals</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              {activeTenant.websiteHealth.speedScore}/100
            </span>
          </button>

          <button
            onClick={() => setActiveTab('proof-reports')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'proof-reports'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <Award className={`w-4 h-4 ${activeTab === 'proof-reports' ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span>Monthly Proof Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('altivio-support')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
              activeTab === 'altivio-support'
                ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Headphones className={`w-4 h-4 ${activeTab === 'altivio-support' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>Altivio Support</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-400">Active</span>
          </button>
        </div>
      </div>

      {/* Footer: Live Website ROI Proof Card */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 text-xs">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400 font-medium">Website ROI Proof</span>
          <span className="text-emerald-400 font-mono font-bold">
            {activeTenant.revenueProof.roiMultiplier.toFixed(1)}x
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          ${activeTenant.revenueProof.monthlyRevenue.toLocaleString()} generated vs ${activeTenant.monthlyWebsiteFee}/mo fee.
        </p>
      </div>
    </aside>
  );
};
