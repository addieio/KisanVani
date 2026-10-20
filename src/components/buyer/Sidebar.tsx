'use client';

import React from 'react';
import {
  Sprout,
  LayoutDashboard,
  Wheat,
  ShoppingBag,
  Truck,
  Users2,
  Settings,
  ShieldCheck,
  ChevronRight,
  X,
  HelpCircle,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  ordersCount: number;
  escrowBalance: number;
  onTopUpEscrow?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  ordersCount = 4,
  escrowBalance = 450000,
  onTopUpEscrow,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'harvest', label: 'Live Harvest', icon: Wheat, badge: '3 Lots' },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: `${ordersCount}` },
    { id: 'logistics', label: 'Logistics', icon: Truck, badge: '3 Rings' },
    { id: 'farmers', label: 'Farmers', icon: Users2, badge: '4 Verified' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B7A3B] text-white shadow-md shadow-emerald-900/20">
                <Sprout className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">
                    Mandi-Direct
                  </span>
                  <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-[#0B7A3B]">
                    PRO
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">by KisanVaani Agritech</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Context Pill */}
          <div className="mx-4 mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                ESCROW BALANCE
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#0B7A3B]">
                <ShieldCheck className="h-3.5 w-3.5" /> 100% Insured
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">
                ₹{escrowBalance.toLocaleString('en-IN')}
              </span>
              <button
                onClick={onTopUpEscrow}
                className="flex items-center gap-1 rounded bg-[#0B7A3B] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#096330] cursor-pointer"
              >
                <PlusCircle className="h-3 w-3" /> Top Up
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1 px-3">
            <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#EBF8F0] text-[#0B7A3B] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#0B7A3B]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'bg-[#0B7A3B] text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#0B7A3B]" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Support & Status */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50/40 p-3.5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B7A3B]/10 text-[#0B7A3B]">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">Direct Farmer Desk</p>
                <p className="mt-0.5 text-[11px] text-slate-600">
                  Mandi Officer: <span className="font-semibold text-slate-800">+91 1800-KISAN</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-slate-600">
            <span>Mandi Node: Sonipat Hub v2.4</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-500" />
              Live Feed
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
