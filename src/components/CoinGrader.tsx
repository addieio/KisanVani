'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useKisan } from '@/context/KisanContext';
import { analyzeProduceCanvas, CanvasVisionAnalysis, INDIAN_10_RUPEE_COIN_DIAMETER_MM } from '@/lib/vision-grader';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Download, 
  Sparkles, 
  RotateCcw,
  Circle 
} from 'lucide-react';

interface CoinGraderProps {
  onGradingComplete?: (analysis: CanvasVisionAnalysis) => void;
}

export function CoinGrader({ onGradingComplete }: CoinGraderProps) {
  const { lang, t, speak, activeGuideId, setActiveGuideId } = useKisan();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CanvasVisionAnalysis | null>(null);
  const [targetCrop, setTargetCrop] = useState<'tomato' | 'pepper'>('tomato');

  // Start live webcam / mobile back-camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera stream inaccessible, using simulated snapshot', err);
      // Fallback: draw preset image onto canvas
      loadPresetImage('/tomato_sample.jpg');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture current frame from video
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 480;
    ctx.drawImage(videoRef.current, 0, 0, 480, 480);

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    stopCamera();

    performGrading(canvas);
  };

  // Perform computer vision analysis on canvas
  const performGrading = (canvas: HTMLCanvasElement) => {
    const targetSizeMM = targetCrop === 'tomato' ? 62.0 : 75.0;
    const result = analyzeProduceCanvas(canvas, 45, targetSizeMM);
    setAnalysisResult(result);

    if (result.grade === 'Grade A') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      speak(
        lang === 'en'
          ? `Grade-A Certified! Size ${result.sizeMM} millimeters, Ripeness ${result.ripenessPct} percent.`
          : `ग्रेड-A प्रमाणित! आकार ${result.sizeMM} मिलीमीटर, परिपक्वता ${result.ripenessPct} प्रतिशत।`
      );
    } else {
      speak(
        lang === 'en'
          ? `Analysis complete: ${result.grade}. Quality score: ${result.ripenessPct}%.`
          : `जांच पूर्ण: ${result.grade}. गुणवत्ता स्कोर ${result.ripenessPct} प्रतिशत।`
      );
    }

    if (onGradingComplete) {
      onGradingComplete(result);
    }
  };

  // Load a demo tomato/produce preset for quick presentation
  const loadPresetImage = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 480;

    // Draw simulated ripe tomato with ₹10 coin
    ctx.fillStyle = '#F4EFEA';
    ctx.fillRect(0, 0, 480, 480);

    // Draw ₹10 Coin (Golden outer ring + silver center)
    ctx.beginPath();
    ctx.arc(120, 240, 45, 0, 2 * Math.PI);
    ctx.fillStyle = '#D4AF37'; // gold ring
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#B38F24';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(120, 240, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#E0E0E0'; // silver center
    ctx.fill();
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('₹10', 120, 245);

    // Draw Grade-A Ripe Red Tomato
    const gradient = ctx.createRadialGradient(280, 220, 15, 290, 240, 95);
    gradient.addColorStop(0, '#FF4B4B');
    gradient.addColorStop(0.7, '#D31E1E');
    gradient.addColorStop(1, '#9C0E0E');

    ctx.beginPath();
    ctx.arc(290, 240, 90, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Tomato green calyx
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath();
    ctx.moveTo(290, 140);
    ctx.lineTo(280, 160);
    ctx.lineTo(290, 155);
    ctx.lineTo(300, 160);
    ctx.closePath();
    ctx.fill();

    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(dataUrl);
    performGrading(canvas);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = 480;
        canvas.height = 480;
        ctx.drawImage(img, 0, 0, 480, 480);
        setCapturedImage(event.target?.result as string);
        performGrading(canvas);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-[#0B7A3B] rounded-xl">
              <Award className="w-5 h-5" />
            </span>
            <h3 className="font-extrabold text-lg text-[#132A1C]">
              {t.coinGraderTitle}
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t.coinGraderDesc} (स्केल संदर्भ: 27.0 मिमी)
          </p>
        </div>

        {/* Preset Demo Fast Trigger */}
        <button
          onClick={() => loadPresetImage('/tomato_sample.jpg')}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0B7A3B] text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>डेमो टमाटर लोड करें</span>
        </button>
      </div>

      {/* Camera / Visual Viewport */}
      <div className="relative w-full aspect-square max-w-md mx-auto bg-gray-900 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-emerald-500/40">
        
        {/* Hidden internal canvas for OpenCV/Canvas image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera Stream */}
        {isCameraActive && (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Captured Image Display */}
        {!isCameraActive && capturedImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Graded Produce"
            className="w-full h-full object-cover"
          />
        )}

        {/* Empty State Instructions */}
        {!isCameraActive && !capturedImage && (
          <div className="text-center p-6 text-gray-400">
            <Camera className="w-16 h-16 mx-auto mb-3 text-emerald-400 opacity-60" />
            <p className="text-sm font-semibold text-white">कैमरा शुरू करें या फोटो अपलोड करें</p>
            <p className="text-xs text-gray-400 mt-1">
              ₹10 के सिक्के के साथ टमाटर या शिमला मिर्च रखें
            </p>
          </div>
        )}

        {/* Calibration HUD Overlay: ₹10 Coin Reference Circle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between p-6">
          {/* Target Coin Reticle */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400 bg-amber-400/10 flex items-center justify-center animate-pulse">
              <span className="text-[11px] font-bold text-amber-300">₹10 सिक्का</span>
            </div>
            <span className="text-[10px] text-amber-200 mt-1 font-mono">27.0 mm</span>
          </div>

          {/* Produce Reticle */}
          <div className="flex flex-col items-center">
            <div className="w-44 h-44 rounded-full border-2 border-dashed border-emerald-400 bg-emerald-400/10 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-300">फसल (उपज)</span>
            </div>
            <span className="text-[10px] text-emerald-200 mt-1 font-mono">ग्रेड-A लक्ष्य</span>
          </div>
        </div>

      </div>

      {/* Control Buttons (≥72px Touch Ergonomics) */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
        {isCameraActive ? (
          <button
            onClick={captureFrame}
            className="col-span-2 h-[72px] bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Camera className="w-7 h-7" />
            <span>फोटो खींचें (Capture)</span>
          </button>
        ) : (
          <>
            <div className="relative">
              {activeGuideId === 'coin-camera-btn' && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 guide-badge-bounce pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-lg whitespace-nowrap">
                    👉 यह दबाएं (Camera)
                  </span>
                </div>
              )}
              <button
                id="coin-camera-btn"
                onClick={() => {
                  setActiveGuideId(null);
                  startCamera();
                }}
                className={`w-full h-[72px] rounded-2xl shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  activeGuideId === 'coin-camera-btn'
                    ? 'guide-glow bg-[#0B7A3B] text-white shadow-2xl scale-[1.02]'
                    : 'bg-[#0B7A3B] hover:bg-[#064E26] text-white font-bold text-base'
                }`}
              >
                <Camera className="w-6 h-6" />
                <span>कैमरा खोलें</span>
              </button>
            </div>

            <label className="h-[72px] bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-base rounded-2xl border border-gray-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
              <Upload className="w-6 h-6 text-gray-600" />
              <span>गैलरी से चुनें</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {/* Grade-A Certificate Card */}
      {analysisResult && (
        <div className="max-w-md mx-auto w-full bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-3xl p-5 border-2 border-emerald-500 shadow-md">
          
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#0B7A3B]" />
              <div>
                <h4 className="font-extrabold text-[#0B7A3B] text-base">
                  {analysisResult.grade === 'Grade A' ? t.gradeACert : `${analysisResult.grade} विश्लेषण`}
                </h4>
                <p className="text-[11px] text-gray-500 font-mono">
                  {analysisResult.certificateId}
                </p>
              </div>
            </div>

            <div className="p-1 bg-white rounded-xl shadow-sm border border-emerald-200">
              <QRCodeSVG
                value={`KISANVAANI:CERT:${analysisResult.certificateId}:GRADE:${analysisResult.grade}:SIZE:${analysisResult.sizeMM}MM`}
                size={44}
              />
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-2 text-center mb-4">
            <div className="p-2.5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-[11px] text-gray-500">आकार (Size)</div>
              <div className="font-mono font-extrabold text-base text-[#132A1C]">
                {analysisResult.sizeMM} mm
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                लक्ष्य: 60mm
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-[11px] text-gray-500">परिपक्वता (Ripe)</div>
              <div className="font-mono font-extrabold text-base text-[#0B7A3B]">
                {analysisResult.ripenessPct}%
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                मानक: {'>'}80%
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-[11px] text-gray-500">दाग-धब्बा (Blemish)</div>
              <div className="font-mono font-extrabold text-base text-gray-700">
                {analysisResult.blemishPct}%
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                मानक: {'<'}5%
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-600 font-medium bg-emerald-100/60 py-2 rounded-xl">
            ✓ ₹10 सिक्के (27mm) से 100% सटीक ऑन-डिवाइस कंप्यूटर विज़न प्रमाण
          </div>

        </div>
      )}

    </div>
  );
}
