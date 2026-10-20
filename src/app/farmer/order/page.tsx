'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  CheckCircle2, 
  Store, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  KeyRound, 
  FileText, 
  Download,
  Share2,
  Users
} from 'lucide-react';

export default function FarmerOrderPage() {
  const { activeOrder, acceptOrder, t, speak, activeGuideId, setActiveGuideId } = useKisan();
  const pinCode = activeOrder.passcode || '4829';
  const formattedPin = pinCode.length === 4 ? pinCode.split('').join('-') : pinCode;
  const qrPayload = activeOrder.qr_payload || `KV-HMAC-2026:PIN-${pinCode}:ORDER-${activeOrder.id}:FARMER-RAMESH:AMT-${activeOrder.bid?.total || 24000}`;
  const buyerName = activeOrder.bid?.buyer_name || 'FreshBite रेस्टोरेंट चेन';
  const cropName = activeOrder.listing?.crop || 'देसी लाल टमाटर (Grade-A Tomato)';
  const cropRate = activeOrder.bid?.price_per_kg || 60;
  const totalAmount = activeOrder.bid?.total || (cropRate * (activeOrder.listing?.qty_kg || 400));
  const [hasDownloadedPdf, setHasDownloadedPdf] = useState<boolean>(false);

  const isAccepted = activeOrder.escrow_state === 'ACCEPTED' || activeOrder.escrow_state === 'IN_TRANSIT';

  const handleDownloadProof = () => {
    setActiveGuideId(null);
    setHasDownloadedPdf(true);
    confetti({ particleCount: 60, spread: 50 });
    speak('९०-दिवसीय डिजिटल सेंसर देखभाल प्रमाणपत्र तैयार है। यह पीएमएफबीवाई क्लेम को ४८ घंटे में पास कराएगा।');
  };

  const triggerVoiceGuide = () => {
    speak(`ड्राइवर को माल सौंपते समय यह 4 अंकों का पिन ${formattedPin} बताएं। इससे बिना इंटरनेट के पैसा सीधे खाते में आ जाएगा।`, 'offline-pin-box');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      
      {/* Top Audio Summary Card / Action Pill */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            इंटरनेट रहित सक्रिय सुरक्षा (Offline Secure)
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
            ऑफ़लाइन ऑर्डर, मंडी व बीमा
          </h1>
          <p className="text-xs text-stone-500">
            सत्यापित खरीदार व शुद्ध लाभ तुलना
          </p>
        </div>

        <button
          onClick={triggerVoiceGuide}
          className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all border border-emerald-200 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>निर्देश सुनें</span>
        </button>
      </div>

      {/* 1. Net-Profit Mandi Comparison Matrix (Apple Wallet Style Stack) */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h2 className="text-base font-bold text-stone-900">शुद्ध लाभ तुलना (True Profit)</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            भाड़ा घटाकर
          </span>
        </div>

        {/* Comparison Option 1: Direct B2B Farm-Gate (Best Deal) */}
        <div className="bg-emerald-50/70 border-2 border-emerald-400 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-extrabold text-stone-900 text-sm">{buyerName} सीधा खरीदार</span>
            </div>
            <span className="text-xl font-black text-emerald-700">₹{cropRate}<span className="text-xs font-normal text-stone-500">/किग्रा</span></span>
          </div>
          <p className="text-xs text-stone-600">खेत से सीधा उठान • 0 दलाली • 0 भाड़ा • कुल: ₹{totalAmount.toLocaleString('en-IN')}</p>
          <div className="flex items-center justify-between text-emerald-900 bg-emerald-100/80 px-3 py-1.5 rounded-xl text-xs font-bold">
            <span>शुद्ध बचत (Direct In Hand)</span>
            <span className="text-sm">₹{cropRate}/किग्रा (सर्वाधिक)</span>
          </div>
        </div>

        {/* Comparison Option 2: Distant Major Mandi (Indore / Azadpur) */}
        <div className="bg-stone-50 rounded-2xl p-3.5 space-y-1 border border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-stone-400" />
              <span className="font-bold text-stone-900 text-sm">आज़ादपुर बड़ी मंडी</span>
            </div>
            <span className="text-base font-bold text-stone-800">₹{Math.max(20, cropRate - 5)}<span className="text-xs text-stone-500">/किग्रा</span></span>
          </div>
          <p className="text-xs text-stone-500">मंडी भाव ₹{Math.max(20, cropRate - 5)} • ₹18/किग्रा भाड़ा व दलाली खर्च</p>
          <div className="flex items-center justify-between text-stone-700 bg-stone-200/60 px-3 py-1 rounded-xl text-xs font-semibold">
            <span>शुद्ध बचत (After Deductions)</span>
            <span>₹{Math.max(10, cropRate - 23)}/किग्रा</span>
          </div>
        </div>

        {/* Comparison Option 3: Local Mandi */}
        <div className="bg-stone-50 rounded-2xl p-3.5 space-y-1 border border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-stone-400" />
              <span className="font-bold text-stone-900 text-sm">स्थानीय मंडी (Local)</span>
            </div>
            <span className="text-base font-bold text-stone-800">₹{Math.max(15, cropRate - 18)}<span className="text-xs text-stone-500">/किग्रा</span></span>
          </div>
          <p className="text-xs text-stone-500">मंडी भाव ₹{Math.max(15, cropRate - 18)} • ₹8/किग्रा डीजल व पल्लेदारी</p>
          <div className="flex items-center justify-between text-stone-700 bg-stone-200/60 px-3 py-1 rounded-xl text-xs font-semibold">
            <span>शुद्ध बचत (After Deductions)</span>
            <span>₹{Math.max(8, cropRate - 26)}/किग्रा</span>
          </div>
        </div>
      </div>

      {/* 2. Direct Buyer Offer & Offline Cryptographic Pass */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              🥗
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700">सत्यापित B2B खरीदार</span>
              <h3 className="font-bold text-base text-stone-900 leading-tight">{buyerName}</h3>
              <p className="text-xs text-stone-500">{cropName} • ₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {isAccepted ? 'अनुबंध पक्का' : 'नया आर्डर'}
          </span>
        </div>

        {/* Cryptographic Offline QR Code Pass */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3">
          <div className="text-xs text-stone-600 font-bold">
            ऑफ़लाइन गेट पास (बिना इंटरनेट ड्राइवर स्कैन):
          </div>

          <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-sm mx-auto flex items-center justify-center border border-stone-200">
            <QRCodeSVG 
              value={qrPayload}
              size={136}
              level="H"
            />
          </div>

          {/* 4-Digit Spoken PIN Pill with Highlight Glow */}
          <div className="relative inline-block">
            {activeGuideId === 'offline-pin-box' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 guide-badge-bounce whitespace-nowrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-lg">
                  👉 ड्राइवर को यह बताएं
                </span>
              </div>
            )}
            <div 
              id="offline-pin-box"
              onClick={() => speak(`पिन है ${formattedPin}`)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xl tracking-widest transition-all cursor-pointer ${
                activeGuideId === 'offline-pin-box'
                  ? 'guide-glow bg-emerald-200 text-emerald-950 border-2 border-emerald-500 scale-105'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              <KeyRound className="w-5 h-5 text-emerald-700" />
              <span>पिन: {formattedPin}</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            ड्राइवर को यह क्यूआर या 4-अंकी कोड बताएं। बिना इंटरनेट के सत्यापन पूरा होगा।
          </p>
        </div>
      </div>

      {/* 3. Logistics Truck Pooling (Tata Ace Shared Route) */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-stone-900">टाटा ऐस साझा पूलिंग (Shared Route)</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            75% बचत
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          पिपलिया गांव के 4 पड़ोसी किसानों (सुरेश, धर्मेंद्र, महेश) का माल एक साथ उठाया जा रहा है। अलग गाड़ी करने के ₹1,600 के मुकाबले आपका हिस्सा मात्र ₹400 है।
        </p>

        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs font-bold text-stone-700">
          <span>साझा रूट: पिपलिया ➔ सोनीपत मंडी हब</span>
          <span className="text-emerald-700">बचत: ₹1,200</span>
        </div>
      </div>

      {/* 4. Sensor Health Certificate (Proof of Care for PMFBY Claims) */}
      <div className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-stone-900">देखभाल प्रमाण (Proof of Care)</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            PMFBY बीमा
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          ९० दिनों का निरंतर सेंसर रिकॉर्ड (सिंचाई, एनपीके, फफूंदनाशक लॉग)। प्राकृतिक आपदा की स्थिति में ४८ घंटे के भीतर सीधा बैंक ट्रांसफर सुनिश्चित करता है।
        </p>

        <button
          onClick={handleDownloadProof}
          className="w-full h-[64px] rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all border border-stone-200"
        >
          {hasDownloadedPdf ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>प्रमाणपत्र डाउनलोड हो गया (Verified)</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-stone-700" />
              <span>९०-दिवसीय डिजिटल सेंसर रिपोर्ट डाउनलोड करें (PDF)</span>
            </>
          )}
        </button>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
