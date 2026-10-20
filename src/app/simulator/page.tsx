'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { 
  Sliders, 
  RotateCcw, 
  Droplet, 
  Thermometer, 
  Cpu, 
  Power, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2,
  Bug,
  Info
} from 'lucide-react';

export default function JudgeSimulatorPage() {
  const { 
    sensorReading, 
    updateSensors, 
    resetSensorsToNormal, 
    triggerHypoxiaScenario, 
    triggerRootRotScenario, 
    triggerBacterialWiltScenario, 
    triggerNitrogenLowScenario, 
    physicsEvaluation,
    speak,
    lang
  } = useKisan();

  const leafDelta = Number((sensorReading.leaf_temp - sensorReading.air_temp).toFixed(1));

  interface BioCondition {
    id: string;
    title: string;
    level: 'critical' | 'warning' | 'safe';
    desc: string;
    recommendation: string;
  }

  // Determine active biophysical disease conditions
  const conditions: BioCondition[] = [];
  if (sensorReading.moisture > 80 && sensorReading.ec < 0.9) {
    conditions.push({
      id: 'root-rot',
      title: '⚠️ फाइटोफ्थोरा जड़ गलन (Phytophthora Root Rot)',
      level: 'critical',
      desc: 'मिट्टी में 84%+ नमी है पर जड़ का NPK खिंचाव शून्य है (Uptake Flat)। 96 घंटे पूर्व चेतावनी!',
      recommendation: 'ट्राइकोडर्मा विरिडी 5g/L जैविक कल्चर तुरंत ड्रेंच करें।'
    });
  }
  if (sensorReading.moisture > 85) {
    conditions.push({
      id: 'hypoxia',
      title: '🌊 जलभराव व हाइपोक्सिया (Soil Hypoxia)',
      level: 'critical',
      desc: 'जड़ों को ऑक्सीजन मिलना बंद हो गया है। ट्यूबवेल तुरंत बंद करें!',
      recommendation: '5HP मोटर को ऑटो-कटऑफ पर रखा गया है।'
    });
  }
  if (leafDelta >= 1.8) {
    conditions.push({
      id: 'leaf-fever',
      title: '🔥 पत्ती बुखार (Leaf Fever / Transpiration Shutdown)',
      level: 'critical',
      desc: `पत्ती का तापमान हवा से +${leafDelta}°C अधिक है। रंध्र (Stomata) बंद हो चुके हैं।`,
      recommendation: 'जीवाणु विल्ट (Ralstonia) या तीव्र जल तनाव का संकेत।'
    });
  }
  if (sensorReading.ph > 7.8) {
    conditions.push({
      id: 'ph-lockout',
      title: '🔒 फास्फोरस लॉकआउट (Phosphorus Lockout at pH 7.8+)',
      level: 'warning',
      desc: 'क्षारीय मिट्टी में फास्फोरस अघुलनशील कैल्शियम फास्फेट में बदल गया है।',
      recommendation: 'जिप्सम या सड़ी हुई गोबर की खाद (FYM) से pH संतुलित करें।'
    });
  }
  if (sensorReading.n < 80) {
    conditions.push({
      id: 'n-deficit',
      title: '🌾 नाइट्रोजन कमी (Nitrogen Deficiency)',
      level: 'warning',
      desc: `नाइट्रोजन केवल ${sensorReading.n} mg/kg है। निचली पत्तियां पीली पड़ेंगी।`,
      recommendation: 'नीम लेपित यूरिया या जीवामृत का पर्णीय छिड़काव करें।'
    });
  }
  if (sensorReading.k < 120) {
    conditions.push({
      id: 'k-deficit',
      title: '🍂 पोटाश न्यूनता (Potassium Deficit)',
      level: 'warning',
      desc: `पोटाश ${sensorReading.k} mg/kg है। फल का आकार और चमक कमजोर होगी।`,
      recommendation: 'म्यूरेट ऑफ पोटाश (MOP) या राख का छिड़काव करें।'
    });
  }
  if (conditions.length === 0) {
    conditions.push({
      id: 'optimal',
      title: '🟢 खेत पूर्णतः स्वस्थ (Optimal Crop Health)',
      level: 'safe',
      desc: 'सभी बायो-फिजिक्स पैरामीटर इष्टतम सीमा में हैं। 98% स्वास्थ्य स्कोर।',
      recommendation: 'वर्तमान ड्रिप सिंचाई चक्र और जैविक मल्चिंग जारी रखें।'
    });
  }

  const announceDiagnosis = () => {
    const text = conditions.map(c => `${c.title}. ${c.desc}`).join(' ');
    speak(text);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Bar & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-[28px] p-6 shadow-ios border border-black/[0.04]">
          <div className="flex items-center gap-4">
            <Link 
              href="/farmer" 
              className="w-12 h-12 rounded-2xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-[#1D1D1F] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                जज मूल्यांकन व बायो-फिजिक्स प्रयोगशाला
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                हार्डवेयर सेंसर सिम्युलेटर (Judge Telemetry Dock)
              </h1>
              <p className="text-sm text-stone-500">
                ESP32-S3 IoT स्टेक टेलीमेट्री और प्लांट पैथोलॉजी बायो-फिजिक्स का लाइव परीक्षण
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={announceDiagnosis}
              className="px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 रोग स्थिति सुनें</span>
            </button>
            <Link
              href="/farmer"
              className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all"
            >
              किसान ऐप देखें →
            </Link>
          </div>
        </div>

        {/* 1-Click Judge Presets */}
        <div className="bg-white rounded-[28px] p-6 shadow-ios border border-black/[0.04]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-stone-900">
                जज 1-क्लिक टेस्ट परिदृश्य (Judge Presets)
              </h2>
            </div>
            <button
              onClick={resetSensorsToNormal}
              className="text-xs text-stone-600 hover:text-emerald-700 flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-full bg-stone-100"
            >
              <RotateCcw className="w-3.5 h-3.5" /> सब सामान्य करें (Reset)
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={triggerRootRotScenario}
              className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-red-900 text-sm">
                <span>जड़ सड़न (Root Rot)</span>
                <Droplet className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-xs text-red-700 mt-1">
                नमी 84% + पोषक अवशोषण शून्य (Phytophthora)
              </p>
            </button>

            <button
              onClick={triggerHypoxiaScenario}
              className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-blue-900 text-sm">
                <span>जलभराव (Hypoxia)</span>
                <AlertTriangle className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-blue-700 mt-1">
                नमी 92% + 5HP मोटर ऑटो कट-ऑफ
              </p>
            </button>

            <button
              onClick={triggerBacterialWiltScenario}
              className="p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-orange-900 text-sm">
                <span>पत्ती बुखार (Leaf Fever)</span>
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <p className="text-xs text-orange-700 mt-1">
                पत्ती तापमान हवा से +3.8°C अधिक (Stomata बंद)
              </p>
            </button>

            <button
              onClick={() => updateSensors({ ph: 8.2, p: 14 })}
              className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-left transition-all group"
            >
              <div className="flex items-center justify-between font-bold text-purple-900 text-sm">
                <span>pH 8.2 लॉकआउट</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-xs text-purple-700 mt-1">
                क्षारीय मिट्टी में फास्फोरस का अघुलनशील अवक्षेपण
              </p>
            </button>
          </div>
        </div>

        {/* Live Biophysical Diagnosis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Diagnosed Diseases Panel */}
          <div className="bg-white rounded-[28px] p-6 shadow-ios border border-black/[0.04] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base text-stone-900">
                  सेंसर कॉम्बो द्वारा पहचानी गई बीमारियाँ ({conditions.length})
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                conditions.some(c => c.level === 'critical')
                  ? 'bg-red-100 text-red-800 animate-pulse'
                  : conditions.some(c => c.level === 'warning')
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {physicsEvaluation.overallHealthScore}% स्वास्थ्य स्कोर
              </span>
            </div>

            <div className="space-y-3">
              {conditions.map((cond) => (
                <div 
                  key={cond.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    cond.level === 'critical'
                      ? 'bg-red-50/60 border-red-200'
                      : cond.level === 'warning'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-stone-900 text-sm">{cond.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cond.level === 'critical' ? 'bg-red-200 text-red-900' :
                      cond.level === 'warning' ? 'bg-amber-200 text-amber-900' :
                      'bg-emerald-200 text-emerald-900'
                    }`}>
                      {cond.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{cond.desc}</p>
                  <div className="mt-2 text-xs font-semibold text-emerald-800 bg-white/80 p-2 rounded-xl flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>सलाह: {cond.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actuator State Bar */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-stone-600" />
                <span className="text-xs font-bold text-stone-700">5HP मोटर रिले स्थिति:</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                physicsEvaluation.pumpRelayState 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {physicsEvaluation.pumpRelayState ? '🟢 मोटर चालू (ON)' : '🔴 सुरक्षा कट-ऑफ (AUTO OFF)'}
              </span>
            </div>
          </div>

          {/* Interactive Sliders Panel */}
          <div className="bg-white rounded-[28px] p-6 shadow-ios border border-black/[0.04] space-y-4">
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              लाइव मान बदलें (Interactive Sliders)
            </h3>

            {/* Moisture Slider */}
            <div className="bg-stone-50 p-3.5 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>मिट्टी की नमी (Soil Moisture):</span>
                <span className={`font-mono ${sensorReading.moisture > 80 ? 'text-red-600 font-extrabold' : 'text-blue-700'}`}>
                  {sensorReading.moisture}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={sensorReading.moisture}
                onChange={(e) => updateSensors({ moisture: Number(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>सूखा (20%)</span>
                <span>इष्टतम (55-68%)</span>
                <span className="text-red-500 font-bold">जड़ गलन ({'>'}80%)</span>
              </div>
            </div>

            {/* Temperature Delta */}
            <div className="bg-stone-50 p-3.5 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>पत्ती बुखार (Leaf Fever ΔT = T_leaf - T_air):</span>
                <span className={`font-mono ${leafDelta >= 1.8 ? 'text-red-600 font-extrabold' : 'text-emerald-700'}`}>
                  {leafDelta > 0 ? `+${leafDelta}` : leafDelta}°C
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] mt-1">
                <div>
                  <span className="text-stone-500">पत्ती IR ({sensorReading.leaf_temp.toFixed(1)}°C):</span>
                  <input
                    type="range"
                    min="18"
                    max="45"
                    step="0.5"
                    value={sensorReading.leaf_temp}
                    onChange={(e) => updateSensors({ leaf_temp: Number(e.target.value) })}
                    className="w-full accent-orange-600 mt-1"
                  />
                </div>
                <div>
                  <span className="text-stone-500">हवा DHT ({sensorReading.air_temp.toFixed(1)}°C):</span>
                  <input
                    type="range"
                    min="18"
                    max="45"
                    step="0.5"
                    value={sensorReading.air_temp}
                    onChange={(e) => updateSensors({ air_temp: Number(e.target.value) })}
                    className="w-full accent-emerald-600 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Soil pH */}
            <div className="bg-stone-50 p-3.5 rounded-2xl">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>मृदा सामू (Soil pH):</span>
                <span className={`font-mono ${sensorReading.ph > 7.8 ? 'text-purple-600 font-extrabold' : 'text-teal-700'}`}>
                  {sensorReading.ph.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.1"
                value={sensorReading.ph}
                onChange={(e) => updateSensors({ ph: Number(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span className="text-red-500">अम्लीय (&lt;6.0)</span>
                <span className="text-emerald-600 font-bold">इष्टतम (6.5-7.2)</span>
                <span className="text-purple-600 font-bold">लॉकआउट (&gt;7.8)</span>
              </div>
            </div>

            {/* N-P-K Nutrients */}
            <div className="bg-stone-50 p-3.5 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-stone-800">पोषक तत्व (NPK mg/kg)</div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                    <span>N:</span>
                    <span className="font-mono font-bold text-emerald-700">{sensorReading.n}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="220"
                    step="5"
                    value={sensorReading.n}
                    onChange={(e) => updateSensors({ n: Number(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                    <span>P:</span>
                    <span className="font-mono font-bold text-blue-700">{sensorReading.p}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="2"
                    value={sensorReading.p}
                    onChange={(e) => updateSensors({ p: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-stone-500 mb-0.5">
                    <span>K:</span>
                    <span className="font-mono font-bold text-amber-700">{sensorReading.k}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="250"
                    step="5"
                    value={sensorReading.k}
                    onChange={(e) => updateSensors({ k: Number(e.target.value) })}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
