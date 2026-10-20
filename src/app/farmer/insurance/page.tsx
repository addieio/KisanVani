'use client';

import React from 'react';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Volume2, 
  Download, 
  Award,
  Sparkles 
} from 'lucide-react';

export default function FarmerInsurancePage() {
  const { insuranceClaimStatus, fileInsuranceClaim, t, speak, lang } = useKisan();

  const handleClaim = () => {
    fileInsuranceClaim();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#132A1C]">
            {t.insuranceTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {t.insuranceSubtitle}
          </p>
        </div>
        <button
          onClick={() =>
            speak(
              `${t.insuranceTitle}। 90 दिनों के सेंसर केयर प्रमाण के आधार पर एक लाल बटन दबाकर 48 घंटे में बीमा स्वीकृति पाएं।`
            )
          }
          className="p-3 bg-white rounded-2xl text-emerald-800 border border-gray-200 shadow-sm"
          aria-label={t.listen}
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Insurance Status Card */}
      {insuranceClaimStatus === 'NONE' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-[#132A1C]">
              फसल नुकसान का तत्काल दावा
            </h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed max-w-xs mx-auto">
              ओलावृष्टि, अत्यधिक वर्षा या गुप्त रोग से हुए नुकसान पर बीमा कंपनी को किसी भौतिक निरीक्षण की आवश्यकता नहीं है। आपका ईएसपी32 सेंसर डेटा ही ठोस सबूत है।
            </p>
          </div>

          {/* 90-Day Proof of Care Telemetry Highlights */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-left space-y-2 text-xs">
            <div className="font-bold text-[#0B7A3B] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>सेंसर केयर प्रमाण डिजिटल ऑडिट (Proof of Care)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 pt-1">
              <div>✓ 2,160 घंटे मिट्टी टेलीमेट्री</div>
              <div>✓ 142 स्वचालित सिंचाई चक्र</div>
              <div>✓ 12 जीपीएस-टैग्ड पत्ती फोटो</div>
              <div>✓ ओपन-मेटिओ मौसम रिकॉर्ड</div>
            </div>
          </div>

          {/* Single Red Button: बीमा दावा (≥74px) */}
          <button
            onClick={handleClaim}
            className="w-full h-[74px] bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all alert-ring-pulse"
          >
            <ShieldAlert className="w-7 h-7" />
            <span>{t.claimButton} (एक-क्लिक)</span>
          </button>
        </div>
      )}

      {/* Pending Fast-Track Review State */}
      {insuranceClaimStatus === 'PENDING' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-400 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto animate-spin">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-xl text-gray-900">
            सेंसर डेटा का मिलान हो रहा है...
          </h3>
          <p className="text-xs text-gray-600">
            90-दिवसीय मिट्टी नमी और तापमान रिकॉर्ड बीमा सर्वर को भेजा जा रहा है।
          </p>
        </div>
      )}

      {/* Approved State */}
      {insuranceClaimStatus === 'FAST_TRACK_APPROVED' && (
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 border-2 border-emerald-500 shadow-xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0B7A3B] flex items-center justify-center mx-auto">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#0B7A3B] text-white text-xs font-black">
              48 घंटे फास्ट-ट्रैक स्वीकृत ✓
            </span>
            <h3 className="text-2xl font-black text-[#132A1C] mt-2">
              दावा राशि: ₹48,000 स्वीकृत!
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              क्लेम संदर्भ संख्या: PMFBY-KV-2026-SONIPAT-998
            </p>
          </div>

          <div className="p-4 bg-emerald-100/60 rounded-2xl text-xs text-emerald-900 text-left font-medium">
            सेंसर रिपोर्ट ने सिद्ध किया कि किसान रामेश जी ने नियमित पानी व खाद दिया तथा नुकसान मौसम की अचानक मार से हुआ। राशि सीधे बैंक खाते में प्रेषित की गई है।
          </div>

          {/* Download Proof PDF button */}
          <button
            onClick={() => {
              speak('सेंसर केयर प्रमाण पीडीएफ डाउनलोड हो रहा है');
              alert('Proof-of-Care PDF: PMFBY-KV-SONIPAT.pdf Generated & Downloaded');
            }}
            className="w-full h-[64px] bg-[#0B7A3B] hover:bg-[#064E26] text-white rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>केयर प्रमाण PDF रिपोर्ट डाउनलोड करें</span>
          </button>
        </div>
      )}

      {/* Bottom Nav */}
      <FarmerBottomNav />

    </div>
  );
}
