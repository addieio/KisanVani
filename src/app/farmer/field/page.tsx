'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { 
  Droplet, 
  Thermometer, 
  Power, 
  Volume2, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  CloudRain, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function FarmerFieldDashboardPage() {
  const { 
    sensorReading, 
    physicsEvaluation, 
    t, 
    speak, 
    toggleSimulator, 
    updateSensors,
    activeGuideId,
    setActiveGuideId
  } = useKisan();

  const [pumpTimerMinutes, setPumpTimerMinutes] = useState<number>(45);
  const [isPumpActive, setIsPumpActive] = useState<boolean>(physicsEvaluation.pumpRelayState);

  const leafDelta = Number((sensorReading.leaf_temp - sensorReading.air_temp).toFixed(1));
  const isRootRotThreat = sensorReading.moisture > 80 && sensorReading.ec < 0.9;

  const togglePump = () => {
    setActiveGuideId(null);
    const nextState = !isPumpActive;
    setIsPumpActive(nextState);
    speak(nextState ? '5HP ट्यूबवेल मोटर चालू की गई। 45 मिनट का टाइमर सक्रिय है।' : '5HP मोटर बंद कर दी गई है।');
  };

  const playDoctorAdvice = () => {
    if (isRootRotThreat) {
      speak('डॉक्टर सलाह: मिट्टी में 84 प्रतिशत अधिक नमी है और जड़ का अवशोषण रुक गया है। तुरंत पानी रोकें और ट्राइकोडर्मा विरिडी 5 ग्राम प्रति लीटर पानी का घोल बनाकर जड़ों में डालें।', 'doctor-remedy-pill');
    } else {
      speak('डॉक्टर सलाह: खेत की स्थिति सामान्य है। ड्रिप सिंचाई जारी रखें और शाम के समय ही पानी दें।');
    }
  };

  const triggerVoiceGuide = () => {
    speak('जमीन के नीचे जड़, खाद और पानी की स्थिति देखें। सिंचाई के लिए नीचे दिया गया यह हरा मोटर बटन दबाएं।', 'pump-toggle-btn');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      
      {/* 1. Header with Live Audio Pill */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">IoT ₹600 NPK + थर्मल लाइव</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
            जड़, खाद और पानी
          </h1>
          <p className="text-xs text-stone-500">
            सेंसर आधारित भूमि व पादप स्वास्थ्य
          </p>
        </div>

        <button
          onClick={triggerVoiceGuide}
          className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all border border-emerald-200 shadow-sm"
          aria-label="Listen report"
        >
          <Volume2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>निर्देश सुनें</span>
        </button>
      </div>

      {/* 2. Pre-Visual Silent Infection Alert Box (Apple Health Alert Aesthetic) */}
      <div className="relative overflow-hidden rounded-[28px] bg-white p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className={`absolute top-0 inset-x-0 h-1.5 ${isRootRotThreat ? 'bg-red-500' : 'bg-emerald-500'}`} />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white ${
              isRootRotThreat ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
            }`}>
              {isRootRotThreat ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                isRootRotThreat ? 'text-red-600' : 'text-emerald-700'
              }`}>
                {isRootRotThreat ? 'साइलेंट संक्रमण अलर्ट (Silent Alert)' : 'जड़ स्वास्थ्य स्थिति'}
              </span>
              <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                {isRootRotThreat ? '⚠️ जड़ गलन (Phytophthora Rot)' : 'जड़ें सक्रिय व स्वस्थ'}
              </h3>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
            isRootRotThreat ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isRootRotThreat ? '4 दिन पहले पकड़' : 'सामान्य'}
          </span>
        </div>

        {/* Root Thermal FLIR Visual Graphic */}
        <div className="rounded-2xl bg-stone-50 p-3 flex items-center gap-3 border border-stone-200/80">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900">
            <img 
              src="https://images.unsplash.com/photo-1592417817098-8f3d69102a56?w=300&auto=format&fit=crop&q=80" 
              alt="Thermal root sensor" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 via-transparent to-transparent" />
            <div className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded-full text-[9px] text-red-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              थर्मल FLIR
            </div>
          </div>

          <div className="text-xs space-y-1">
            <p className="text-stone-800 leading-tight">
              {isRootRotThreat ? (
                <>जमीन में नमी <span className="font-bold text-red-600">84% अधिक</span> है। जड़ का खिंचाव ठहर गया है (Uptake Flat)।</>
              ) : (
                <>जड़ों में पोषण का अवशोषण सुचारू है। मृदा जल संतुलन अनुकूल है।</>
              )}
            </p>
            <p className="text-[11px] text-stone-500">
              पत्तियां पीली पड़ने से 96 घंटे पहले की अग्रिम पकड़
            </p>
          </div>
        </div>

        {/* 1-Tap Doctor Advice Button (>=72px) */}
        <button
          onClick={playDoctorAdvice}
          className="w-full h-[64px] rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all border border-stone-200"
        >
          <span className="text-xl">👨‍⚕️</span>
          <span>🔊 डॉक्टर सलाह सुनें / Doctor Advice</span>
        </button>
      </div>

      {/* 3. 4 Tactile Visual Gauges (iOS Health Rings & Weather Tile Styling) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-stone-900">सेंसर स्थिति (Live Health)</span>
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            30 से. पहले अपडेट
          </span>
        </div>

        {/* Gauge 1: 💧 मिट्टी नमी (Soil Moisture) */}
        <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block leading-none">1. भूमि नमी</span>
                <span className="text-sm font-bold text-stone-900">मिट्टी नमी (Moisture)</span>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              sensorReading.moisture >= 55 && sensorReading.moisture <= 68
                ? 'bg-emerald-100 text-emerald-800'
                : sensorReading.moisture > 80
                ? 'bg-red-100 text-red-800 animate-pulse'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {sensorReading.moisture >= 55 && sensorReading.moisture <= 68 ? '🟢 आदर्श (Optimal)' : sensorReading.moisture > 80 ? '🔴 जलभराव' : '🟡 सामान्य'}
            </span>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-stone-900">
              {sensorReading.moisture.toFixed(0)}
            </span>
            <span className="text-base text-stone-500 font-bold">%</span>
          </div>

          {/* Progress dial bar with optimal zone marker */}
          <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden relative">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                sensorReading.moisture > 80 ? 'bg-red-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(sensorReading.moisture, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>0%</span>
            <span className="text-emerald-700 font-bold">आदर्श क्षेत्र: 55-68%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Gauge 2: 🌿 NPK पोषक तत्व (Nutrient Bars with pH 7.8 lockout marker) */}
        <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block leading-none">2. पोषक तत्व</span>
                <span className="text-sm font-bold text-stone-900">NPK पोषण स्तर</span>
              </div>
            </div>
            <span className="text-xs font-bold text-stone-600">
              pH: {sensorReading.ph.toFixed(1)} {sensorReading.ph > 7.8 ? '🔒 लॉक' : '🟢 सामान्य'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-stone-700">N - पत्ती हरियाली (Foliage):</span>
                <span className="font-mono font-bold text-emerald-700">{sensorReading.n} mg/kg</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((sensorReading.n / 180) * 100, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-stone-700">P - जड़ फैलाव (Bloom):</span>
                <span className="font-mono font-bold text-blue-700">{sensorReading.p} mg/kg</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((sensorReading.p / 90) * 100, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-stone-700">K - फल चमक (Fruit Bulk):</span>
                <span className="font-mono font-bold text-amber-700">{sensorReading.k} mg/kg</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min((sensorReading.k / 220) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Gauge Row: Leaf Fever (ΔT) + Plant Height */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Gauge 3: 🌡️ पत्ती बुखार (Leaf Fever) */}
          <div className="bg-white rounded-[28px] p-4 shadow-ios border border-black/[0.04] space-y-1">
            <span className="text-[11px] text-stone-500 block">3. पत्ती बुखार (ΔT)</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-extrabold ${leafDelta >= 1.8 ? 'text-red-600' : 'text-stone-900'}`}>
                {leafDelta > 0 ? `+${leafDelta}` : leafDelta}
              </span>
              <span className="text-xs text-stone-500 font-bold">°C</span>
            </div>
            <p className="text-[10px] text-stone-500">
              {leafDelta >= 1.8 ? '⚠️ रंध्र बंद / विल्ट चेतावनी' : '🟢 सामान्य वाष्पोत्सर्जन'}
            </p>
          </div>

          {/* Gauge 4: 📏 पौधे की ऊंचाई (Plant Height) */}
          <div className="bg-white rounded-[28px] p-4 shadow-ios border border-black/[0.04] space-y-1">
            <span className="text-[11px] text-stone-500 block">4. अल्ट्रासोनिक ऊंचाई</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-stone-900">
                {sensorReading.height_cm.toFixed(0)}
              </span>
              <span className="text-xs text-stone-500 font-bold">cm</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-bold">
              +6cm इस सप्ताह (तेज बढ़वार)
            </p>
          </div>

        </div>

      </div>

      {/* 4. 1-Tap Weather-Synced Pump Control */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Power className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-stone-900">5HP ट्यूबवेल मोटर नियंत्रण</h3>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isPumpActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
          }`}>
            {isPumpActive ? 'चालू (ON)' : 'बंद (OFF)'}
          </span>
        </div>

        {/* Rain Override Alert */}
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-900">
          <CloudRain className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            मौसम पूर्वानुमान: कल 85% बारिश की संभावना - आज पानी रोककर ₹180 बिजली खर्च बचाएं!
          </span>
        </div>

        {/* Big 1-Tap Toggle Button (>=72px) with Highlight Glow */}
        <div className="relative">
          {activeGuideId === 'pump-toggle-btn' && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 guide-badge-bounce">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow-lg">
                👉 यह दबाएं (Motor ON/OFF)
              </span>
            </div>
          )}
          <button
            id="pump-toggle-btn"
            onClick={togglePump}
            className={`w-full h-[72px] rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all ${
              activeGuideId === 'pump-toggle-btn'
                ? 'guide-glow bg-emerald-500 text-white shadow-2xl scale-[1.02]'
                : isPumpActive
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-md active:scale-95'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md active:scale-95'
            }`}
          >
            <Power className="w-6 h-6" />
            <span>{isPumpActive ? 'मोटर बंद करें (Turn OFF)' : '1-टैप मोटर चालू करें (45 min Auto Cut-off)'}</span>
          </button>
        </div>

        {/* Quick Link to Judge Telemetry Dock */}
        <div className="pt-2 text-center">
          <Link
            href="/simulator"
            className="text-xs text-stone-500 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
          >
            <span>जज सिम्युलेटर पोर्टल में सेंसर मान बदलकर देखें →</span>
          </Link>
        </div>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
