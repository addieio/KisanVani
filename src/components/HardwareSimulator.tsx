'use client';

import React, { useState } from 'react';
import { useKisan } from '@/context/KisanContext';
import { 
  X, 
  RotateCcw, 
  AlertTriangle, 
  Droplet, 
  Thermometer, 
  Cpu, 
  Power, 
  Activity, 
  Sparkles,
  ArrowRight,
  Send,
  PhoneCall
} from 'lucide-react';

export function HardwareSimulator() {
  const { 
    isSimulatorOpen, 
    toggleSimulator, 
    sensorReading, 
    updateSensors,
    resetSensorsToNormal,
    triggerHypoxiaScenario,
    triggerRootRotScenario,
    triggerBacterialWiltScenario,
    triggerNitrogenLowScenario,
    physicsEvaluation 
  } = useKisan();

  const [isSendingSms, setIsSendingSms] = useState<boolean>(false);
  const [smsFeedback, setSmsFeedback] = useState<string | null>(null);

  if (!isSimulatorOpen) return null;

  const handleSendTwilioSms = async () => {
    setIsSendingSms(true);
    setSmsFeedback('📡 Twilio SMS भेजा जा रहा है...');
    try {
      const topAlert = physicsEvaluation.alerts[0];
      const alertTitle = topAlert ? topAlert.title.hi : '🚨 खेत सेंसर स्थिति';
      const alertDesc = topAlert
        ? `${topAlert.message.hi} उपाय: ${topAlert.recommendedAction.hi}`
        : `नमी: ${sensorReading.moisture.toFixed(0)}%, N: ${sensorReading.n}, P: ${sensorReading.p}, K: ${sensorReading.k}. खेत संतुलित है।`;

      const res = await fetch('/api/alerts/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle,
          description: alertDesc,
          phone: '+919876543210',
        }),
      });
      const data = await res.json();
      setSmsFeedback(data.success ? '✅ SMS +919876543210 पर भेजा गया!' : '📡 SMS अलर्ट डिस्पैच दर्ज हुआ!');
      setTimeout(() => setSmsFeedback(null), 4000);
    } catch (e) {
      setSmsFeedback('⚠️ SMS प्रेषण विफल');
      setTimeout(() => setSmsFeedback(null), 3000);
    } finally {
      setIsSendingSms(false);
    }
  };

  const leafDelta = (sensorReading.leaf_temp - sensorReading.air_temp).toFixed(1);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Panel Header */}
      <div className="p-4 bg-gradient-to-r from-[#132A1C] to-[#0B7A3B] text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <Cpu className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight">ESP32-S3 Stake Simulator</h3>
            <p className="text-xs text-emerald-200">Local Wi-Fi WebSocket Telemetry</p>
          </div>
        </div>
        <button
          onClick={toggleSimulator}
          className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close simulator"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Actuation Status Bar: 5HP Pump Relay */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">5HP Pump Relay:</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              physicsEvaluation.pumpRelayState
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                physicsEvaluation.pumpRelayState ? 'bg-emerald-600' : 'bg-red-600'
              }`}
            />
            {physicsEvaluation.pumpRelayState ? 'चालू (ON)' : 'सुरक्षा कट-ऑफ (RELAY OFF)'}
          </span>
        </div>
      </div>

      {/* 1-Click Judge Presentation Presets */}
      <div className="p-4 border-b border-gray-200 bg-emerald-50/40">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#132A1C] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> जज डेमो परिदृश्य (Judge Presets)
          </span>
          <button
            onClick={resetSensorsToNormal}
            className="text-xs text-gray-600 hover:text-[#0B7A3B] flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3 h-3" /> रीसेट
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={triggerHypoxiaScenario}
            className="p-2.5 text-left rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition-all text-xs group"
          >
            <div className="font-bold text-red-900 flex items-center justify-between">
              <span>हाइपोक्सिया</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            </div>
            <div className="text-[11px] text-red-700 mt-0.5">नमी 92% + पंप कट-ऑफ</div>
          </button>

          <button
            onClick={triggerRootRotScenario}
            className="p-2.5 text-left rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all text-xs group"
          >
            <div className="font-bold text-amber-900 flex items-center justify-between">
              <span>जड़ सड़न (गुप्त)</span>
              <Droplet className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">नमी 68% + रुका पोषक उठाव</div>
          </button>

          <button
            onClick={triggerBacterialWiltScenario}
            className="p-2.5 text-left rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all text-xs group"
          >
            <div className="font-bold text-orange-900 flex items-center justify-between">
              <span>पत्ती बुखार (विल्ट)</span>
              <Thermometer className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <div className="text-[11px] text-orange-700 mt-0.5">पत्ती 29.8° {'>'} हवा 26°</div>
          </button>

          <button
            onClick={resetSensorsToNormal}
            className="p-2.5 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all text-xs group"
          >
            <div className="font-bold text-emerald-900 flex items-center justify-between">
              <span>स्वस्थ खेत</span>
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">संतुलित 98% सेहत</div>
          </button>
        </div>

        {/* Twilio SMS Live Alert Trigger */}
        <div className="mt-3 pt-2.5 border-t border-emerald-200/60">
          <button
            onClick={handleSendTwilioSms}
            disabled={isSendingSms}
            className="w-full py-2.5 px-3 rounded-xl bg-[#132A1C] hover:bg-[#0B7A3B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isSendingSms
                ? 'Twilio SMS भेजा जा रहा है...'
                : '📱 +919876543210 पर लाइव SMS अलर्ट भेजें'}
            </span>
          </button>
          {smsFeedback && (
            <p className="mt-1.5 text-center text-[11px] font-bold text-emerald-800 animate-in fade-in">
              {smsFeedback}
            </p>
          )}
        </div>
      </div>

      {/* Real-time Slider Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Soil Moisture */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-gray-800 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-600" /> मिट्टी की नमी (Moisture)
            </span>
            <span className={`font-mono font-bold text-sm ${
              sensorReading.moisture > 85 ? 'text-red-600' : 'text-blue-700'
            }`}>
              {sensorReading.moisture.toFixed(0)}%
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
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>सूखा (20%)</span>
            <span>संतुलित (50-60%)</span>
            <span className="text-red-500 font-semibold">जलभराव ({'>'}85%)</span>
          </div>
        </div>

        {/* Soil EC */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-gray-800">विद्युत चालकता (EC / Uptake)</span>
            <span className="font-mono font-bold text-sm text-purple-700">
              {sensorReading.ec.toFixed(2)} mS/cm
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.5"
            step="0.05"
            value={sensorReading.ec}
            onChange={(e) => updateSensors({ ec: Number(e.target.value) })}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span className="text-amber-600">अवरुद्ध (&lt;0.9)</span>
            <span>इष्टतम (1.2-2.0)</span>
            <span>लवणीय (&gt;2.5)</span>
          </div>
        </div>

        {/* Temperature Delta (Leaf vs Air) */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-gray-800 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-600" /> पत्ती vs हवा (Leaf Fever)
            </span>
            <span className={`font-mono font-bold text-sm ${
              Number(leafDelta) > 1.8 ? 'text-red-600' : 'text-emerald-700'
            }`}>
              Δ {Number(leafDelta) > 0 ? `+${leafDelta}` : leafDelta}°C
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-gray-500">पत्ती (IR MLX):</span>
              <input
                type="range"
                min="18"
                max="42"
                step="0.5"
                value={sensorReading.leaf_temp}
                onChange={(e) => updateSensors({ leaf_temp: Number(e.target.value) })}
                className="w-full accent-orange-600 mt-1"
              />
              <span className="font-mono font-semibold">{sensorReading.leaf_temp.toFixed(1)}°C</span>
            </div>
            <div>
              <span className="text-gray-500">हवा (DHT22):</span>
              <input
                type="range"
                min="18"
                max="42"
                step="0.5"
                value={sensorReading.air_temp}
                onChange={(e) => updateSensors({ air_temp: Number(e.target.value) })}
                className="w-full accent-emerald-600 mt-1"
              />
              <span className="font-mono font-semibold">{sensorReading.air_temp.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* N-P-K Nutrients */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-800 mb-2">मिट्टी पोषक तत्व (NPK mg/kg)</div>
          
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-gray-600">नाइट्रोजन (N):</span>
                <span className="font-mono font-bold text-emerald-700">{sensorReading.n} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                step="5"
                value={sensorReading.n}
                onChange={(e) => updateSensors({ n: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-gray-600">फास्फोरस (P):</span>
                <span className="font-mono font-bold text-blue-700">{sensorReading.p} mg/kg</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="2"
                value={sensorReading.p}
                onChange={(e) => updateSensors({ p: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-gray-600">पोटाश (K):</span>
                <span className="font-mono font-bold text-amber-700">{sensorReading.k} mg/kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="220"
                step="5"
                value={sensorReading.k}
                onChange={(e) => updateSensors({ k: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Soil pH */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-gray-800">मिट्टी का पीएच (pH)</span>
            <span className="font-mono font-bold text-sm text-teal-700">
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
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span className="text-red-500">अम्लीय (&lt;6.0)</span>
            <span className="text-emerald-600 font-semibold">इष्टतम (6.5-7.2)</span>
            <span className="text-blue-500">क्षारीय (&gt;7.6)</span>
          </div>
        </div>

      </div>

      {/* Footer Live JSON Telemetry */}
      <div className="p-3 bg-gray-900 text-gray-300 text-[11px] font-mono border-t border-gray-800">
        <div className="text-emerald-400 font-bold mb-1 flex items-center justify-between">
          <span>ESP32 WS PAYLOAD (JSON):</span>
          <span className="text-[10px] text-gray-500">115200 baud</span>
        </div>
        <div className="truncate text-gray-400">
          {`{"m":${sensorReading.moisture},"ec":${sensorReading.ec},"n":${sensorReading.n},"p":${sensorReading.p},"k":${sensorReading.k},"ph":${sensorReading.ph},"relay":${physicsEvaluation.pumpRelayState}}`}
        </div>
      </div>

    </div>
  );
}
