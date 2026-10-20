'use client';

import React from 'react';
import {
  IndianRupee,
  PackageCheck,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { QUICK_STATS } from '@/data/data';

const iconMap: Record<string, React.ElementType> = {
  IndianRupee,
  PackageCheck,
  TrendingDown,
  Activity,
};

export const QuickStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {QUICK_STATS.map((stat, idx) => {
        const IconComponent = iconMap[stat.iconName] || Activity;
        const isSavings = stat.id === 'saved';
        const isHealth = stat.id === 'health';
        const isOrders = stat.id === 'orders';

        return (
          <div
            key={stat.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            {/* Top Accent glow strip on hover */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-transparent transition-colors group-hover:bg-[#0B7A3B]" />

            <div>
              {/* Header: Title and Icon */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {stat.title}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${
                    isSavings
                      ? 'bg-amber-50 text-[#FF8A00]'
                      : isHealth
                      ? 'bg-emerald-50 text-[#0B7A3B]'
                      : isOrders
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-emerald-50 text-[#0B7A3B]'
                  }`}
                >
                  <IconComponent className="h-5 w-5 stroke-[2.2]" />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {stat.value}
                </span>
                {stat.change && (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                      stat.id === 'spent'
                        ? 'bg-emerald-50 text-[#0B7A3B]'
                        : isSavings
                        ? 'bg-amber-100/70 text-amber-800'
                        : isHealth
                        ? 'bg-emerald-100 text-[#0B7A3B]'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {stat.id === 'spent' && <ArrowUpRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-medium text-slate-500">{stat.subtext}</span>
              {isHealth && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#0B7A3B]">
                  <Sparkles className="h-3 w-3" /> Live IoT
                </span>
              )}
              {isOrders && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                  <ShieldCheck className="h-3.5 w-3.5" /> Escrow Locked
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
