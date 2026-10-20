'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import confetti from 'canvas-confetti';
import { 
  Sprout, 
  Volume2, 
  Lock, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  PieChart
} from 'lucide-react';

export default function FarmerPlanPage() {
  const { speak, activeGuideId, setActiveGuideId } = useKisan();
  const [lockedSlots, setLockedSlots] = useState<number>(0);
  const [isSlotLocked, setIsSlotLocked] = useState<boolean>(false);

  const handleLockSlot = () => {
    setActiveGuideId(null);
    setIsSlotLocked(true);
    setLockedSlots(prev => prev + 1);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    speak('बधाई हो! 0.5 एकड़ शिमला मिर्च का कोटा सफलतापूर्वक लॉक कर दिया गया है। फ्रेशबाइट का ₹60 प्रति किलो का अनुबंध सुरक्षित है।');
  };

  const triggerVoiceGuide = () => {
    speak('भाव क्रैश से बचने के लिए शिमला मिर्च का 0.5 एकड़ कोटा पक्का करें। इसके लिए नीचे दिया गया यह हरा स्लॉट लॉक बटन दबाएं।', 'lock-slot-btn');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      
      {/* Header Card with Audio Voiceover Pill */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] relative overflow-hidden flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">मंडी डेटा अपडेट: आज सुबह 7:00 बजे</span>
          </div>
          <button
            onClick={triggerVoiceGuide}
            className="px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all border border-emerald-200 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>निर्देश सुनें</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-[#1D1D1F] tracking-tight">क्या उगाएं?</h1>
          <p className="text-xs text-stone-500">
            बाजार मांग व कोटा नियंत्रण • Anti-Glut Quota
          </p>
        </div>
      </div>

      {/* Anti-Oversupply Quota Meter Section */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                मंडी कोटा स्थिति (Cobweb सुरक्षा)
              </h2>
              <span className="text-[11px] text-stone-500">अधिक उपज = भारी घाटा रोको तंत्र</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-bold">
            3 फसलें
          </span>
        </div>

        {/* Warning Banner */}
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
          <span className="text-red-600 font-bold text-sm shrink-0">⚠️</span>
          <span>
            सावधान: जो फसल हर कोई बो रहा है, वह मंडी में औंधे मुंह गिरेगी। कोटा देखकर ही बीज चुनें!
          </span>
        </div>

        {/* Crop 1: Hybrid Tomato (Locked 100%) */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-red-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍅</span>
              <div>
                <span className="font-bold text-stone-900 text-sm block">हाइब्रिड टमाटर</span>
                <span className="text-[11px] text-stone-500">120 किसान बो चुके • ओवरसप्लाई</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> कोटा 100% फुल
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full w-full" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-red-600 font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> भाव गिरेगा: ₹3/kg अनुमान
            </span>
            <span className="text-stone-500 font-bold">सख्त मनाही ⛔</span>
          </div>
        </div>

        {/* Crop 2: Bell Pepper (Open 82%) */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-300 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🫑</span>
              <div>
                <span className="font-bold text-stone-900 text-sm block">लाल/पीली शिमला मिर्च</span>
                <span className="text-[11px] text-stone-500">FreshBite अनुबंध • उच्च मांग</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 82% खुला कोटा
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[18%]" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> तयशुदा दाम: ₹60/kg
            </span>
            <span className="text-emerald-700 font-bold">अग्रिम बुकिंग चालू 🟢</span>
          </div>
        </div>

        {/* Crop 3: Broccoli (Open 90%) */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥦</span>
              <div>
                <span className="font-bold text-stone-900 text-sm block">विदेशी ब्रोकोली</span>
                <span className="text-[11px] text-stone-500">आजादपुर सुपरमार्केट मांग</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 90% खुला कोटा
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[10%]" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> तयशुदा दाम: ₹75/kg
            </span>
            <span className="text-stone-500 font-semibold">उपलब्ध</span>
          </div>
        </div>

      </div>

      {/* 90/10 Land Allocation Model */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-stone-900">90/10 भूमि आवंटन मॉडल</h3>
          </div>
          <span className="text-xs text-stone-500 font-semibold">4 एकड़ जोत</span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          ९०% जमीन पर पारंपरिक गेहूं/चना सुरक्षित रखें, केवल १०% (०.५ एकड़) पर अनुबंध वाली शिमला मिर्च उगाकर 25% अतिरिक्त शुद्ध लाभ कमाएं।
        </p>

        {/* Visual Allocation Bar */}
        <div className="w-full h-5 rounded-full bg-stone-200 overflow-hidden flex">
          <div className="h-full bg-stone-400 w-[90%] flex items-center justify-center text-[10px] text-white font-bold">
            90% गेहूं/चना (सुरक्षित)
          </div>
          <div className="h-full bg-emerald-500 w-[10%] flex items-center justify-center text-[10px] text-white font-bold">
            10%
          </div>
        </div>
      </div>

      {/* Comic-Style Pictorial Action Steps */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <h3 className="font-bold text-base text-stone-900">
          चित्रमय कदम (Comic Blueprint)
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center">
            <span className="text-2xl mb-1">🧪</span>
            <span className="font-bold text-stone-900">कदम 1</span>
            <span className="text-[10px] text-stone-500 mt-0.5">pH 6.5 व गोबर खाद</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center">
            <span className="text-2xl mb-1">🛖</span>
            <span className="font-bold text-stone-900">कदम 2</span>
            <span className="text-[10px] text-stone-500 mt-0.5">50% शेड-नेट व मल्च</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center">
            <span className="text-2xl mb-1">💧</span>
            <span className="font-bold text-stone-900">कदम 3</span>
            <span className="text-[10px] text-stone-500 mt-0.5">ड्रिप फर्टिगेशन समय</span>
          </div>
        </div>

        {/* Action Trigger: Lock Slot Button (>=72px) with Highlight Glow */}
        <div className="relative">
          {activeGuideId === 'lock-slot-btn' && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 guide-badge-bounce">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-lg">
                👉 यह दबाएं (Lock Quota)
              </span>
            </div>
          )}
          <button
            id="lock-slot-btn"
            onClick={handleLockSlot}
            disabled={isSlotLocked}
            className={`w-full h-[72px] rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 transition-all ${
              activeGuideId === 'lock-slot-btn'
                ? 'guide-glow bg-emerald-500 text-white shadow-2xl scale-[1.02]'
                : isSlotLocked
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md active:scale-95'
            }`}
          >
            {isSlotLocked ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>✅ 0.5 एकड़ कोटा लॉक हो गया</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>✅ 0.5 एकड़ स्लॉट लॉक करें (Lock Quota)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
