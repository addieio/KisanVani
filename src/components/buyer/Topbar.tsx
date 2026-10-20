'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Building2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Clock,
  LogOut,
  UserCheck,
  QrCode,
  ScanLine
} from 'lucide-react';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenGateScanner: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  onOpenGateScanner,
  onNavigateTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Handover Passcode Active',
      desc: 'Order #ORD-8821 (400kg Plum Tomatoes) is ready at Dock 2.',
      time: '5m ago',
      unread: true,
      type: 'urgent',
    },
    {
      id: 2,
      title: 'New Grade-A Harvest Live',
      desc: 'Anita Devi listed 200kg Mountain Broccoli in Najafgarh.',
      time: '24m ago',
      unread: true,
      type: 'harvest',
    },
    {
      id: 3,
      title: 'Bid Outbid Notice',
      desc: 'Another buyer bid ₹56/kg for Red Bell Peppers in Sonipat.',
      time: '1h ago',
      unread: false,
      type: 'bid',
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
      {/* Left: Hamburger & Search */}
      <div className="flex flex-1 items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, farmers, or orders (e.g. Sonipat, Broccoli, #ORD-8821)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-4 pl-10 text-sm font-medium text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#0B7A3B] focus:bg-white focus:ring-2 focus:ring-[#0B7A3B]/10 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Scan QR Gate Button, Market Pill, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Prominent QR / Passcode Handover Button */}
        <button
          onClick={onOpenGateScanner}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0B7A3B] to-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-900/20 transition-all hover:from-[#096330] hover:to-emerald-800 active:scale-95 cursor-pointer"
          title="Scan QR code or enter driver passcode for dock delivery handover"
        >
          <ScanLine className="h-4 w-4 stroke-[2.2]" />
          <span className="hidden md:inline">Scan Gate Delivery</span>
          <span className="md:hidden">Scan QR</span>
        </button>

        {/* Realtime Hub Status (Desktop) */}
        <div
          onClick={() => alert('Delhi NCR Mandi Hub operates 24/7 with continuous IoT cold chain intake.')}
          className="hidden items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-[#0B7A3B] xl:flex cursor-pointer hover:bg-emerald-100/70 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0B7A3B]"></span>
          </span>
          <span>Delhi NCR Hub: Open</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF8A00] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF8A00]"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-[#0B7A3B] hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="mt-3 divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.title.includes('Passcode')) {
                        setShowNotifications(false);
                        onOpenGateScanner();
                      }
                    }}
                    className={`py-2.5 first:pt-1 last:pb-1 cursor-pointer hover:bg-slate-50 px-1 rounded transition-colors ${
                      n.unread ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <span className="shrink-0 text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-left transition-all hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-[#0B7A3B] to-emerald-600 font-bold text-white shadow-xs">
              FB
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">FreshBite Restaurant</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-[#0B7A3B]" />
              </div>
              <p className="text-[11px] font-medium text-slate-400">Connaught Place, Delhi</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-bold text-slate-900">FreshBite Hospitality Pvt Ltd</p>
                <p className="text-[11px] text-slate-500">GSTIN: 07AAACF8892L1ZV</p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#0B7A3B]">
                  <UserCheck className="h-3 w-3" /> Tier 1 Enterprise Buyer
                </div>
              </div>

              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateTab?.('settings');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span>Buyer Wallet & Settings</span>
                  <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateTab?.('orders');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span>Tax Invoices & Orders</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Session secure. FreshBite Restaurant enterprise account active.');
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <span>Account Details</span>
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
