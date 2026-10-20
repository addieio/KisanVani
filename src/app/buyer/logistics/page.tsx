'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { computeLogisticsRing } from '@/lib/logistics-engine';
import { 
  Truck, 
  MapPin, 
  ArrowLeft, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Fuel, 
  Calculator 
} from 'lucide-react';

export default function BuyerLogisticsPage() {
  const { t, lang, speak } = useKisan();
  const [distanceKm, setDistanceKm] = useState<number>(45);
  const [cargoWeightKg, setCargoWeightKg] = useState<number>(500);

  const ringInfo = computeLogisticsRing(distanceKm);
  const totalFreight = Math.round(cargoWeightKg * ringInfo.costPerKg);
  const standardMarketFreight = Math.round(cargoWeightKg * 3.80);
  const totalSavings = Math.max(0, standardMarketFreight - totalFreight);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          href="/buyer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#0B7A3B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मंडी-डायरेक्ट पोर्टल पर वापस जाएँ</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#132A1C] flex items-center gap-2">
          <Truck className="w-7 h-7 text-[#0B7A3B]" />
          <span>{t.smartLogistics}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          खेत की दूरी के आधार पर सबसे किफायती क्लस्टर व वापसी ट्रकों का स्वचालित रूटिंग
        </p>
      </div>

      {/* Interactive Distance & Cargo Slider */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
        
        {/* Distance Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0B7A3B]" /> खेत से किचन/डार्क-स्टोर की दूरी:
            </span>
            <span className="font-mono font-black text-xl text-[#0B7A3B]">
              {distanceKm} किमी (km)
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="450"
            step="5"
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full accent-[#0B7A3B] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-1">
            <span>रिंग 1: लोकल (&lt;80 km)</span>
            <span>रिंग 2: क्लस्टर (80-300 km)</span>
            <span>रिंग 3: बैकहॉल (&gt;300 km)</span>
          </div>
        </div>

        {/* Cargo Weight Stepper */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">उपज की कुल मात्रा:</span>
          <div className="flex items-center gap-2">
            {[250, 500, 1000, 1500].map((w) => (
              <button
                key={w}
                onClick={() => setCargoWeightKg(w)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  cargoWeightKg === w
                    ? 'bg-[#0B7A3B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {w} kg
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Calculated Logistics Ring Result Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-3xl p-6 border-2 border-emerald-500 shadow-lg space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#0B7A3B] text-white text-xs font-black">
              रिंग {ringInfo.ring} सक्रिय
            </span>
            <h3 className="text-xl font-black text-[#132A1C] mt-1.5">
              {ringInfo.name[lang] || ringInfo.name.hi}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {ringInfo.description[lang] || ringInfo.description.hi}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">भाड़ा दर</div>
            <div className="font-mono font-black text-3xl text-[#0B7A3B]">
              ₹{ringInfo.costPerKg.toFixed(2)}
              <span className="text-sm font-normal text-gray-500"> / किग्रा</span>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-[11px] text-gray-500">अनुमानित डिलीवरी समय</div>
            <div className="font-mono font-extrabold text-lg text-gray-900 mt-1 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              {ringInfo.transitTimeHrs} घंटे
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-[11px] text-gray-500">कुल ढुलाई खर्च</div>
            <div className="font-mono font-black text-lg text-[#0B7A3B] mt-1">
              ₹{totalFreight.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-[11px] text-gray-500">मंडी आढ़त व भाड़ा बचत</div>
            <div className="font-mono font-black text-lg text-amber-600 mt-1 flex items-center justify-center gap-1">
              <TrendingDown className="w-4 h-4" />
              {ringInfo.savingsVsRegularPct}% बचत
            </div>
          </div>
        </div>

        {/* 3 Rings Explanatory Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className={`p-3 rounded-2xl border ${
            ringInfo.ring === 1 ? 'bg-emerald-100/70 border-emerald-400 font-bold' : 'bg-white border-gray-200 text-gray-500'
          }`}>
            <div className="text-[#0B7A3B]">रिंग 1 (&lt;80 किमी)</div>
            <div className="text-[11px] mt-0.5">सीधी डिलीवरी · ₹2.40/किग्रा</div>
          </div>

          <div className={`p-3 rounded-2xl border ${
            ringInfo.ring === 2 ? 'bg-emerald-100/70 border-emerald-400 font-bold' : 'bg-white border-gray-200 text-gray-500'
          }`}>
            <div className="text-amber-800">रिंग 2 (80-300 किमी)</div>
            <div className="text-[11px] mt-0.5">साझा क्लस्टर · ₹1.60/किग्रा</div>
          </div>

          <div className={`p-3 rounded-2xl border ${
            ringInfo.ring === 3 ? 'bg-emerald-100/70 border-emerald-400 font-bold' : 'bg-white border-gray-200 text-gray-500'
          }`}>
            <div className="text-purple-800">रिंग 3 (&gt;300 किमी)</div>
            <div className="text-[11px] mt-0.5">वापसी खाली ट्रक · ₹0.95/किग्रा</div>
          </div>
        </div>

      </div>

    </div>
  );
}
