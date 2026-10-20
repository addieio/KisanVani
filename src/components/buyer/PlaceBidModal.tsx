'use client';

import React, { useState } from 'react';
import {
  X,
  Gavel,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { CropListing } from '@/data/data';

interface PlaceBidModalProps {
  crop: CropListing | null;
  isOpen: boolean;
  onClose: () => void;
  onBidConfirmed: (cropId: string, bidAmount: number, lots: number) => void;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  crop,
  isOpen,
  onClose,
  onBidConfirmed,
}) => {
  if (!isOpen || !crop) return null;

  const [bidAmount, setBidAmount] = useState<number>(crop.currentBid + 3);
  const [selectedLots, setSelectedLots] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const minBid = crop.currentBid + 1;
  const totalWeightKg = selectedLots * crop.lotSizeKg;
  const totalEscrowHold = Math.round(bidAmount * totalWeightKg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < minBid) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onBidConfirmed(crop.id, bidAmount, selectedLots);
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

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[#0B7A3B]">
              <Gavel className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Place Binding Escrow Bid</h3>
              <p className="text-[11px] text-slate-500">KisanVaani B2B Smart Auction</p>
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
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#0B7A3B]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-900">Bid Confirmed & Escrow Reserved!</h4>
            <p className="mt-1 text-xs text-slate-500">
              ₹{totalEscrowHold.toLocaleString('en-IN')} locked in escrow for {totalWeightKg}kg of{' '}
              {crop.title}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Selected Crop Summary */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <img
                src={crop.imageUrl}
                alt={crop.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{crop.title}</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-[#0B7A3B]">
                    {crop.grade}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {crop.farmerName} • {crop.cluster}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs">
                  <span className="text-slate-600">
                    Current High Bid: <strong className="text-slate-900">₹{crop.currentBid}/kg</strong>
                  </span>
                  <span className="text-[#0B7A3B] font-semibold">
                    Buy Now: ₹{crop.buyNowPrice}/kg
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs Section */}
            <div className="mt-5 space-y-4">
              {/* Bid Amount Input */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Your Bid Amount per Kilogram (₹/kg)
                  </label>
                  <span className="text-[11px] font-medium text-amber-700">
                    Min required: ₹{minBid}/kg
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 font-bold text-slate-400">
                    ₹
                  </div>
                  <input
                    type="number"
                    min={minBid}
                    max={crop.buyNowPrice - 1}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    required
                    className="w-full rounded-xl border border-slate-300 py-2.5 pr-16 pl-8 font-mono text-base font-bold text-slate-900 focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/10 focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-semibold text-slate-400">
                    /kg
                  </div>
                </div>
              </div>

              {/* Lot Quantity Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700">
                  Lots to Purchase ({crop.lotSizeKg} kg per lot)
                </label>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[1, 2, Math.min(3, crop.availableLots)].map((lots) => (
                    <button
                      type="button"
                      key={lots}
                      onClick={() => setSelectedLots(lots)}
                      className={`rounded-xl border py-2 text-center text-xs font-bold transition-all ${
                        selectedLots === lots
                          ? 'border-[#0B7A3B] bg-emerald-50 text-[#0B7A3B]'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lots} Lot ({lots * crop.lotSizeKg} kg)
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Lock Details Box */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Total Produce Weight:</span>
                  <span className="font-mono font-bold text-slate-900">{totalWeightKg} kg</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Proposed Rate:</span>
                  <span className="font-mono font-bold text-slate-900">₹{bidAmount}/kg</span>
                </div>
                <div className="my-2 h-px bg-emerald-200/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Total Escrow Hold:</span>
                  <span className="text-lg font-bold text-[#0B7A3B]">
                    ₹{totalEscrowHold.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#0B7A3B]" />
                  Funds remain locked in RBI-compliant escrow and are released only on QR handover.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || bidAmount < minBid}
                className="flex items-center gap-1.5 rounded-xl bg-[#0B7A3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#096330] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Escrow...</span>
                ) : (
                  <>
                    <Gavel className="h-3.5 w-3.5" />
                    Confirm ₹{bidAmount}/kg Bid
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
