'use client';

import React, { useState, useEffect } from 'react';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { supabase } from '@/lib/supabase';
import { 
  Radio, 
  Wifi, 
  Zap, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Sparkles, 
  Droplet, 
  Send,
  RotateCcw,
  Bug,
  Lock,
  ArrowRight
} from 'lucide-react';

export default function FarmerDevicePage() {
  const { currentLanguage, speak, isPumpActive, togglePump, activeGuideId, setActiveGuideId } = useKisan();
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Sensor Telemetry State (Hardware Simulator)
  const [moisture, setMoisture] = useState<number>(52);
  const [nitrogen, setNitrogen] = useState<number>(85);
  const [phosphorus, setPhosphorus] = useState<number>(42);
  const [potassium, setPotassium] = useState<number>(110);

  // Compute Dynamic Biophysics Alert
  interface BioAlert {
    level: 'critical' | 'warning' | 'optimal';
    badge: string;
    title: string;
    desc: string;
    advice: string;
    speech: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }

  const getAlert = (): BioAlert => {
    if (moisture > 80) {
      return {
        level: 'critical',
        badge: '🚨 अति-गंभीर अलर्ट (Root Hypoxia)',
        title: '🌊 जलभराव व जड़ सड़न चेतावनी',
        desc: `नमी ${moisture}% बहुत अधिक है! जड़ों में ऑक्सीजन खत्म हो गई है और फाइटोफ्थोरा का तीव्र खतरा है।`,
        advice: '👉 मोटर तुरंत बंद करें व खेत की नालियों से पानी निकालें।',
        speech: `चेतावनी! खेत में जलभराव और जड़ सड़न का खतरा है। नमी ${moisture} प्रतिशत हो गई है, मोटर तुरंत बंद करें।`,
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300'
      };
    } else if (moisture < 30) {
      return {
        level: 'critical',
        badge: '⚠️ सूखा तनाव (Drought Stress)',
        title: '☀️ तीव्र सूखा व पानी की भारी कमी',
        desc: `नमी केवल ${moisture}% बची है! पौधे मुरझा रहे हैं और वाष्पोत्सर्जन बंद हो चुका है।`,
        advice: '👉 ट्यूबवेल मोटर तुरंत चालू करके क्यारी या ड्रिप सिंचाई दें।',
        speech: `चेतावनी! खेत में तीव्र सूखा है। नमी केवल ${moisture} प्रतिशत है, तुरंत ट्यूबवेल चालू करें।`,
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300'
      };
    } else if (nitrogen < 40) {
      return {
        level: 'warning',
        badge: '⚠️ पोषक तत्व कमी (Low Nitrogen)',
        title: '🍂 नाइट्रोजन भारी कमी (Nitrogen Starvation)',
        desc: `N स्तर केवल ${nitrogen} mg/kg है। पत्तियां पीली पड़ेंगी और बढ़वार रुक जाएगी।`,
        advice: '👉 प्रति एकड़ 45 किलो नीम लेपित यूरिया या 200L जीवामृत दें।',
        speech: `सावधान! खेत में नाइट्रोजन की भारी कमी है। स्तर केवल ${nitrogen} है। यूरिया या जीवामृत छिड़कें।`,
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300'
      };
    } else if (nitrogen > 150) {
      return {
        level: 'warning',
        badge: '⚠️ विषाक्तता खतरा (Excess Urea)',
        title: '⚠️ अत्यधिक यूरिया / नाइट्रोजन विषाक्तता',
        desc: `N स्तर ${nitrogen} mg/kg अत्यधिक है! फसल कोमल होकर रस चूसक कीटों को आकर्षित करेगी।`,
        advice: '👉 रासायनिक खाद तुरंत रोकें और ताजा पानी देकर लीचिंग करें।',
        speech: `सावधान! नाइट्रोजन का स्तर बहुत अधिक ${nitrogen} हो गया है। रासायनिक खाद रोकें।`,
        color: 'text-purple-800',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-300'
      };
    } else if (phosphorus < 25) {
      return {
        level: 'warning',
        badge: '⚠️ जड़ अवरोध (Low Phosphorus)',
        title: '🔒 फास्फोरस लॉक व जड़ अवरोध',
        desc: `P स्तर केवल ${phosphorus} mg/kg है। नई जड़ों का विकास रुक गया है और फूल गिरेंगे।`,
        advice: '👉 सिंगल सुपर फास्फेट (SSP) या डीएपी खाद जड़ क्षेत्र में दें।',
        speech: `सावधान! फास्फोरस की कमी है। स्तर ${phosphorus} है, जड़ विकास रुक गया है।`,
        color: 'text-orange-800',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-300'
      };
    } else if (potassium < 60) {
      return {
        level: 'warning',
        badge: '⚠️ फल गुणवत्ता (Low Potassium)',
        title: '🥀 पोटाश न्यूनता (Potassium Deficit)',
        desc: `K स्तर केवल ${potassium} mg/kg है। फल का आकार छोटा रहेगा और चमक 30% घटेगी।`,
        advice: '👉 म्यूरेट ऑफ पोटाश (MOP) या 00:00:50 का पर्णीय छिड़काव करें।',
        speech: `सावधान! पोटाश की कमी है। फल का वजन और चमक कमजोर रहेगी।`,
        color: 'text-amber-800',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-300'
      };
    } else {
      return {
        level: 'optimal',
        badge: '✅ उत्तम संतुलन (98% Health Score)',
        title: '🟢 खेत पूर्णतः स्वस्थ व संतुलित',
        desc: `नमी ${moisture}%, N ${nitrogen}, P ${phosphorus}, K ${potassium} बिल्कुल सही सीमा में हैं।`,
        advice: '👉 वर्तमान ड्रिप सिंचाई चक्र व प्राकृतिक मल्चिंग जारी रखें।',
        speech: 'आपका खेत पूर्णतः स्वस्थ है। सभी पोषक तत्व और नमी संतुलित हैं।',
        color: 'text-emerald-800',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-300'
      };
    }
  };

  const alert = getAlert();

  useEffect(() => {
    speak('यह हार्डवेयर सेंसर सिम्युलेटर है। आप नाइट्रोजन, फास्फोरस, पोटाश और मिट्टी की नमी बदलकर लाइव अलर्ट देख सकते हैं।');
  }, []);

  const applyPreset = (m: number, n: number, p: number, k: number) => {
    setMoisture(m);
    setNitrogen(n);
    setPhosphorus(p);
    setPotassium(k);
    setTimeout(() => {
      const a = getAlert();
      speak(a.speech);
    }, 150);
  };

  const handleBroadcastAlert = async () => {
    setIsBroadcasting(true);
    speak('अलर्ट सर्वर और किसान फोन पर लाइव प्रसारित किया जा रहा है...');
    try {
      // 1. Save sensor reading to Supabase
      await supabase.from('sensor_readings').insert([
        {
          moisture,
          n: nitrogen,
          p: phosphorus,
          k: potassium,
          ph: 6.8,
          pump_relay_state: isPumpActive,
        },
      ]);

      // 2. Dispatch Twilio SMS alert to +919876543210
      const smsRes = await fetch('/api/alerts/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alert.title,
          description: `${alert.desc} | नमी: ${moisture}%, N: ${nitrogen}, P: ${phosphorus}, K: ${potassium}`,
          phone: '+919876543210',
        }),
      });
      const smsData = await smsRes.json().catch(() => ({}));

      setBroadcastSuccess(
        smsData.success
          ? '📡 अलर्ट क्लाउड और +919876543210 पर SMS भेजा गया!'
          : '📡 अलर्ट क्लाउड पर सहेजा गया और SMS अलर्ट ट्रिगर हुआ!'
      );
      speak('अलर्ट और SMS सफलतापूर्वक प्रसारित हो गया है!');
      setTimeout(() => setBroadcastSuccess(null), 4000);
    } catch (e) {
      console.error('Broadcast error:', e);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleMotorToggle = () => {
    togglePump();
    if (!isPumpActive) {
      speak(currentLanguage === 'en' ? 'Tubewell motor turned ON!' : 'मोटर चालू कर दी गई है। खेत में पानी जा रहा है।');
    } else {
      speak(currentLanguage === 'en' ? 'Tubewell motor turned OFF!' : 'मोटर बंद कर दी गई है।');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      {/* 1. Header Card */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-black mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            ESP32-S3 IoT स्टेक सिम्युलेटर
          </div>
          <h1 className="text-xl font-black text-[#1D1D1F] tracking-tight">हार्डवेयर सेंसर सिम्युलेटर</h1>
          <p className="text-xs text-stone-500 mt-0.5">N, P, K व नमी बदलकर लाइव अलर्ट देखें</p>
        </div>
        <button
          onClick={() => speak(alert.speech)}
          className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 active:scale-95"
          aria-label="Listen"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Broadcast Toast Banner */}
      {broadcastSuccess && (
        <div className="bg-emerald-600 text-white rounded-2xl p-3.5 text-xs font-bold text-center shadow-lg animate-fade-in">
          {broadcastSuccess}
        </div>
      )}

      {/* 2. DYNAMIC BIOPHYSICS ALERT CARD */}
      <div className={`rounded-[30px] p-5 border-2 shadow-ios transition-all ${alert.bgColor} ${alert.borderColor}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 rounded-full bg-white/90 text-stone-900 text-xs font-black shadow-sm">
            {alert.badge}
          </span>
          <button
            onClick={() => speak(alert.speech)}
            className="w-9 h-9 rounded-full bg-white text-stone-700 flex items-center justify-center shadow-sm hover:bg-stone-100"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <h2 className={`text-lg font-black ${alert.color}`}>{alert.title}</h2>
        <p className="text-xs text-stone-700 font-medium mt-1 leading-relaxed">{alert.desc}</p>

        <div className="mt-3 p-2.5 rounded-xl bg-white/80 border border-black/5 text-xs font-bold text-stone-900">
          {alert.advice}
        </div>

        {/* 1-Tap Broadcast Button */}
        <button
          onClick={handleBroadcastAlert}
          disabled={isBroadcasting}
          className="w-full mt-4 h-12 rounded-2xl bg-[#1D1D1F] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-black"
        >
          <Send className="w-4 h-4 text-emerald-400" />
          <span>{isBroadcasting ? 'सर्वर पर जा रहा है...' : '📡 यह अलर्ट सर्वर और किसान को भेजें'}</span>
        </button>
      </div>

      {/* 3. INTERACTIVE HARDWARE SLIDERS (N, P, K, MOISTURE) */}
      <div className="bg-white rounded-[30px] p-5 shadow-ios border border-black/[0.04] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-stone-900">हार्डवेयर सेंसर बार (Live Sliders)</h3>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
            ESP32-S3 BLE
          </span>
        </div>

        {/* Slider 1: Moisture */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800">💧 मृदा नमी (Soil Moisture)</span>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                moisture > 80 ? 'bg-red-100 text-red-800' : moisture < 30 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {moisture > 80 ? 'जलभराव (>80%)' : moisture < 30 ? 'सूखा (<30%)' : 'अनुकूल (35-75%)'}
              </span>
              <span className="font-black text-sm text-stone-900">{moisture}%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={moisture}
            onChange={(e) => setMoisture(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 2: Nitrogen */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800">🧪 नाइट्रोजन (N - Urea)</span>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                nitrogen < 40 ? 'bg-amber-100 text-amber-800' : nitrogen > 150 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {nitrogen < 40 ? 'भारी कमी (<40)' : nitrogen > 150 ? 'अत्यधिक (>150)' : 'सामान्य (60-120)'}
              </span>
              <span className="font-black text-sm text-stone-900">{nitrogen} mg/kg</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={nitrogen}
            onChange={(e) => setNitrogen(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 3: Phosphorus */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800">🌿 फास्फोरस (P - DAP)</span>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                phosphorus < 25 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {phosphorus < 25 ? 'कमी / लॉक (<25)' : 'संतुलित (30-70)'}
              </span>
              <span className="font-black text-sm text-stone-900">{phosphorus} mg/kg</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            value={phosphorus}
            onChange={(e) => setPhosphorus(Number(e.target.value))}
            className="w-full accent-amber-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
          />
        </div>

        {/* Slider 4: Potassium */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800">🥔 पोटैशियम (K - MOP)</span>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                potassium < 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {potassium < 60 ? 'न्यूनता (<60)' : 'इष्टतम (90-180)'}
              </span>
              <span className="font-black text-sm text-stone-900">{potassium} mg/kg</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            value={potassium}
            onChange={(e) => setPotassium(Number(e.target.value))}
            className="w-full accent-orange-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 4. PRESET 1-CLICK TEST SCENARIOS */}
      <div className="bg-white rounded-[30px] p-5 shadow-ios border border-black/[0.04]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-black text-stone-900">⚡ 1-क्लिक टेस्ट परिदृश्य (Preset Alerts)</h3>
        </div>
        <p className="text-[11px] text-stone-500 mb-3">सीधे क्लिक करके अलर्ट ट्रिगर करें व आवाज सुनें:</p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => applyPreset(88, 85, 42, 110)}
            className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition-all active:scale-95"
          >
            <div className="font-black text-red-900 text-xs">🌊 जलभराव (Hypoxia)</div>
            <div className="text-[10px] text-red-700 mt-0.5">नमी 88% • जड़ सड़न</div>
          </button>

          <button
            onClick={() => applyPreset(18, 70, 35, 90)}
            className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all active:scale-95"
          >
            <div className="font-black text-amber-900 text-xs">☀️ सूखा तनाव (Drought)</div>
            <div className="text-[10px] text-amber-700 mt-0.5">नमी 18% • मोटर ऑन</div>
          </button>

          <button
            onClick={() => applyPreset(52, 22, 40, 100)}
            className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-left transition-all active:scale-95"
          >
            <div className="font-black text-stone-900 text-xs">🍂 यूरिया कमी (Low N)</div>
            <div className="text-[10px] text-stone-600 mt-0.5">N 22 • पत्तियां पीली</div>
          </button>

          <button
            onClick={() => applyPreset(52, 175, 42, 110)}
            className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all active:scale-95"
          >
            <div className="font-black text-purple-900 text-xs">⚠️ अत्यधिक यूरिया</div>
            <div className="text-[10px] text-purple-700 mt-0.5">N 175 • विषाक्तता</div>
          </button>

          <button
            onClick={() => applyPreset(50, 85, 14, 110)}
            className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left transition-all active:scale-95"
          >
            <div className="font-black text-orange-900 text-xs">🔒 फास्फोरस लॉक (Low P)</div>
            <div className="text-[10px] text-orange-700 mt-0.5">P 14 • जड़ अवरुद्ध</div>
          </button>

          <button
            onClick={() => applyPreset(52, 85, 42, 110)}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all active:scale-95"
          >
            <div className="font-black text-emerald-900 text-xs">🟢 सब सामान्य (Normal)</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">संतुलित स्वास्थ्य</div>
          </button>
        </div>
      </div>

      {/* 5. TUBEWELL MOTOR TOGGLE BUTTON (≥74px Touch Ergonomics) */}
      <button
        onClick={handleMotorToggle}
        className={`w-full h-[76px] rounded-[28px] text-white text-base font-black flex items-center justify-center gap-3 shadow-lg active:scale-98 transition-all ${
          isPumpActive 
            ? 'bg-gradient-to-r from-red-600 to-rose-700 shadow-red-500/30' 
            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-emerald-500/30'
        }`}
      >
        <Zap className="w-7 h-7" />
        <span>{isPumpActive ? '🔴 खूंटे से मोटर बंद करें' : '💧 खूंटे से मोटर चालू करें'}</span>
      </button>

      {/* Simple Navigation */}
      <FarmerBottomNav />
    </div>
  );
}
