'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { VERIFIED_DEALER_SHARMA } from '@/lib/mock-data';
import { 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Volume2, 
  Radio, 
  ArrowLeft, 
  ShieldCheck 
} from 'lucide-react';

export default function FarmerRemedyPage() {
  const { activeAlerts, physicsEvaluation, t, speak, lang } = useKisan();
  const [leadLogged, setLeadLogged] = useState<boolean>(false);

  const alert = activeAlerts[0] || physicsEvaluation.alerts[0];
  const remedySteps = alert?.remedySteps || [];

  const handleCallDealer = () => {
    setLeadLogged(true);
    speak(
      lang === 'en'
        ? `Connecting to ${VERIFIED_DEALER_SHARMA.name}. Govt capped price is ₹150.`
        : `${VERIFIED_DEALER_SHARMA.name} से कॉल मिला रहे हैं। सरकारी एमआरपी ₹150 से ज्यादा न दें।`
    );
    window.open(`tel:${VERIFIED_DEALER_SHARMA.phone}`);
  };

  const handleNavigateDealer = () => {
    setLeadLogged(true);
    window.open(`https://maps.google.com/?q=${encodeURIComponent(VERIFIED_DEALER_SHARMA.address)}`, '_blank');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/farmer/alert"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#0B7A3B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>अलर्ट पर वापस जाएँ</span>
        </Link>
        <button
          onClick={() =>
            speak(
              remedySteps.length > 0
                ? `इलाज के 3 कदम। पहला: ${remedySteps[0].title.hi}। ${remedySteps[0].desc.hi}`
                : 'कोई उपचार आवश्यक नहीं है।'
            )
          }
          className="p-2.5 bg-white rounded-xl text-emerald-800 border border-gray-200"
          aria-label={t.listen}
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-black text-[#132A1C]">
          इलाज के 3 प्रमाणित कदम
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {alert ? alert.title.hi : 'पौधों के तुरंत बचाव का वैज्ञानिक तरीका'}
        </p>
      </div>

      {/* 3 Step-by-Step Cards */}
      <div className="space-y-3">
        {remedySteps.map((step) => (
          <div
            key={step.step}
            className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5EC] text-[#0B7A3B] font-black text-xl flex items-center justify-center flex-shrink-0">
              {step.step}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base text-[#132A1C] leading-snug">
                {step.title[lang] || step.title.hi}
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {step.desc[lang] || step.desc.hi}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Verified Agro-Dealer Card (F8 / F16 Lead Logging) */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-5 border-2 border-emerald-500 shadow-md">
        
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B7A3B] text-white text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            निकटतम प्रमाणित विक्रेता (Verified Dealer)
          </span>
          <span className="text-xs font-bold text-[#0B7A3B] font-mono">
            {VERIFIED_DEALER_SHARMA.distance_km} किमी दूर
          </span>
        </div>

        <h3 className="font-extrabold text-lg text-[#132A1C]">
          {VERIFIED_DEALER_SHARMA.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {VERIFIED_DEALER_SHARMA.address}
        </p>

        {/* Govt Price Cap Notice */}
        <div className="mt-3 p-2.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
          ⚠️ {VERIFIED_DEALER_SHARMA.mrp_cap_line[lang] || VERIFIED_DEALER_SHARMA.mrp_cap_line.hi}
        </div>

        {/* Dealer Actions (≥72px Touch Ergonomics) */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <button
            onClick={handleCallDealer}
            className="h-[72px] bg-[#0B7A3B] hover:bg-[#064E26] text-white font-extrabold text-base rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <PhoneCall className="w-6 h-6" />
            <span>दुकान पर कॉल करें</span>
          </button>

          <button
            onClick={handleNavigateDealer}
            className="h-[72px] bg-white hover:bg-gray-50 text-[#132A1C] border border-gray-300 font-extrabold text-base rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Navigation className="w-6 h-6 text-[#0B7A3B]" />
            <span>रास्ता दिखाओ</span>
          </button>
        </div>

        {leadLogged && (
          <div className="mt-2 text-center text-[11px] text-emerald-700 font-semibold">
            ✓ डीलर रेफरल और सहायता दर्ज की गई
          </div>
        )}

      </div>

      {/* Community Outbreak Ping Banner (F8) */}
      <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl animate-pulse">
          <Radio className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-purple-900">
            सामुदायिक सुरक्षा (Anonymous Community Ping)
          </div>
          <p className="text-[11px] text-gray-600 mt-0.5">
            आपके 2 किमी दायरे में 4 अन्य किसानों को संक्रमण से बचाव का गुप्त अलर्ट भेजा गया।
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <FarmerBottomNav />

    </div>
  );
}
