'use client';

import React, { useState } from 'react';
import {
  Truck,
  Leaf,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  MapPin,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { LOGISTICS_RINGS, OrderItem, LogisticsRing } from '@/data/data';

interface LogisticsCalculatorProps {
  selectedOrder?: OrderItem | null;
  onBookFreight: (ring: LogisticsRing, weightKg: number) => void;
}

export const LogisticsCalculator: React.FC<LogisticsCalculatorProps> = ({
  selectedOrder,
  onBookFreight,
}) => {
  const [selectedRingId, setSelectedRingId] = useState<number>(2); // Default to Recommended Ring 2
  const [customWeight, setCustomWeight] = useState<number>(
    selectedOrder ? selectedOrder.quantityKg : 500
  );

  const activeRing =
    LOGISTICS_RINGS.find((r) => r.ringId === selectedRingId) || LOGISTICS_RINGS[1];

  const effectiveWeight = selectedOrder ? selectedOrder.quantityKg : customWeight;
  const calculatedCost = Math.round(effectiveWeight * activeRing.ratePerKg);
  const traditionalMandiCost = Math.round(effectiveWeight * 6.5); // Standard mandi freight
  const savedAmount = traditionalMandiCost - calculatedCost;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#0B7A3B]">
              <Truck className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              3-Ring Logistics Freight Engine
            </h2>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-[#0B7A3B]">
              Real-Time Route Telematics
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Automated cluster aggregation reduces cold chain deadhead kilometers by up to 68%.
          </p>
        </div>

        {/* Selected Order Context / Weight Adjustment */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedOrder ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs">
              <span className="font-semibold text-slate-600">Active Order: </span>
              <span className="font-bold text-slate-900">{selectedOrder.id}</span>
              <span className="ml-1 text-[#0B7A3B]">({selectedOrder.quantityKg} kg)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-600">Payload:</span>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono font-bold text-slate-900">
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="50"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Math.max(1, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right focus:outline-none"
                />
                <span className="text-slate-500">kg</span>
              </div>
            </div>
          )}

          {/* Quick Weight Chips */}
          <div className="flex items-center gap-1 text-[11px]">
            {[250, 500, 1000, 2000].map((w) => (
              <button
                type="button"
                key={w}
                onClick={() => setCustomWeight(w)}
                className={`rounded-md px-2 py-1 font-semibold transition-colors cursor-pointer ${
                  effectiveWeight === w
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {w}kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid: 3 Rings Cards + Cost Simulator Breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* The 3 Logistics Rings */}
        <div className="space-y-3.5 lg:col-span-2">
          {LOGISTICS_RINGS.map((ring) => {
            const isSelected = ring.ringId === selectedRingId;
            const isRecommended = ring.isRecommended;

            return (
              <div
                key={ring.ringId}
                onClick={() => setSelectedRingId(ring.ringId)}
                className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-4.5 transition-all duration-200 sm:flex-row sm:items-center ${
                  isSelected
                    ? 'border-[#0B7A3B] bg-emerald-50/30 shadow-md ring-2 ring-[#0B7A3B]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                {/* Left Ring Info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold transition-colors ${
                      isSelected
                        ? 'bg-[#0B7A3B] text-white shadow-xs'
                        : isRecommended
                        ? 'bg-emerald-100 text-[#0B7A3B]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    R{ring.ringId}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">{ring.title}</h3>
                      {isRecommended && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#0B7A3B] px-2 py-0.5 text-[10px] font-bold text-white">
                          <Sparkles className="h-2.5 w-2.5" />
                          Recommended
                        </span>
                      )}
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-600">
                        {ring.distanceRange}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">{ring.description}</p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        ETA: <strong className="text-slate-800">{ring.leadTimeHours}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                        {ring.co2SavingsPercent}% CO₂ Reduction
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Rate & Checkmark */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 sm:mt-0 sm:border-0 sm:pt-0 sm:flex-col sm:items-end">
                  <div className="text-right">
                    <span className="text-[11px] font-medium text-slate-500">Freight Rate</span>
                    <div className="text-xl font-bold text-slate-900">
                      ₹{ring.ratePerKg.toFixed(1)}
                      <span className="text-xs font-normal text-slate-500">/kg</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#0B7A3B]">
                    {isSelected ? (
                      <span className="flex items-center gap-1 rounded-md bg-[#0B7A3B] px-2 py-0.5 text-white text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Selected
                      </span>
                    ) : (
                      <span className="text-slate-400 hover:text-slate-600">Click to Select</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cost Breakdown & Direct Impact Widget (Right Column) */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <span className="text-xs font-bold text-slate-600 uppercase">Freight Calculation</span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-[#0B7A3B]">
                {activeRing.title.split(':')[0]}
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Quantity:</span>
                <span className="font-mono font-bold text-slate-900">{effectiveWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate Tier:</span>
                <span className="font-mono font-bold text-slate-900">₹{activeRing.ratePerKg}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Refrigerated EV Telemetry:</span>
                <span className="font-semibold text-emerald-700">Active (IoT Logged)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Standard Mandi Freight:</span>
                <span className="font-mono line-through text-slate-400">
                  ₹{traditionalMandiCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Total Freight Callout */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Estimated Delivery Total</span>
              <div className="mt-1 text-3xl font-bold tracking-tight text-[#0B7A3B]">
                ₹{calculatedCost.toLocaleString('en-IN')}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Doorstep delivery to Cold Room</p>
            </div>

            {/* Direct Savings Callout */}
            <div className="mt-3.5 flex items-center gap-2.5 rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 text-xs text-amber-900">
              <TrendingDown className="h-5 w-5 shrink-0 text-[#FF8A00]" />
              <div>
                <span className="font-bold">Save ₹{savedAmount.toLocaleString('en-IN')}</span> vs traditional wholesale mandi middlemen cartage!
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onBookFreight(activeRing, effectiveWeight)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-98 cursor-pointer"
          >
            <span>Lock Freight at ₹{activeRing.ratePerKg}/kg</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
