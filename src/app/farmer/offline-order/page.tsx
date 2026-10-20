'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { OfflineOrderDemo } from '@/components/OfflineOrderDemo';
import { ArrowLeft, PhoneCall, Store } from 'lucide-react';
import Link from 'next/link';

export default function OfflineOrderDemoPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/farmer"
          className="w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center text-stone-700 shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-black text-stone-900">ऑफ़लाइन आर्डर डेमो</h1>
          <p className="text-[11px] font-bold text-stone-500">Twilio IVR + Gemini AI NLU</p>
        </div>
        <Link
          href="/buyer"
          className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-sm active:scale-95 transition-all"
          title="मंडी पोर्टल देखें"
        >
          <Store className="w-5 h-5 text-emerald-700" />
        </Link>
      </div>

      {/* Main Interactive Demo Component */}
      <OfflineOrderDemo
        defaultPhone="+919876543210"
        onSuccess={(crop, qty, price) => {
          setTimeout(() => {
            router.push('/buyer');
          }, 2000);
        }}
      />

      {/* Instructional Explainer Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-3">
        <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#0B7A3B]" />
          <span>यह कैसे काम करता है? (How it works)</span>
        </h3>
        <ol className="text-xs text-stone-600 space-y-2 list-decimal list-inside leading-relaxed">
          <li>ऊपर अपना फोन नंबर लिखकर <strong>&ldquo;मुझे कॉल करें&rdquo;</strong> बटन दबाएं।</li>
          <li>Twilio नंबर <strong>+1 (507) 500-7203</strong> से आपके फोन पर कॉल आएगी।</li>
          <li>कॉल उठाकर अपनी भाषा में बोलें (जैसे: <em>&ldquo;300 किलो टमाटर&rdquo;</em>)।</li>
          <li>कंप्यूटर आपसे रेट पूछेगा (जैसे बोलें: <em>&ldquo;40 रुपये&rdquo;</em>)।</li>
          <li>Gemini AI आपकी आवाज समझकर सीधे मंडी पोर्टल पर <strong>&ldquo;ऑफ़लाइन पोस्ट&rdquo;</strong> के रूप में दर्ज कर देगा।</li>
        </ol>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <Link
            href="/farmer/sell"
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            ← कैमरा से बेचें (Camera Scan)
          </Link>
          <Link
            href="/buyer"
            className="text-xs font-black text-[#0B7A3B] hover:underline"
          >
            मंडी लाइव फ़ीड देखें →
          </Link>
        </div>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
