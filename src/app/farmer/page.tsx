'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { 
  Droplet, 
  Zap, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Stethoscope, 
  Store, 
  Radio, 
  ArrowRight,
  ShieldAlert,
  User,
  PhoneCall
} from 'lucide-react';

export default function FarmerHomePage() {
  const { 
    lang, 
    speak, 
    isPumpActive, 
    togglePump, 
    activeGuideId, 
    setActiveGuideId,
    activeAlerts
  } = useKisan();

  const texts: Record<string, {
    header: string;
    healthyTitle: string;
    healthySub: string;
    alertTitle: string;
    alertSub: string;
    motorTurnOn: string;
    motorTurnOff: string;
    motorOnStatus: string;
    motorOffStatus: string;
    speakIntro: string;
    btnDoctor: string;
    btnDoctorSub: string;
    btnSell: string;
    btnSellSub: string;
    btnDevice: string;
    btnDeviceSub: string;
  }> = {
    hi: {
      header: 'खेत की स्थिति',
      healthyTitle: 'खेत बिल्कुल स्वस्थ है!',
      healthySub: 'जमीन में पानी और खाद सही है। चिंता की कोई बात नहीं।',
      alertTitle: '⚠️ सावधान: जड़ गलन का खतरा!',
      alertSub: 'पानी ज्यादा है। मोटर बंद रखें और तुरंत डॉक्टर सलाह देखें।',
      motorTurnOn: '💧 ⚡ मोटर चालू करें (Turn ON)',
      motorTurnOff: '🔴 ⚡ मोटर बंद करें (Turn OFF)',
      motorOnStatus: 'मोटर चालू है 💧',
      motorOffStatus: 'मोटर बंद है ⚡',
      speakIntro: 'खेत बिल्कुल स्वस्थ है! मोटर चलाने या बंद करने के लिए नीचे यह बटन दबाएं।',
      btnDoctor: 'पौधा डॉक्टर',
      btnDoctorSub: 'पत्ते की फोटो खींचें व रोग पहचानें',
      btnSell: 'फसल बेचें',
      btnSellSub: 'सीधे मंडी में ₹60/kg पर बेचें',
      btnDevice: 'सेंसर खूंटा',
      btnDeviceSub: 'खूंटे से कनेक्ट करें व रिमोट चलाएं',
    },
    pa: {
      header: 'ਖੇਤ ਦੀ ਸਥਿਤੀ',
      healthyTitle: 'ਖੇਤ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ!',
      healthySub: 'ਜ਼ਮੀਨ ਵਿੱਚ ਪਾਣੀ ਅਤੇ ਖਾਦ ਸਹੀ ਹੈ। ਚਿੰਤਾ ਦੀ ਕੋਈ ਗੱਲ ਨਹੀਂ।',
      alertTitle: '⚠️ ਸਾਵਧਾਨ: ਜੜ੍ਹ ਗਲਣ ਦਾ ਖਤਰਾ!',
      alertSub: 'ਪਾਣੀ ਜ਼ਿਆਦਾ ਹੈ। ਮੋਟਰ ਬੰਦ ਰੱਖੋ ਅਤੇ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਵੋ।',
      motorTurnOn: '💧 ⚡ ਮੋਟਰ ਚਾਲੂ ਕਰੋ (Turn ON)',
      motorTurnOff: '🔴 ⚡ ਮੋਟਰ ਬੰਦ ਕਰੋ (Turn OFF)',
      motorOnStatus: 'ਮੋਟਰ ਚੱਲ ਰਹੀ ਹੈ 💧',
      motorOffStatus: 'ਮੋਟਰ ਬੰਦ ਹੈ ⚡',
      speakIntro: 'ਖੇਤ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ! ਮੋਟਰ ਚਲਾਉਣ ਜਾਂ ਬੰਦ ਕਰਨ ਲਈ ਹੇਠਾਂ ਵਾਲਾ ਬਟਨ ਦਬਾਓ।',
      btnDoctor: 'ਪੌਧਾ ਡਾਕਟਰ',
      btnDoctorSub: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਵੋ ਤੇ ਰੋਗ ਪਛਾਣੋ',
      btnSell: 'ਫਸਲ ਵੇਚੋ',
      btnSellSub: 'ਸਿੱਧਾ ਮੰਡੀ ਵਿੱਚ ₹60/kg ਤੇ ਵੇਚੋ',
      btnDevice: 'ਸੈਂਸਰ ਕਿੱਲਾ',
      btnDeviceSub: 'ਕਿੱਲੇ ਨਾਲ ਜੁੜੋ ਤੇ ਰਿਮੋਟ ਚਲਾਓ',
    },
    mr: {
      header: 'शेताची स्थिती',
      healthyTitle: 'शेत पूर्णपणे निरोगी आहे!',
      healthySub: 'जमिनीत पाणी आणि खत योग्य आहे. काळजीचे काही कारण नाही.',
      alertTitle: '⚠️ सावधान: मूळ कुजण्याचा धोका!',
      alertSub: 'पाणी जास्त आहे. मोटर बंद ठेवा आणि डॉक्टरांचा सल्ला घ्या.',
      motorTurnOn: '💧 ⚡ मोटर सुरू करा (Turn ON)',
      motorTurnOff: '🔴 ⚡ मोटर बंद करा (Turn OFF)',
      motorOnStatus: 'मोटर सुरू आहे 💧',
      motorOffStatus: 'मोटर बंद आहे ⚡',
      speakIntro: 'शेत पूर्णपणे निरोगी आहे! मोटर सुरू किंवा बंद करण्यासाठी खालील बटण दाबा.',
      btnDoctor: 'पीक डॉक्टर',
      btnDoctorSub: 'पानाचा फोटो काढा आणि रोग ओळखा',
      btnSell: 'पीक विका',
      btnSellSub: 'थेट बाजारात ₹60/kg ने विका',
      btnDevice: 'सेन्सर खुंटा',
      btnDeviceSub: 'खुंट्याशी जोडा व रिमोट चालवा',
    },
    ta: {
      header: 'வயல் நிலை',
      healthyTitle: 'வயல் ஆரோக்கியமாக உள்ளது!',
      healthySub: 'மண்ணில் தண்ணீரும் உரமும் சரியாக உள்ளது. கவலைப்பட வேண்டாம்.',
      alertTitle: '⚠️ எச்சரிக்கை: வேர் அழுகல் அபாயம்!',
      alertSub: 'தண்ணீர் அதிகம். மோட்டாரை நிறுத்தி மருத்துவரை அணுகவும்.',
      motorTurnOn: '💧 ⚡ மோட்டாரை இயக்கவும் (Turn ON)',
      motorTurnOff: '🔴 ⚡ மோட்டாரை நிறுத்தவும் (Turn OFF)',
      motorOnStatus: 'மோட்டார் இயங்குகிறது 💧',
      motorOffStatus: 'மோட்டார் நிறுத்தப்பட்டது ⚡',
      speakIntro: 'வயல் ஆரோக்கியமாக உள்ளது! மோட்டாரை இயக்க அல்லது நிறுத்த கீழே உள்ள பொத்தானை அழுத்தவும்.',
      btnDoctor: 'பயிர் மருத்துவர்',
      btnDoctorSub: 'இலை படம் எடுத்து நோய் அறிய',
      btnSell: 'பயிர் விற்க',
      btnSellSub: 'சந்தையில் ₹60/kg க்கு விற்க',
      btnDevice: 'சென்சார் கம்பம்',
      btnDeviceSub: 'கருவியுடன் இணைத்து மோட்டார் இயக்க',
    },
    en: {
      header: 'Field Health',
      healthyTitle: 'Your Field is 100% Healthy!',
      healthySub: 'Soil moisture and nutrients are optimal. Everything is thriving.',
      alertTitle: '⚠️ Warning: Root Rot Threat Detected!',
      alertSub: 'Soil is waterlogged. Keep motor OFF and apply Trichoderma remedy.',
      motorTurnOn: '💧 ⚡ Turn ON Tubewell Motor',
      motorTurnOff: '🔴 ⚡ Turn OFF Tubewell Motor',
      motorOnStatus: 'Motor is RUNNING 💧',
      motorOffStatus: 'Motor is OFF ⚡',
      speakIntro: 'Your field is completely healthy. Press the big button below to operate the tubewell pump.',
      btnDoctor: 'Crop Doctor',
      btnDoctorSub: 'Snap leaf photo to detect disease',
      btnSell: 'Sell Harvest',
      btnSellSub: 'Sell directly to B2B buyers at ₹60/kg',
      btnDevice: 'Sensor Stake',
      btnDeviceSub: 'Connect to stake & control remote',
    },
  };

  const t = texts[lang] || texts.hi;
  const hasCriticalAlert = activeAlerts.length > 0;

  // Speak initial guidance on mount or language change
  useEffect(() => {
    speak(hasCriticalAlert ? t.alertSub : t.speakIntro, 'home-motor-btn', 7000);
  }, [lang, hasCriticalAlert]);

  const handleMotorClick = () => {
    togglePump();
    setActiveGuideId(null);
    if (!isPumpActive) {
      const msg = lang === 'en' 
        ? 'Tubewell motor turned ON! Water is flowing to the field.' 
        : 'मोटर चालू कर दी गई है! खेत में पानी जा रहा है।';
      speak(msg);
    } else {
      const msg = lang === 'en' 
        ? 'Tubewell motor turned OFF!' 
        : 'मोटर बंद कर दी गई है। पानी रुक गया है।';
      speak(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      
      {/* 1. Spoken Audio Header Card (For Illiterate Farmers) */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1D1D1F] tracking-tight">{t.header}</h1>
          <p className="text-xs text-stone-500 mt-1">
            {hasCriticalAlert ? t.alertSub : t.healthySub}
          </p>
        </div>
        <button
          onClick={() => speak(hasCriticalAlert ? t.alertSub : t.speakIntro, 'home-motor-btn')}
          className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 active:scale-95 transition-all shadow-sm"
          aria-label="Listen Status"
        >
          <Volume2 className="w-6 h-6 animate-pulse" />
        </button>
      </div>

      {/* 2. Giant Visual Status Card (Zero Numbers, 100% Visual Apple Health Style) */}
      <div className={`rounded-[32px] p-8 shadow-ios border text-center flex flex-col items-center justify-center gap-4 transition-all ${
        hasCriticalAlert
          ? 'bg-red-50/80 border-red-200'
          : 'bg-white border-black/[0.04]'
      }`}>
        
        {/* Pulsing Visual Indicator */}
        <div className="relative">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
            hasCriticalAlert
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-emerald-50 text-emerald-600'
          }`}>
            {hasCriticalAlert ? (
              <ShieldAlert className="w-16 h-16 text-red-600" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
          <span className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
            isPumpActive ? 'bg-blue-600 text-white' : 'bg-stone-300 text-stone-700'
          }`}>
            <Droplet className="w-5 h-5" />
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">
            {hasCriticalAlert ? t.alertTitle : t.healthyTitle}
          </h2>
          <p className="text-sm font-semibold text-stone-500 mt-1 max-w-[280px] mx-auto">
            {hasCriticalAlert ? t.alertSub : t.healthySub}
          </p>
        </div>

        {/* Simple Status Pill */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black ${
          isPumpActive 
            ? 'bg-blue-100 text-blue-800 animate-pulse' 
            : 'bg-stone-100 text-stone-700'
        }`}>
          <Zap className="w-4 h-4" />
          <span>{isPumpActive ? t.motorOnStatus : t.motorOffStatus}</span>
        </div>
      </div>

      {/* 3. ONE GIANT PRIMARY ACTION BUTTON (≥76px Height, Halo Guide) */}
      <div className="relative">
        {activeGuideId === 'home-motor-btn' && (
          <div className="absolute -top-3.5 left-6 z-10 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-md animate-bounce">
            👉 यह दबाएं (Motor Control)
          </div>
        )}
        <button
          id="home-motor-btn"
          onClick={handleMotorClick}
          className={`w-full h-[76px] rounded-[28px] text-white text-lg font-black flex items-center justify-center gap-3 shadow-lg active:scale-98 transition-all ${
            isPumpActive
              ? 'bg-gradient-to-r from-red-600 to-rose-700 shadow-red-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-emerald-500/30'
          } ${activeGuideId === 'home-motor-btn' ? 'ring-4 ring-emerald-400 ring-offset-2 animate-pulse shadow-emerald-500/40 shadow-xl' : ''}`}
        >
          {isPumpActive ? (
            <>
              <Zap className="w-7 h-7 text-yellow-300" />
              <span>{t.motorTurnOff}</span>
            </>
          ) : (
            <>
              <Droplet className="w-7 h-7" />
              <span>{t.motorTurnOn}</span>
            </>
          )}
        </button>
      </div>

      {/* 4. THREE BIG DIRECT ICON MODULE SHORTCUTS (≥72px) */}
      <div className="space-y-3 pt-2">
        {/* Doctor Shortcut */}
        <Link
          href="/farmer/remedy"
          className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between active:scale-98 transition-all hover:border-emerald-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-base text-stone-900">{t.btnDoctor}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{t.btnDoctorSub}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-stone-400 group-hover:text-emerald-700 transition-colors" />
        </Link>

        {/* Sell Shortcut */}
        <Link
          href="/farmer/sell"
          className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between active:scale-98 transition-all hover:border-emerald-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              <Store className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-base text-stone-900">{t.btnSell}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{t.btnSellSub}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-stone-400 group-hover:text-amber-700 transition-colors" />
        </Link>

        {/* Offline Order Demo Direct Shortcut */}
        <Link
          href="/farmer/sell?tab=offline"
          className="w-full bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-[28px] p-5 shadow-ios border border-amber-300/60 flex items-center justify-between active:scale-98 transition-all hover:border-amber-400 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-md">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-stone-900">ऑफ़लाइन आर्डर डेमो</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-stone-950 text-[10px] font-black animate-pulse">
                  Twilio Call
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">बिना इंटरनेट सीधे फोन कॉल पर बोलकर फसल बेचें</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-amber-800 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Device Stake Shortcut */}
        <Link
          href="/farmer/device"
          className="w-full bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between active:scale-98 transition-all hover:border-emerald-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
              <Radio className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h3 className="font-black text-base text-stone-900">{t.btnDevice}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{t.btnDeviceSub}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-stone-400 group-hover:text-blue-700 transition-colors" />
        </Link>

        {/* Profile & Loan/Insurance Passport Download Shortcut */}
        <Link
          href="/farmer/profile"
          className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[28px] p-5 shadow-ios border border-emerald-200/70 flex items-center justify-between active:scale-98 transition-all hover:border-emerald-400 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-md">
              <User className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-stone-900">किसान प्रोफाइल व पासपोर्ट</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">लोन व दावा</span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">बैंक लोन (KCC) व फसल बीमा हेतु पूरा डेटा डाउनलोड करें</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-emerald-700 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
