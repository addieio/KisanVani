'use client';

import React, { useState } from 'react';
import {
  X,
  Truck,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { LogisticsRing } from '@/data/data';

interface FreightBookingModalProps {
  ring: LogisticsRing | null;
  weightKg: number;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirmed: (ringId: number, freightCost: number) => void;
}

export const FreightBookingModal: React.FC<FreightBookingModalProps> = ({
  ring,
  weightKg,
  isOpen,
  onClose,
  onBookingConfirmed,
}) => {
  if (!isOpen || !ring) return null;

  const [pickupSlot, setPickupSlot] = useState<string>('Morning (06:00 AM - 09:00 AM)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const freightCost = Math.round(weightKg * ring.ratePerKg);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onBookingConfirmed(ring.ringId, freightCost);
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Lock Dedicated Freight Capacity</h3>
              <p className="text-[11px] text-slate-500">KisanVaani Cold Chain Telematics</p>
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
            <h4 className="mt-4 text-lg font-bold text-slate-900">Reefer Freight Reserved!</h4>
            <p className="mt-1 text-xs text-slate-500">
              ₹{freightCost.toLocaleString('en-IN')} locked for {weightKg}kg via {ring.title}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirm} className="p-6 space-y-4">
            {/* Ring Summary */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{ring.title}</span>
                <span className="font-mono font-bold text-[#0B7A3B]">₹{ring.ratePerKg}/kg</span>
              </div>
              <p className="mt-1 text-slate-500">{ring.description}</p>
              <div className="mt-2 flex items-center justify-between font-semibold text-emerald-700">
                <span className="flex items-center gap-1">
                  <Leaf className="h-3.5 w-3.5" /> {ring.co2SavingsPercent}% Carbon Reduction
                </span>
                <span>ETA: {ring.leadTimeHours}</span>
              </div>
            </div>

            {/* Booking Parameters */}
            <div>
              <label className="text-xs font-bold text-slate-700">
                Choose Reefer Dispatch Slot
              </label>
              <select
                value={pickupSlot}
                onChange={(e) => setPickupSlot(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 py-2.5 px-3 text-xs font-semibold text-slate-900 focus:border-[#0B7A3B] focus:outline-none"
              >
                <option value="Early Morning (04:00 AM - 07:00 AM)">
                  Early Morning (04:00 AM - 07:00 AM) • Best for crisp leafy greens
                </option>
                <option value="Morning (07:00 AM - 10:00 AM)">
                  Morning (07:00 AM - 10:00 AM) • Standard Hub departure
                </option>
                <option value="Afternoon Express (12:00 PM - 03:00 PM)">
                  Afternoon Express (12:00 PM - 03:00 PM)
                </option>
              </select>
            </div>

            {/* Cost Details */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Reserved Payload:</span>
                <span className="font-mono font-bold text-slate-900">{weightKg} kg</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-slate-600">Rate per Kilogram:</span>
                <span className="font-mono font-bold text-slate-900">₹{ring.ratePerKg}/kg</span>
              </div>
              <div className="my-2 h-px bg-emerald-200/50" />
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Locked Freight Total:</span>
                <span className="text-lg text-[#0B7A3B]">₹{freightCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 rounded-xl bg-[#0B7A3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#096330]"
              >
                {isSubmitting ? (
                  <span>Allocating Reefer...</span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Confirm Booking (₹{freightCost.toLocaleString('en-IN')})
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
