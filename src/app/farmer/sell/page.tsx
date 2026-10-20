'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { CoinGrader } from '@/components/CoinGrader';
import { CanvasVisionAnalysis } from '@/lib/vision-grader';
import confetti from 'canvas-confetti';
import { 
  Store, 
  MapPin, 
  Mic, 
  Award, 
  CheckCircle2, 
  Volume2, 
  ArrowRight, 
  TrendingUp,
  Sparkles 
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { OfflineOrderDemo } from '@/components/OfflineOrderDemo';

export default function FarmerSellPage() {
  const router = useRouter();
  const { addListing, t, speak, lang, sensorReading, physicsEvaluation, activeGuideId, setActiveGuideId } = useKisan();

  const [listingMode, setListingMode] = useState<'camera' | 'offline'>('camera');
  const [quantityKg, setQuantityKg] = useState<number>(400);
  const [askingPrice, setAskingPrice] = useState<number>(28);
  const [latestGrade, setLatestGrade] = useState<CanvasVisionAnalysis | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isListeningQty, setIsListeningQty] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tab') === 'offline' || window.location.hash === '#offline-demo') {
        setListingMode('offline');
      }
    }
  }, []);

  const handleVoiceQuantity = () => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const prompted = window.prompt('कितना किलो माल बेचना है? (Enter quantity in kg):', '500');
      if (prompted) {
        const num = parseInt(prompted.replace(/[^0-9]/g, ''), 10);
        if (num > 0) {
          setQuantityKg(num);
          speak(`${num} किलो वजन दर्ज कर लिया गया है।`);
        }
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListeningQty(true);
      speak('बोलिए, कितना किलो बेचना है?');

      recognition.onresult = (event: any) => {
        setIsListeningQty(false);
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Extract digits or parse numbers
        const match = transcript.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > 0) {
            setQuantityKg(num);
            speak(`${num} किलो दर्ज किया गया।`);
            return;
          }
        }

        // Common Hindi number words
        if (transcript.includes('हजार') || transcript.includes('हज़ार') || transcript.includes('thousand')) {
          setQuantityKg(1000);
          speak('1000 किलो दर्ज किया गया।');
        } else if (transcript.includes('पांच सौ') || transcript.includes('पाँच सौ') || transcript.includes('five hundred')) {
          setQuantityKg(500);
          speak('500 किलो दर्ज किया गया।');
        } else if (transcript.includes('चार सौ') || transcript.includes('four hundred')) {
          setQuantityKg(400);
          speak('400 किलो दर्ज किया गया।');
        } else if (transcript.includes('दो सौ') || transcript.includes('two hundred')) {
          setQuantityKg(200);
          speak('200 किलो दर्ज किया गया।');
        } else {
          speak(`सुना: ${transcript}। कृपया सीधे संख्या में वजन लिखें या दोहराएं।`);
        }
      };

      recognition.onerror = () => {
        setIsListeningQty(false);
      };

      recognition.onend = () => {
        setIsListeningQty(false);
      };

      recognition.start();
    } catch {
      setIsListeningQty(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    const cropTitle = latestGrade?.grade === 'Grade A' ? 'देसी लाल टमाटर (Grade-A Certified)' : 'देसी टमाटर (Standard Quality)';

    // 1. Local context state
    addListing({
      crop: cropTitle,
      qty_kg: quantityKg,
      grade: latestGrade?.grade || 'Grade A',
      photos: ['/tomato_sample.jpg'],
      geo_coords: '28.9931, 77.0151',
      distance_km: 38,
      quality_score: latestGrade?.ripenessPct || 95.0,
      sensor_health_score: physicsEvaluation.overallHealthScore,
      status: 'LIVE',
      base_price_per_kg: askingPrice,
    });

    // 2. Supabase Cloud Sync
    if (isSupabaseConfigured()) {
      try {
        const payload: any = {
          crop: `${cropTitle} (₹${askingPrice}/kg)`,
          qty_kg: quantityKg,
          grade: latestGrade?.grade || 'Grade A',
          photos: ['/tomato_sample.jpg'],
          geo_coords: '28.9931, 77.0151',
          quality_score: latestGrade?.ripenessPct || 95.0,
          status: 'LIVE',
          base_price_per_kg: askingPrice,
        };
        let { error } = await supabase.from('listings').insert([payload]);
        if (error && error.message.includes('base_price_per_kg')) {
          delete payload.base_price_per_kg;
          await supabase.from('listings').insert([payload]);
        }
      } catch (err) {
        console.warn('Supabase listing sync note:', err);
      }
    }

    // Broadcast instant sync to Buyer Portal tab
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('kisanvaani_sync');
        bc.postMessage({
          type: 'LISTING_CREATED',
          listing: {
            id: `crop-${Date.now()}`,
            crop: cropTitle,
            qty_kg: quantityKg,
            grade: latestGrade?.grade || 'Grade A',
            base_price_per_kg: askingPrice,
            farmer_name: 'रामेश कुमार (+919876543210)',
            photos: ['/tomato_sample.jpg'],
          },
        });
        bc.close();
      } catch (e) {}
    }

    // Mirror to /api/listings server store
    try {
      fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: cropTitle,
          qty_kg: quantityKg,
          grade: latestGrade?.grade || 'Grade A',
          buyNowPrice: askingPrice,
          farmer_name: 'रामेश कुमार (+919876543210)',
          farmer_phone: '+919876543210',
        }),
      }).catch(() => {});
    } catch {}

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    speak(
      lang === 'en'
        ? `Listing published live on Mandi-Direct! ${quantityKg} kilos at ₹${askingPrice} per kilo.`
        : `मंडी-डायरेक्ट पर फसल लाइव हो गई है! ${quantityKg} किलो माल ₹${askingPrice} प्रति किलो भाव पर दर्ज हो गया।`
    );

    setTimeout(() => {
      setIsPublishing(false);
      router.push('/buyer');
    }, 1800);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#132A1C]">
            {t.sellTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            बिना बिचौलियों के रेस्टोरेंट और डार्क स्टोर को सीधे बेचें
          </p>
        </div>
        <button
          onClick={() => {
            speak('फसल बेचने के लिए पहले ₹10 के सिक्के के साथ फोटो खींचने हेतु यह हरा कैमरा बटन दबाएं, अथवा ऑफ़लाइन आर्डर डेमो बटन दबाकर फोन कॉल से बेचें।', 'coin-camera-btn');
          }}
          className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-2xl text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-1.5 font-bold text-xs"
          aria-label={t.listen}
        >
          <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>निर्देश सुनें</span>
        </button>
      </div>

      {/* Mode Switcher Tabs: 1. Camera Coin Grader, 2. Offline Order Demo */}
      <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        <button
          type="button"
          onClick={() => setListingMode('camera')}
          className={`h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            listingMode === 'camera'
              ? 'bg-white text-stone-900 shadow-sm border border-black/[0.04]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>📸 कैमरा सिक्का स्कैन</span>
        </button>
        <button
          type="button"
          onClick={() => setListingMode('offline')}
          className={`h-11 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            listingMode === 'offline'
              ? 'bg-[#0B7A3B] text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <span>📞 ऑफ़लाइन आर्डर डेमो</span>
        </button>
      </div>

      {listingMode === 'offline' ? (
        <div className="space-y-4">
          <OfflineOrderDemo
            defaultPhone="+919876543210"
            onSuccess={(crop, qty, price) => {
              speak(`बहुत बढ़िया! ${qty} किलो ${crop} ₹${price} प्रति किलो भाव पर मंडी पोर्टल पर पोस्ट हो गया है।`);
            }}
          />
          <div className="bg-white rounded-3xl p-5 border border-stone-200 text-center space-y-2">
            <h3 className="font-black text-sm text-stone-900">कॉल से पोस्ट करने के बाद:</h3>
            <p className="text-xs text-stone-500">
              आपकी सब्जी बिना इंटरनेट के सीधे मंडी पोर्टल पर &ldquo;ऑफ़लाइन वॉइस पोस्ट&rdquo; के रूप में दिखती है।
            </p>
            <button
              onClick={() => router.push('/buyer')}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#0B7A3B] text-white text-xs font-bold shadow-md hover:bg-[#064E26] active:scale-95 transition-all"
            >
              <span>मंडी पोर्टल पर लाइव पोस्ट देखें</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Produce Camera & Coin Grader */}
          <CoinGrader onGradingComplete={(res) => setLatestGrade(res)} />

      {/* Zero Keyboard Inputs: Quick Tap Quantity Selector */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#132A1C]">
            कितना माल बेचना है? (Select Quantity)
          </span>
          <span className="font-mono font-black text-lg text-[#0B7A3B]">
            {quantityKg} किग्रा
          </span>
        </div>

        {/* 4 Big Buttons for Quantity (≥54px) */}
        <div className="grid grid-cols-4 gap-2">
          {[200, 400, 600, 1000].map((qty) => (
            <button
              key={qty}
              onClick={() => {
                setQuantityKg(qty);
                speak(`${qty} किलो`);
              }}
              className={`h-[56px] rounded-2xl font-black text-sm transition-all border-2 ${
                quantityKg === qty
                  ? 'bg-[#0B7A3B] text-white border-[#0B7A3B] shadow-md'
                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {qty} kg
            </button>
          ))}
        </div>

        {/* Speak or Type Custom Quantity */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 mb-1.5">
            <span>या अपनी मर्जी का वजन लिखें / बोलें:</span>
            <span className="text-emerald-700 font-mono">Type or Speak Quantity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={quantityKg || ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setQuantityKg(val);
                }}
                className="w-full h-12 px-3.5 pr-14 rounded-2xl border-2 border-stone-200 focus:border-emerald-600 font-mono font-black text-base text-stone-900 outline-none transition-colors"
                placeholder="उदा. 450, 750"
              />
              <span className="absolute right-3.5 top-3.5 text-xs text-stone-400 font-bold">
                किग्रा (kg)
              </span>
            </div>

            <button
              type="button"
              onClick={handleVoiceQuantity}
              className={`h-12 px-3.5 rounded-2xl flex items-center gap-1.5 font-bold text-xs transition-all border active:scale-95 shrink-0 ${
                isListeningQty
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm'
              }`}
              title="बोलकर वजन दर्ज करें"
            >
              <Mic className={`w-4 h-4 ${isListeningQty ? 'animate-bounce' : 'text-emerald-700'}`} />
              <span>{isListeningQty ? 'सुन रहे हैं...' : 'बोलकर बताएं'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asking Price Selector */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#132A1C]">
            अपेक्षित भाव (Expected Price per kg)
          </span>
          <span className="font-mono font-black text-lg text-[#0B7A3B]">
            ₹{askingPrice} / किलो
          </span>
        </div>

        {/* 4 Quick Price Chips */}
        <div className="grid grid-cols-4 gap-2">
          {[24, 28, 32, 36].map((p) => (
            <button
              key={p}
              onClick={() => {
                setAskingPrice(p);
                speak(`₹${p} प्रति किलो`);
              }}
              className={`h-[56px] rounded-2xl font-black text-sm transition-all border-2 ${
                askingPrice === p
                  ? 'bg-[#0B7A3B] text-white border-[#0B7A3B] shadow-md'
                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
              }`}
            >
              ₹{p}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
          <span>सोनीपत मंडी भाव: ₹26 - ₹31</span>
          <span className="text-[#0B7A3B] font-bold">अनुमानित कुल: ₹{(quantityKg * askingPrice).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Auto GPS Geo-tag Pill */}
      <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 text-emerald-900 rounded-2xl text-xs font-semibold border border-emerald-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#0B7A3B]" />
          <span>मुरथल, सोनीपत (28.9931° N, 77.0151° E)</span>
        </div>
        <span className="text-[11px] text-emerald-700">जीपीएस सक्रिय ✓</span>
      </div>

      {/* Final Big Action Button (≥72px) with Highlight Glow */}
      <div className="relative">
        {activeGuideId === 'publish-listing-btn' && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 guide-badge-bounce">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-lg">
              👉 यह दबाएं (Tap to Sell)
            </span>
          </div>
        )}
        <button
          id="publish-listing-btn"
          onClick={() => {
            setActiveGuideId(null);
            handlePublish();
          }}
          disabled={isPublishing}
          className={`w-full h-[74px] rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
            activeGuideId === 'publish-listing-btn'
              ? 'guide-glow bg-[#0B7A3B] text-white shadow-2xl scale-[1.02]'
              : 'bg-[#0B7A3B] hover:bg-[#064E26] text-white shadow-xl active:scale-95'
          }`}
        >
          <Store className="w-7 h-7" />
          <span>{isPublishing ? 'मंडी-डायरेक्ट पर भेजा जा रहा है...' : t.publishListing}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      </>
      )}

      {/* Bottom Nav */}
      <FarmerBottomNav />

    </div>
  );
}
