'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  MapPin,
  Clock,
  Minus,
  Plus,
  Weight
} from 'lucide-react';
import { CropListing, LOGISTICS_RINGS } from '@/data/data';

interface BuyNowModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurchase: (crop: CropListing, quantityKg: number, ringId: number, totalCost: number) => void;
}

export const BuyNowModal: React.FC<BuyNowModalProps> = ({
  crop,
  isOpen,
  onClose,
  onConfirmPurchase,
}) => {
  if (!isOpen || !crop) return null;

  const maxKg = crop.availableLots * crop.lotSizeKg;
  const minKg = 1;

  const [quantityKg, setQuantityKg] = useState<number>(crop.lotSizeKg);
  const [customInput, setCustomInput] = useState<string>(String(crop.lotSizeKg));
  const [selectedRingId, setSelectedRingId] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const produceCost = quantityKg * crop.buyNowPrice;
  const activeRing = LOGISTICS_RINGS.find((r) => r.ringId === selectedRingId) || LOGISTICS_RINGS[1];
  const freightCost = Math.round(quantityKg * activeRing.ratePerKg);
  const totalAmount = produceCost + freightCost;

  // Lots equivalent (for the callback — always pass at least 1)
  const lotsEquivalent = Math.max(1, Math.ceil(quantityKg / crop.lotSizeKg));

  const updateQuantity = (newKg: number) => {
    const clamped = Math.max(minKg, Math.min(maxKg, Math.round(newKg)));
    setQuantityKg(clamped);
    setCustomInput(String(clamped));
  };

  const handleCustomInputChange = (val: string) => {
    setCustomInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= minKg && parsed <= maxKg) {
      setQuantityKg(parsed);
    }
  };

  const handleCustomInputBlur = () => {
    const parsed = parseInt(customInput, 10);
    if (isNaN(parsed) || parsed < minKg) {
      updateQuantity(minKg);
    } else if (parsed > maxKg) {
      updateQuantity(maxKg);
    } else {
      updateQuantity(parsed);
    }
  };

  // Preset quantity options
  const presets = [
    { label: '50 kg', value: 50 },
    { label: '100 kg', value: 100 },
    { label: '250 kg', value: 250 },
    { label: '500 kg', value: 500 },
    { label: '1 Lot', value: crop.lotSizeKg },
    { label: 'Max', value: maxKg },
  ].filter((p) => p.value <= maxKg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmPurchase(crop, quantityKg, selectedRingId, totalAmount);
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B7A3B] text-white shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Farm-Gate Checkout</h3>
              <p className="text-[11px] text-slate-500">Flexible Quantity &amp; Reefer Dispatch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#0B7A3B]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-900">Purchase Confirmed!</h4>
            <p className="mt-1 text-xs text-slate-500">
              ₹{totalAmount.toLocaleString('en-IN')} escrow-reserved. {quantityKg}kg dispatched to {crop.farmerName}. 📞 Calling farmer now...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Crop Card Summary */}
            <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <img
                src={crop.imageUrl}
                alt={crop.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{crop.title}</h4>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-[#0B7A3B]">
                    {crop.grade}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {crop.farmerName} • {crop.cluster}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="font-bold text-[#0B7A3B]">₹{crop.buyNowPrice}/kg</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Available: {maxKg.toLocaleString('en-IN')} kg</span>
                </div>
              </div>
            </div>

            {/* Flexible Quantity Selection */}
            <div className="mt-5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Weight className="h-3.5 w-3.5" />
                Enter Quantity (kg)
              </label>

              {/* Manual Input + Increment/Decrement */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(quantityKg - 10)}
                  disabled={quantityKg <= minKg}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min={minKg}
                    max={maxKg}
                    value={customInput}
                    onChange={(e) => handleCustomInputChange(e.target.value)}
                    onBlur={handleCustomInputBlur}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-lg font-bold text-slate-900 focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/20 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                    kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => updateQuantity(quantityKg + 10)}
                  disabled={quantityKg >= maxKg}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Range Slider */}
              <div className="mt-3 px-1">
                <input
                  type="range"
                  min={minKg}
                  max={maxKg}
                  step={1}
                  value={quantityKg}
                  onChange={(e) => updateQuantity(parseInt(e.target.value, 10))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#0B7A3B]"
                  style={{
                    background: `linear-gradient(to right, #0B7A3B ${((quantityKg - minKg) / (maxKg - minKg)) * 100}%, #e2e8f0 ${((quantityKg - minKg) / (maxKg - minKg)) * 100}%)`,
                  }}
                />
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>{minKg} kg</span>
                  <span>{Math.round(maxKg / 2)} kg</span>
                  <span>{maxKg} kg</span>
                </div>
              </div>

              {/* Quick-Select Preset Buttons */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {presets.map((preset) => (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => updateQuantity(preset.value)}
                    className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                      quantityKg === preset.value
                        ? 'border-[#0B7A3B] bg-emerald-50 text-[#0B7A3B]'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logistics Ring Choice */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700">
                Select Cold-Chain Logistics Ring
              </label>
              <div className="mt-1.5 space-y-1.5">
                {LOGISTICS_RINGS.map((ring) => (
                  <div
                    key={ring.ringId}
                    onClick={() => setSelectedRingId(ring.ringId)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition-all ${
                      selectedRingId === ring.ringId
                        ? 'border-[#0B7A3B] bg-emerald-50/50 ring-1 ring-[#0B7A3B]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">R{ring.ringId}:</span>
                      <span className="font-medium text-slate-700">{ring.title.split(':')[1]}</span>
                      {ring.isRecommended && (
                        <span className="rounded bg-[#0B7A3B] px-1.5 py-0.2 text-[9px] font-bold text-white">
                          Best Value
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{ring.ratePerKg}/kg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Produce ({quantityKg.toLocaleString('en-IN')} kg × ₹{crop.buyNowPrice}/kg):</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{produceCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-slate-600">Refrigerated Logistics (R{selectedRingId}):</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{freightCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="my-2 h-px bg-emerald-200/50" />
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Total Escrow Reservation:</span>
                <span className="font-bold text-lg text-[#0B7A3B]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || quantityKg < minKg}
                className="flex items-center gap-2 rounded-xl bg-[#0B7A3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#096330] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Reserving Escrow...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Lock ₹{totalAmount.toLocaleString('en-IN')} & Dispatch
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
