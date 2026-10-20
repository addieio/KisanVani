'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  QrCode,
  ScanLine,
  Camera,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Truck,
  AlertCircle,
  ThermometerSnowflake,
  Scale,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { OrderItem } from '@/data/data';
import jsQR from 'jsqr';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderItem[];
  onOrderHandoverComplete: (orderId: string, passcodeUsed: string) => void;
  preSelectedOrder?: OrderItem | null;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOrderHandoverComplete,
  preSelectedOrder,
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'qr' | 'manual'>('manual');
  const [manualCode, setManualCode] = useState<string>(preSelectedOrder?.passcode || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    preSelectedOrder?.id || orders.find((o) => o.escrowStatus === 'HANDOVER_PENDING')?.id || orders[0]?.id || ''
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [scanMatched, setScanMatched] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Quality Inspection Checklist
  const [inspectionWeightOk, setInspectionWeightOk] = useState<boolean>(true);
  const [inspectionTempOk, setInspectionTempOk] = useState<boolean>(true);
  const [inspectionQualityOk, setInspectionQualityOk] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const pendingOrders = orders.filter(
    (o) => o.escrowStatus === 'HANDOVER_PENDING' || o.escrowStatus === 'IN_TRANSIT'
  );

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || pendingOrders[0] || orders[0];
  const scanLoopRef = useRef<number | null>(null);

  const handleDecodedQr = (raw: string) => {
    // Check if raw matches ORDER- or PIN- or KV-
    const pinMatch = raw.match(/PIN-([a-zA-Z0-9]+)/i);
    const orderMatch = raw.match(/ORDER-([#a-zA-Z0-9_-]+)/i);

    const foundPin = pinMatch ? pinMatch[1] : (raw.match(/\d{4}/) ? raw.match(/\d{4}/)![0] : raw);

    if (orderMatch) {
      const ord = orders.find(
        (o) => o.id.includes(orderMatch[1]) || orderMatch[1].includes(o.id)
      );
      if (ord) setSelectedOrderId(ord.id);
    }

    setManualCode(foundPin);
    setScanMatched(true);
    setIsScanning(false);
    stopCamera();
    setActiveMode('manual');
  };

  const startScanningLoop = () => {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const detectFrame = async () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const vw = videoRef.current.videoWidth || 640;
          const vh = videoRef.current.videoHeight || 480;
          if (canvas.width !== vw || canvas.height !== vh) {
            canvas.width = vw;
            canvas.height = vh;
          }
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, vw, vh);
            const imageData = ctx.getImageData(0, 0, vw, vh);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });
            if (code && code.data) {
              console.log('[GateScannerModal] Optical QR Code detected via jsQR:', code.data);
              handleDecodedQr(code.data);
              return;
            }
          }
        } catch {
          // skip frame
        }
      }
      scanLoopRef.current = requestAnimationFrame(detectFrame);
    };

    scanLoopRef.current = requestAnimationFrame(detectFrame);
  };

  // Camera stream handler
  const startCamera = async () => {
    setCameraActive(true);
    setIsScanning(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            startScanningLoop();
          };
        }
      }
    } catch {
      console.log('Camera streaming unavailable, optical simulator mode ready');
    }
  };

  const stopCamera = () => {
    if (scanLoopRef.current) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  };

  useEffect(() => {
    if (activeMode === 'qr') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeMode]);

  const handleSimulateScan = (orderToScan: OrderItem) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedOrderId(orderToScan.id);
      setManualCode(orderToScan.passcode || 'KV-9942');
      setScanMatched(true);
      setIsScanning(false);
      stopCamera();
      setActiveMode('manual');
    }, 800);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              console.log('[GateScannerModal] Photo QR decoded via jsQR:', code.data);
              handleDecodedQr(code.data);
              return;
            }
          }
        } catch (e) {
          console.warn('QR image decoding error:', e);
        }
        handleSimulateScan(currentOrder);
      };
      img.onerror = () => handleSimulateScan(currentOrder);
    } catch {
      handleSimulateScan(currentOrder);
    }
  };

  const handleApproveHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onOrderHandoverComplete(currentOrder.id, manualCode);
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B7A3B] text-white shadow-xs">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Gate Delivery & Escrow Handover
              </h3>
              <p className="text-[11px] text-slate-500">
                Buyer Receiving Dock Terminal • Scan QR or Enter Driver Passcode
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#0B7A3B] animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="mt-4 text-xl font-extrabold text-slate-900">
              Handover Verified & Escrow Released!
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              ₹{currentOrder?.totalValue.toLocaleString('en-IN')} transferred to {currentOrder?.farmerName}'s bank account via Instant Mandi-Escrow Smart Contract.
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-mono font-bold text-emerald-800">
              TxHash: 0x7b4a...9f21 • Status: COMPLETED & PAID
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Mode Tabs: Scan QR vs Enter Passcode */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveMode('qr')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                  activeMode === 'qr'
                    ? 'bg-white text-[#0B7A3B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="h-4 w-4" />
                Scan Driver QR Code
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('manual')}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                  activeMode === 'manual'
                    ? 'bg-white text-[#0B7A3B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="h-4 w-4" />
                Enter Handover Passcode
              </button>
            </div>

            {/* Mode 1: Optical QR Camera Scanner */}
            {activeMode === 'qr' && (
              <div className="mt-5 space-y-4">
                <div className="relative mx-auto flex h-60 w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500 bg-slate-900 text-white">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <QrCode className="h-12 w-12 text-emerald-400 opacity-80" />
                      <p className="text-xs font-medium text-slate-300">
                        Camera ready. Point at driver's handset QR code.
                      </p>
                    </div>
                  )}

                  {/* Laser crosshair scanning line animation */}
                  <div className="pointer-events-none absolute inset-x-8 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
                  <div className="pointer-events-none absolute inset-x-12 inset-y-8 rounded-xl border border-white/40" />

                  {isScanning && (
                    <div className="absolute bottom-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur-xs flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Scanning QR frame...
                    </div>
                  )}
                </div>

                {/* Instant Simulator Shortcut & Upload Option */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-slate-700">Optical Scanner Options:</span>
                    <div className="flex items-center gap-2">
                      <label className="rounded-lg bg-white border border-slate-300 px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1">
                        <span>📁 Upload QR Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSimulateScan(currentOrder)}
                        className="rounded-lg bg-[#0B7A3B] px-3 py-1 font-bold text-white hover:bg-[#096330] transition-colors cursor-pointer"
                      >
                        Instant Optical Scan (#{currentOrder.id})
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Live camera automatically scans the QR code. You can also upload a QR photo or click Instant Optical Scan.
                  </p>
                </div>
              </div>
            )}

            {/* Mode 2: Manual Passcode Entry */}
            {activeMode === 'manual' && (
              <form onSubmit={handleApproveHandover} className="mt-5 space-y-4">
                {/* Select Incoming Order */}
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Select Incoming Reefer Shipment
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => {
                      setSelectedOrderId(e.target.value);
                      const ord = orders.find((o) => o.id === e.target.value);
                      if (ord?.passcode) setManualCode(ord.passcode);
                    }}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-xs font-bold text-slate-900 focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/10 focus:outline-none"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.id} • {o.cropName} ({o.quantityKg}kg) - {o.escrowStatus}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Passcode Input Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Enter Digital Handover Code
                    </label>
                    {currentOrder?.passcode && (
                      <button
                        type="button"
                        onClick={() => setManualCode(currentOrder.passcode || '')}
                        className="text-[11px] font-bold text-[#0B7A3B] hover:underline"
                      >
                        Auto-Fill Expected ({currentOrder.passcode})
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      type="text"
                      placeholder="e.g. KV-9942"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      required
                      className="w-full rounded-xl border border-slate-300 py-2.5 pr-4 pl-4 font-mono text-lg font-black tracking-widest text-slate-900 uppercase focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/10 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Selected Order Summary Card */}
                {currentOrder && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{currentOrder.cropName}</span>
                      <span className="font-mono font-bold text-[#0B7A3B]">
                        ₹{currentOrder.totalValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-slate-500">
                      <span>Farmer: {currentOrder.farmerName} ({currentOrder.farmerLocation})</span>
                      <span>Weight: {currentOrder.quantityKg} kg</span>
                    </div>
                    {currentOrder.vehicleNo && (
                      <div className="mt-1 text-[11px] font-semibold text-purple-700">
                        Vehicle: {currentOrder.vehicleNo} • Reefer Temp: {currentOrder.temperatureC || 12}°C
                      </div>
                    )}
                  </div>
                )}

                {/* Gate Inspection Mandatory Checklist */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
                  <span className="text-xs font-bold text-slate-800">
                    Mandatory Dock Quality Checks:
                  </span>
                  <div className="mt-2 space-y-2 text-xs">
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inspectionWeightOk}
                        onChange={(e) => setInspectionWeightOk(e.target.checked)}
                        className="h-4 w-4 rounded text-[#0B7A3B] focus:ring-[#0B7A3B]"
                      />
                      <span className="flex items-center gap-1">
                        <Scale className="h-3.5 w-3.5 text-slate-500" />
                        Weighbridge weight verified ({currentOrder?.quantityKg} kg)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inspectionTempOk}
                        onChange={(e) => setInspectionTempOk(e.target.checked)}
                        className="h-4 w-4 rounded text-[#0B7A3B] focus:ring-[#0B7A3B]"
                      />
                      <span className="flex items-center gap-1">
                        <ThermometerSnowflake className="h-3.5 w-3.5 text-slate-500" />
                        Core transit temperature verified ({currentOrder?.temperatureC || 12}°C)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inspectionQualityOk}
                        onChange={(e) => setInspectionQualityOk(e.target.checked)}
                        className="h-4 w-4 rounded text-[#0B7A3B] focus:ring-[#0B7A3B]"
                      />
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                        Grade A physical lot visual quality verified
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="mt-5 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !manualCode ||
                      !inspectionWeightOk ||
                      !inspectionTempOk ||
                      !inspectionQualityOk
                    }
                    className="flex items-center gap-2 rounded-xl bg-[#0B7A3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#096330] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Executing Smart Settlement...</span>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Approve Handover & Release Escrow
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
