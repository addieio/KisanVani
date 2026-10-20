'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useKisan } from '@/context/KisanContext';
import { 
  ArrowLeft, 
  Award, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  Lock,
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuyerListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { listings, activeOrder, acceptOrder, t, speak } = useKisan();

  const listingId = params?.id as string;
  const listing = listings.find((l) => l.id === listingId) || listings[0];

  const [bidPrice, setBidPrice] = useState<number>(listing?.base_price_per_kg || 28);
  const [isEscrowLocked, setIsEscrowLocked] = useState<boolean>(false);

  const totalAmount = (listing?.qty_kg || 400) * bidPrice;

  const handlePlaceBidOrBuyNow = (isDirectBuy: boolean) => {
    setIsEscrowLocked(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });

    speak(`धनराशि एस्क्रो खाते में लॉक हो गई है। किसान रामेश जी को वॉइस कन्फर्मेशन भेजा गया।`);

    setTimeout(() => {
      router.push('/farmer/order');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          href="/buyer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#0B7A3B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>सभी फसलों पर वापस जाएँ</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details, Sensor Telemetry, Inspection Certificate */}
        <div className="md:col-span-2 space-y-5">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#0B7A3B] text-xs font-black">
                {listing.grade} प्रमाणित
              </span>
              <span className="text-xs text-gray-500 font-mono">
                लिस्टिंग आईडी: {listing.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#132A1C] mt-2">
              {listing.crop}
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              {listing.farmer_name} · मुरथल, सोनीपत (दूरी: {listing.distance_km} किमी)
            </p>

            {/* Quality Cert & Scale Badge */}
            <div className="mt-5 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#0B7A3B] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  ₹10 सिक्के से ऑन-डिवाइस कंप्यूटर विज़न प्रमाणन
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  औसत आकार: 62.4 mm · परिपक्वता: 96% · दाग-धब्बा: &lt;3%
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white rounded-xl text-xs font-black text-[#0B7A3B] border border-emerald-300">
                A+ ग्रेड
              </span>
            </div>

            {/* Field Sensor Telemetry Behind the Lot */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-[#132A1C] uppercase tracking-wider mb-3">
                मिट्टी व खेत स्वास्थ्य प्रमाण (ESP32 Stake Verified)
              </h3>
              
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="text-gray-500 text-[11px]">मिट्टी नमी</div>
                  <div className="font-bold text-base text-[#132A1C] mt-0.5">52%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">इष्टतम</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="text-gray-500 text-[11px]">पोषक उठाव (EC)</div>
                  <div className="font-bold text-base text-[#132A1C] mt-0.5">1.4 mS/cm</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">सामान्य</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="text-gray-500 text-[11px]">पत्ती तापमान</div>
                  <div className="font-bold text-base text-[#132A1C] mt-0.5">26.2°C</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">रोग मुक्त</div>
                </div>
              </div>
            </div>

          </div>

          {/* 5-Step Escrow State Pipeline Visualizer */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
            <h3 className="text-xs font-bold text-[#132A1C] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              एस्क्रो सुरक्षा पाइपलाइन (Escrow Contract Pipeline)
            </h3>

            <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-bold">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#0B7A3B]">
                1. बोली / BUY
              </div>
              <div className="p-2 rounded-xl bg-emerald-100 text-[#0B7A3B]">
                2. मंज़ूर (SMS)
              </div>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 animate-pulse">
                3. वाहन रवानगी
              </div>
              <div className="p-2 rounded-xl bg-gray-100 text-gray-500">
                4. QR कोड
              </div>
              <div className="p-2 rounded-xl bg-gray-100 text-gray-500">
                5. भुगतान जारी
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 text-center">
              चालक द्वारा खेत पर 4-अंकों का कोड सत्यापित करने के बाद ही बैंक खाते में पैसा निकलता है।
            </p>
          </div>

        </div>

        {/* Right Col: Escrow Bidding & Buy-Now Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-xl flex flex-col justify-between h-fit space-y-5">
          
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              खरीद एवं बोली काउंटर
            </div>
            <div className="font-mono font-black text-3xl text-[#132A1C] mt-1">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {listing.qty_kg} किग्रा लॉट हेतु (₹{bidPrice}/किग्रा)
            </div>
          </div>

          {/* Price Bid Stepper */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-700">अपनी प्रति-किलो बोली तय करें:</div>
            <div className="flex items-center gap-2">
              {[26, 28, 30, 32].map((p) => (
                <button
                  key={p}
                  onClick={() => setBidPrice(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    bidPrice === p
                      ? 'bg-[#0B7A3B] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => handlePlaceBidOrBuyNow(true)}
              disabled={isEscrowLocked}
              className="w-full h-[60px] bg-[#0B7A3B] hover:bg-[#064E26] text-white rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Lock className="w-5 h-5" />
              <span>{isEscrowLocked ? 'एस्क्रो लॉक हो गया...' : 'तुरंत खरीदें (Buy-Now)'}</span>
            </button>

            <button
              onClick={() => handlePlaceBidOrBuyNow(false)}
              disabled={isEscrowLocked}
              className="w-full h-[52px] bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-gray-300 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-gray-600" />
              <span>बोली दर्ज करें (Place Bid)</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-gray-500 font-medium">
            ✓ 100% रिफंडेबल एस्क्रो गारंटी
          </div>

        </div>

      </div>

    </div>
  );
}
