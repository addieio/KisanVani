'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKisan } from '@/context/KisanContext';
import { LanguageCode } from '@/lib/types';
import { 
  Sprout, 
  ShoppingBag, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  ShieldAlert,
  Building2
} from 'lucide-react';

export function HeaderSwitcher() {
  const pathname = usePathname();
  const { 
    lang, 
    setLang, 
    autoSpeak, 
    setAutoSpeak, 
    isOnline, 
    toggleSimulator, 
    isSimulatorOpen,
    activeAlerts 
  } = useKisan();

  const isFarmerRoute = pathname.startsWith('/farmer');
  const isBuyerRoute = pathname.startsWith('/buyer');
  const isGovtRoute = pathname.startsWith('/govt');

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hi', label: 'हिंदी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Brand & Mode Switcher */}
        <div className="flex items-center gap-3">
          <Link 
            href="/farmer" 
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0B7A3B] text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:bg-[#064E26] transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-[#132A1C] leading-none tracking-tight">
                  किसान<span className="text-[#0B7A3B]">वाणी</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#0B7A3B]">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">KisanVaani · Edge & Mandi</p>
            </div>
          </Link>

          {/* Role Switcher Pill Box */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200/70">
            <Link
              href="/farmer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isFarmerRoute
                  ? 'bg-white text-[#0B7A3B] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>किसान PWA</span>
            </Link>

            <Link
              href="/buyer"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isBuyerRoute
                  ? 'bg-[#0B7A3B] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>मंडी-Direct</span>
            </Link>

            <Link
              href="/govt"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isGovtRoute
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>Govt Heatmap 🏛️</span>
            </Link>
          </div>
        </div>

        {/* Right Controls: Simulator Toggle, Language Switcher, Audio, Offline Pill */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          
          {/* Hardware Simulator Toggle (Hidden on Farmer screens for pure simplicity) */}
          {!isFarmerRoute && (
            <button
              onClick={toggleSimulator}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                isSimulatorOpen
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="ESP32-S3 Hardware Stake Simulator"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden md:inline">हार्डवेयर सिम्युलेटर</span>
              <span className="md:hidden">सिम्युलेटर</span>
              {activeAlerts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-0.5" />
              )}
            </button>
          )}

          {/* 4-Pill Language Selector */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200/80">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  lang === code
                    ? 'bg-white text-[#0B7A3B] shadow-sm font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Auto-Speak / Voice Audio Narrator Toggle */}
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              autoSpeak
                ? 'bg-emerald-100 text-[#0B7A3B] border-emerald-200'
                : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}
            title={autoSpeak ? 'आवाज चालू है (Auto-voice ON)' : 'आवाज बंद है (Muted)'}
            aria-label="Toggle spoken audio"
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Permanent Offline / Online Status Pill */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">● ऑनलाइन</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span>● बिना इंटरनेट चालू</span>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
