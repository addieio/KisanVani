'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKisan } from '@/context/KisanContext';
import { startListening, stopSpeaking } from '@/lib/speech';
import { Mic, MicOff, Volume2, X } from 'lucide-react';

export function VoiceMicButton() {
  const router = useRouter();
  const { lang, t, speak, acceptOrder, activeOrder } = useKisan();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [stopRecognitionFn, setStopRecognitionFn] = useState<(() => void) | null>(null);

  const handleVoiceCommand = (command: string) => {
    const lower = command.toLowerCase().trim();

    if (lower.includes('हाँ') || lower.includes('मंज़ूर') || lower.includes('yes') || lower.includes('accept') || lower.includes('ਹਾਂ') || lower.includes('होय')) {
      acceptOrder(activeOrder.id);
      setIsListening(false);
      router.push('/farmer/order');
      return;
    }

    if (lower.includes('बेच') || lower.includes('sell') || lower.includes('ਵਿਕਰੀ') || lower.includes('विक्री')) {
      speak(lang === 'en' ? 'Opening produce selling and grading screen' : 'फसल बेचने और ग्रेडिंग का पेज खोल रहे हैं');
      setIsListening(false);
      router.push('/farmer/sell');
      return;
    }

    if (lower.includes('बीमारी') || lower.includes('रोग') || lower.includes('पत्ती') || lower.includes('alert') || lower.includes('doctor')) {
      speak(lang === 'en' ? 'Checking silent infection alerts' : 'गुप्त बीमारी और संक्रमण चेतावनी जांच रहे हैं');
      setIsListening(false);
      router.push('/farmer/alert');
      return;
    }

    if (lower.includes('कोटा') || lower.includes('बोएँ') || lower.includes('plan') || lower.includes('फसल') || lower.includes('ਬਿਜਾਈ')) {
      speak(lang === 'en' ? 'Opening sowing quota and 10% blueprint' : 'बुवाई कोटा और एक्सोटिक ब्लूप्रिंट खोल रहे हैं');
      setIsListening(false);
      router.push('/farmer/plan');
      return;
    }

    if (lower.includes('सेंसर') || lower.includes('sensor') || lower.includes('नमी') || lower.includes('खेत')) {
      speak(lang === 'en' ? 'Opening soil telemetry dashboard' : 'खेत की लाइव सेंसर जानकारी खोल रहे हैं');
      setIsListening(false);
      router.push('/farmer/field');
      return;
    }

    if (lower.includes('बीमा') || lower.includes('दावा') || lower.includes('insurance')) {
      speak(lang === 'en' ? 'Opening crop insurance claim screen' : 'फसल बीमा दावा पेज खोल रहे हैं');
      setIsListening(false);
      router.push('/farmer/insurance');
      return;
    }

    if (lower.includes('होम') || lower.includes('घर') || lower.includes('home')) {
      setIsListening(false);
      router.push('/farmer');
      return;
    }

    // Default spoken reply if command wasn't specific
    speak(
      lang === 'en'
        ? `Heard: "${command}". Say "Sell", "Alerts", "Plan", or "Yes" to confirm.`
        : `सुना गया: "${command}". "बेचें", "बीमारी", "कोटा" या "हाँ" बोलें.`
    );
  };

  const toggleListen = () => {
    if (isListening) {
      if (stopRecognitionFn) stopRecognitionFn();
      setIsListening(false);
      return;
    }

    stopSpeaking();
    setLiveTranscript('');
    setIsListening(true);

    const stop = startListening(
      lang,
      (result) => {
        setLiveTranscript(result.transcript);
        if (result.isFinal) {
          handleVoiceCommand(result.transcript);
        }
      },
      (error) => {
        console.warn('Voice STT warning:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setStopRecognitionFn(() => stop);
  };

  return (
    <>
      {/* Giant Floating Mic Button (≥72px) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleListen}
          className={`h-[74px] px-6 rounded-full shadow-2xl flex items-center gap-3.5 transition-all transform active:scale-90 border-2 ${
            isListening
              ? 'bg-red-600 border-red-300 text-white animate-bounce'
              : 'bg-[#0B7A3B] border-emerald-400/50 text-white hover:bg-[#064E26] hover:shadow-emerald-900/40'
          }`}
          aria-label={t.speak}
        >
          <div className="relative">
            <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse text-white' : 'text-emerald-100'}`} />
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full animate-ping" />
            )}
          </div>
          <span className="text-xl font-bold tracking-wide">
            {isListening ? t.listening : t.speak}
          </span>
        </button>
      </div>

      {/* Voice Recognition Active Dialog Modal */}
      {isListening && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-emerald-500 flex flex-col items-center">
            
            <button
              onClick={() => {
                if (stopRecognitionFn) stopRecognitionFn();
                setIsListening(false);
              }}
              className="self-end p-2 text-gray-400 hover:text-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ripple Wave Animation */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 animate-ping absolute" />
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg relative z-10">
                <Mic className="w-10 h-10 animate-pulse" />
              </div>
            </div>

            <h4 className="text-xl font-extrabold text-[#132A1C] mt-2">
              {t.listening}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'en'
                ? 'Try saying: "Sell crop", "Check alerts", or "Yes"'
                : 'बोलें: "फसल बेचें", "बीमारी जांचें", या "हाँ, मंज़ूर"'}
            </p>

            {/* Real-time speech transcript bubble */}
            <div className="mt-4 p-3 bg-gray-50 rounded-2xl w-full border border-gray-200 min-h-[50px] flex items-center justify-center text-sm font-semibold text-emerald-900">
              {liveTranscript ? `"${liveTranscript}"` : 'आपकी आवाज सुनी जा रही है...'}
            </div>

            <button
              onClick={() => {
                if (stopRecognitionFn) stopRecognitionFn();
                setIsListening(false);
              }}
              className="mt-5 w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm"
            >
              रद्द करें (Cancel)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
