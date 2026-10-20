'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  ArrowLeft, 
  Truck, 
  Check, 
  X, 
  Volume2 
} from 'lucide-react';

export default function BuyerHandoverPage() {
  const { activeOrder, verifyHandoverPasscode, t, speak, lang } = useKisan();
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(activeOrder.escrow_state === 'PAID');

  const handleVerify = () => {
    if (passcodeInput.trim().length !== 4) {
      setErrorMsg('कृपया 4-अंकों का पासकोड दर्ज करें');
      return;
    }

    const ok = verifyHandoverPasscode(activeOrder.id, passcodeInput);
    if (ok) {
      setIsSuccess(true);
      setErrorMsg('');
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      setErrorMsg('गलत पासकोड! किसान के फोन पर प्रदर्शित कोड ही डालें (डेमो: 4829)');
      speak('पासकोड अमान्य है। कृपया किसान से सही कोड पूछें।');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          href="/buyer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#0B7A3B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>खरीदार पोर्टल पर वापस जाएँ</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-black text-[#132A1C] flex items-center gap-2">
          <Truck className="w-6 h-6 text-[#0B7A3B]" />
          <span>चालक माल हैंडओवर सत्यापन</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          खेत पर माल लोड करते समय किसान द्वारा प्रदर्शित 4-अंकों का पासकोड दर्ज करें
        </p>
      </div>

      {/* Verification Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-xl space-y-5 text-center">
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0B7A3B] flex items-center justify-center mx-auto">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            ऑर्डर हैंडओवर पासकोड (4-Digit Passcode)
          </div>
          <p className="text-xs text-gray-400 mt-1">
            (डेमो पासकोड: <span className="font-mono font-bold text-[#0B7A3B]">4829</span>)
          </p>
        </div>

        {/* 4-Digit Input Form */}
        {!isSuccess ? (
          <div className="space-y-4">
            <input
              type="text"
              maxLength={4}
              value={passcodeInput}
              onChange={(e) => {
                setPasscodeInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="4 8 2 9"
              className="w-full text-center font-mono font-black text-4xl tracking-widest py-3 border-2 border-gray-300 focus:border-[#0B7A3B] rounded-2xl outline-none transition-all"
            />

            {errorMsg && (
              <div className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={() => {
                setPasscodeInput('4829');
                setErrorMsg('');
              }}
              className="text-xs text-[#0B7A3B] hover:underline font-bold"
            >
              ऑटो-फिल किसान कोड (4829)
            </button>

            <button
              onClick={handleVerify}
              className="w-full h-[64px] bg-[#0B7A3B] hover:bg-[#064E26] text-white rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>हैंडओवर सत्यापित करें एवं एस्क्रो जारी करें</span>
            </button>
          </div>
        ) : (
          <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-400 text-emerald-950 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#0B7A3B] mx-auto animate-bounce" />
            
            <h3 className="text-xl font-black text-[#0B7A3B]">
              सफलता! एस्क्रो धनराशि जारी कर दी गई
            </h3>
            
            <div className="font-mono font-black text-2xl text-[#132A1C]">
              ₹{activeOrder.bid.total.toLocaleString('en-IN')}
            </div>

            <p className="text-xs text-emerald-800 leading-relaxed">
              गाड़ी चालक द्वारा कोड दर्ज करते ही किसान रामेश कुमार के बैंक खाते में यूपीआई से पैसा स्थानांतरित हो गया।
            </p>

            <div className="text-[11px] font-mono text-emerald-700 bg-white/80 p-2 rounded-xl border border-emerald-200">
              UPI Ref: {activeOrder.payout_upi_ref || 'UPI/20261017/9876543210/KV992'}
            </div>

            <Link
              href="/farmer/order"
              className="inline-block mt-2 text-xs font-bold text-[#0B7A3B] hover:underline"
            >
              किसान PWA पर भुगतान स्थिति देखें →
            </Link>
          </div>
        )}

      </div>

    </div>
  );
}
