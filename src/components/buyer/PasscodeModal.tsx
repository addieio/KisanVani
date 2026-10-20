'use client';

import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  Truck,
  QrCode,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { OrderItem } from '@/data/data';

interface PasscodeModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const [copied, setCopied] = useState<boolean>(false);
  const passcode = order.passcode || 'KV-9942';

  const handleCopy = () => {
    navigator.clipboard.writeText(passcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-purple-50/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dock Handover Passcode</h3>
              <p className="text-[11px] text-purple-700 font-medium">Order {order.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Produce & Driver Alert */}
          <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{order.cropName}</span>
              <span className="font-mono text-xs font-bold text-purple-700">
                {order.quantityKg} kg
              </span>
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-slate-400" />
                <span>Driver: {order.farmerName} • Reefer: <strong>{order.vehicleNo || 'HR-10-BX-4421'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Receiving Dock: <strong>Dock Bay 2 (Cold Room Ingress)</strong></span>
              </div>
            </div>
          </div>

          {/* Large Passcode Display */}
          <div className="mt-5 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Single-Use Unloading Code
            </span>

            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="flex items-center justify-center rounded-2xl border-2 border-purple-200 bg-slate-50 px-6 py-3.5 font-mono text-3xl font-black tracking-widest text-slate-900 shadow-inner">
                {passcode}
              </div>

              <button
                onClick={handleCopy}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-95"
                title="Copy Passcode"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Copy className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>

            {copied && (
              <span className="mt-1.5 block text-xs font-bold text-emerald-600">
                Copied to clipboard!
              </span>
            )}
          </div>

          {/* QR Code Graphic Simulation */}
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
            <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-white p-2 shadow-xs border border-slate-200">
              <div className="grid grid-cols-4 gap-1.5 w-full h-full p-1 bg-slate-900 rounded">
                <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs"></div>
                <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                <div className="bg-slate-900"></div>
                <div className="bg-white rounded-xs"></div>
              </div>
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              Driver can scan directly via KisanVaani Logistics Handset
            </p>
          </div>

          {/* Escrow Disclaimer Notice */}
          <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[11px] leading-relaxed">
              <strong>Caution:</strong> Share this passcode with the cold chain driver only AFTER your dock supervisor completes visual weight inspection and temperature check.
            </p>
          </div>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
