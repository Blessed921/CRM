/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import {
  DollarSign,
  BarChart3,
  Mail,
  Sparkles,
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
  X,
} from 'lucide-react';

interface AltivioSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AltivioSidebar: React.FC<AltivioSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { tenant } = useTenant();
  const basePath = `/app/${tenant.slug}`;
  const isService = tenant.activeModule === 'service';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors whitespace-nowrap ${
      isActive
        ? 'font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/70'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white border border-transparent'
    }`;

  const activeNavStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? { backgroundColor: 'var(--brand-accent-soft)' } : undefined;

  const sidebarContent = (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Lockup */}
      <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white font-mono shrink-0"
            style={{ backgroundColor: tenant.brandAccentHex || '#4f46e5' }}
          >
            {tenant.logoInitials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate font-display">
              {tenant.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Powered by Altivio
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {/* Section 1: Revenue Proof & Audience */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Revenue &amp; Proof
          </div>

          <NavLink
            to={`${basePath}/overview`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <DollarSign className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate">What Website Earned</span>
            </div>
          </NavLink>

          <NavLink
            to={`${basePath}/analytics`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <BarChart3 className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="truncate">Google Analytics</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">GA4</span>
          </NavLink>

          <NavLink
            to={`${basePath}/enquiries`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
              <span className="truncate">Enquiries Inbox</span>
            </div>
            <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {tenant.enquiries.length}
            </span>
          </NavLink>

          <NavLink
            to={`${basePath}/insights`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate">Weekly Insights</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-300">AI</span>
          </NavLink>
        </div>

        {/* Section 2: Active Business Engine */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{isService ? 'Service Engine' : 'Shop Engine'}</span>
          </div>

          {isService ? (
            <>
              <NavLink
                to={`${basePath}/service/leads`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GitBranch className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Leads Pipeline</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {tenant.serviceData?.leads.length || 0}
                </span>
              </NavLink>

              <NavLink
                to={`${basePath}/service/quotes`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Quotes &amp; Proposals</span>
                </div>
              </NavLink>

              <NavLink
                to={`${basePath}/service/invoices`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Receipt className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Invoices &amp; Payments</span>
                </div>
              </NavLink>

              <NavLink
                to={`${basePath}/service/follow-ups`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Automated Follow-ups</span>
                </div>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={`${basePath}/shop/orders`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShoppingCart className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Orders</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {tenant.shopData?.orders.length || 0}
                </span>
              </NavLink>

              <NavLink
                to={`${basePath}/shop/products`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Package className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Products &amp; Stock</span>
                </div>
              </NavLink>

              <NavLink
                to={`${basePath}/shop/customers`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Users className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Customers &amp; LTV</span>
                </div>
              </NavLink>

              <NavLink
                to={`${basePath}/shop/abandoned-carts`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <RotateCcw className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Abandoned Carts</span>
                </div>
              </NavLink>

              <NavLink
                to={`${basePath}/shop/discounts`}
                onClick={onCloseMobile}
                className={navLinkClass}
                style={activeNavStyle}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Tag className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="truncate">Discounts &amp; Promos</span>
                </div>
              </NavLink>
            </>
          )}
        </div>

        {/* Section 3: Website & Studio */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Website &amp; Studio
          </div>

          <NavLink
            to={`${basePath}/content`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Edit3 className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
              <span className="truncate">Content Quick Editor</span>
            </div>
          </NavLink>

          <NavLink
            to={`${basePath}/health`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Activity className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate">Speed &amp; Vitals</span>
            </div>
            <span className="text-[11px] font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {tenant.websiteHealth.speedScore}/100
            </span>
          </NavLink>

          <NavLink
            to={`${basePath}/reports`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Award className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
              <span className="truncate">Monthly Proof Reports</span>
            </div>
          </NavLink>

          <NavLink
            to={`${basePath}/support`}
            onClick={onCloseMobile}
            className={navLinkClass}
            style={activeNavStyle}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Headphones className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
              <span className="truncate">Altivio Support</span>
            </div>
          </NavLink>
        </div>
      </nav>

      {/* Footer: Website ROI Summary */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs shrink-0">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Website ROI Proof</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold tabular-nums">
            {tenant.revenueProof.roiMultiplier.toFixed(1)}x
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight font-mono tabular-nums">
          ${tenant.revenueProof.monthlyRevenue.toLocaleString()} vs ${tenant.monthlyWebsiteFee}/mo
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <div className="hidden lg:block h-full shrink-0">{sidebarContent}</div>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
