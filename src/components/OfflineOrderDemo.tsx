'use client';

import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Radio, 
  Volume2, 
  Send,
  Loader2,
  Wheat,
  ShieldCheck
} from 'lucide-react';

interface OfflineOrderDemoProps {
  onSuccess?: (cropTitle: string, qty: number, price: number) => void;
  defaultPhone?: string;
}

export function OfflineOrderDemo({ 
  onSuccess,
  defaultPhone = '+919876543210' 
}: OfflineOrderDemoProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>(defaultPhone);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [simulatedSpeech, setSimulatedSpeech] = useState<string>('300 किलो टमाटर 40 रुपये भाव');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [lastPosted, setLastPosted] = useState<{
    crop: string;
    qty: number;
    price: number;
  } | null>(null);

  // 1. Trigger live Twilio phone call to user's phone
  const handleInitiateCall = async () => {
    setIsCalling(true);
    setCallStatus('📞 Twilio सर्वर से +18005472682 द्वारा आपके फोन पर कॉल मिलाई जा रही है...');
    try {
      const res = await fetch('/api/twilio/offline-listing/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();

      if (data.success) {
        setCallStatus(`📱 फ़ोन बज रहा है! कृपया कॉल उठाएं और बोलें: "${simulatedSpeech}"`);
      } else {
        setCallStatus(`⚠️ कॉल शुरू नहीं हो सकी: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setCallStatus(`⚠️ कॉल एरर: ${err.message || err}`);
    } finally {
      setIsCalling(false);
    }
  };

  // 2. Direct instant simulation of the voice gather endpoint
  const handleSimulateVoiceInput = async (spokenText?: string) => {
    const textToProcess = spokenText || simulatedSpeech;
    setIsSimulating(true);
    setCallStatus(`🎙️ आवाज प्रोसेस की जा रही है: "${textToProcess}"...`);
    try {
      const formData = new FormData();
      formData.append('SpeechResult', textToProcess);
      formData.append('From', phoneNumber);

      const res = await fetch('/api/twilio/offline-listing/gather', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        // Extract basic data for visual confirmation
        const numMatches = (textToProcess.match(/\d+/g) || []).map((n) => parseInt(n, 10));
        let cropName = 'देसी लाल टमाटर (Tomato)';
        if (textToProcess.includes('आलू') || textToProcess.includes('aloo')) {
          cropName = 'पहाड़ी आलू (Potato)';
        } else if (textToProcess.includes('मिर्च') || textToProcess.includes('mirch')) {
          cropName = 'हरी शिमला मिर्च (Bell Pepper)';
        } else if (textToProcess.includes('प्याज') || textToProcess.includes('pyaz')) {
          cropName = 'नासिक लाल प्याज (Onion)';
        }

        let qty = 300;
        let price = 40;
        if (numMatches.length >= 2) {
          const sorted = [...numMatches].sort((a, b) => b - a);
          qty = sorted[0];
          price = sorted[1];
        } else if (numMatches.length === 1) {
          qty = numMatches[0];
        }

        setLastPosted({ crop: cropName, qty, price });
        setCallStatus(`✅ सफलतापूर्वक दर्ज! ${qty}kg ${cropName} @ ₹${price}/kg लाइव मंडी पोर्टल पर ऑफ़लाइन पोस्ट हो गया!`);
        if (onSuccess) onSuccess(cropName, qty, price);
      } else {
        setCallStatus('⚠️ आवाज प्रोसेसिंग में समस्या आई।');
      }
    } catch (err: any) {
      setCallStatus(`⚠️ एरर: ${err.message || err}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-[#0B7A3B] to-[#064E26] p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background glowing ambient element */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-400/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-black text-amber-200 border border-amber-300/40">
            <Radio className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            बिना इंटरनेट ऑफ़लाइन आर्डर डेमो (Offline Order Demo)
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>फोन कॉल द्वारा फसल लिस्टिंग</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/20 text-emerald-100">
              Twilio IVR + Gemini AI
            </span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            साधारण कीपैड फोन से भी किसान अपनी आवाज में बोलकर सब्जी बेच सकते हैं। कॉल उठाएं और बोलें — जैसे <strong className="text-amber-200">&ldquo;300 किलो टमाटर 40 रुपये&rdquo;</strong>, और पोर्टल पर लाइव रेट व मात्रा सहित लिस्टिंग तुरंत दिखाई देगी।
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-black/30 px-3 py-2 border border-white/10 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-300" />
          <div>
            <div className="text-[10px] text-emerald-300 uppercase font-bold">Twilio आउटबाउंड कॉलर ID</div>
            <div className="font-mono font-bold text-white">+1 (507) 500-7203</div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="relative z-10 mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        
        {/* Left Column: Phone Input & Live Call Trigger */}
        <div className="lg:col-span-7 space-y-3">
          <label className="block text-xs font-bold text-emerald-200">
            कॉल प्राप्त करने के लिए आपका मोबाइल नंबर (E.164):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm font-mono font-bold text-white placeholder-emerald-300/50 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <button
              type="button"
              onClick={handleInitiateCall}
              disabled={isCalling}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCalling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-stone-900" />
                  <span>कॉल मिल रही है...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="h-4 w-4 text-stone-950" />
                  <span>📞 मुझे कॉल करें (Call Me Now)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Voice Demo Presets */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-emerald-200 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-300" />
              तुरंत टेस्ट के लिए 1-क्लिक सैंपल आवाज (One-Click Voice Simulator):
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                '300 किलो टमाटर 40 रुपये भाव',
                '500 किलो आलू 25 रुपये',
                '200 किलो शिमला मिर्च 60 रुपये',
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setSimulatedSpeech(sample);
                    handleSimulateVoiceInput(sample);
                  }}
                  disabled={isSimulating}
                  className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="h-3 w-3 text-amber-300" />
                  <span>&ldquo;{sample}&rdquo;</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Status Display Box */}
        <div className="lg:col-span-5 bg-black/40 rounded-2xl p-4 border border-white/10 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-200 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-amber-300" />
              लाइव IVR स्थिति (Realtime Status)
            </span>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
              Active
            </span>
          </div>

          <div className="my-3">
            {callStatus ? (
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {callStatus}
              </p>
            ) : (
              <p className="text-xs text-emerald-200/80 leading-relaxed italic">
                बटन दबाएं। किसानवाणी का टेलीफोन कॉल आपके +919876543210 नंबर पर आएगा। सब्जी का नाम व भाव बोलते ही Gemini AI द्वारा प्रोसेस होकर मंडी में लाइव लिस्ट हो जाएगा।
              </p>
            )}
          </div>

          {lastPosted && (
            <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 p-2.5 text-xs text-white flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-300 font-bold">लाइव लिस्टेड:</div>
                <div className="font-extrabold">{lastPosted.crop}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-amber-300">₹{lastPosted.price}/kg</div>
                <div className="text-[10px] text-emerald-200">{lastPosted.qty} kg लॉट</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
