'use client';

import React from 'react';
import {
  X,
  Truck,
  MapPin,
  Clock,
  ThermometerSnowflake,
  ShieldCheck,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { OrderItem } from '@/data/data';

interface OrderDetailsModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPasscode: (order: OrderItem) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenPasscode,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Shipment Telematics</h3>
                <span className="font-mono text-xs font-bold text-slate-600">{order.id}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Continuous IoT Cold-Chain Monitoring
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Status & ETA Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <span className="text-xs font-semibold text-slate-500">Shipment Status</span>
              <div className="mt-0.5 text-sm font-bold text-slate-900">
                {order.escrowStatusLabel}
              </div>
            </div>
            {order.eta && (
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Live ETA</span>
                <div className="mt-0.5 text-xs font-bold text-[#0B7A3B]">
                  {order.eta}
                </div>
              </div>
            )}
          </div>

          {/* GPS Route Simulation Map */}
          <div className="relative h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-4">
            {/* Route graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
            
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#0B7A3B]" />
                  Origin: {order.farmerLocation}
                </span>
                <span className="flex items-center gap-1 text-[#0B7A3B]">
                  <Truck className="h-4 w-4 animate-bounce" />
                  In Transit • NH-44 Corridor
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-purple-600" />
                  FreshBite Cold Room Dock 2
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative my-auto w-full">
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-[#0B7A3B]"
                    style={{
                      width:
                        order.escrowStatus === 'PAID'
                          ? '100%'
                          : order.escrowStatus === 'HANDOVER_PENDING'
                          ? '92%'
                          : '65%',
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Passed: Sonipat Agri-Cluster Toll</span>
                <span className="font-semibold text-slate-700">Speed: 42 km/h • Reefer Active</span>
                <span>Distance to Dock: 8.4 km</span>
              </div>
            </div>
          </div>

          {/* Vehicle & Telematics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-slate-500">Reefer Truck & Driver:</span>
              <div className="mt-1 font-bold text-slate-900">{order.vehicleNo || 'HR-10-BX-4421'}</div>
              <div className="text-slate-600">{order.farmerName} (Verified Transporter)</div>
              <button
                onClick={() => alert(`Calling driver at +91 98124-77102...`)}
                className="mt-2 flex items-center gap-1 font-bold text-[#0B7A3B] hover:underline"
              >
                <Phone className="h-3 w-3" /> Call Driver
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <span className="text-slate-500">Cargo Core Temperature:</span>
              <div className="mt-1 flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                {order.temperatureC || 12}°C (Optimal Cold Chain)
              </div>
              <div className="text-[11px] text-slate-500">Zero thermal abuse detected</div>
              <span className="mt-2 inline-block rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-[#0B7A3B]">
                Sensor Verified
              </span>
            </div>
          </div>

          {/* Order Details & Invoicing */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Crop & Variety:</span>
              <span className="font-bold text-slate-900">{order.cropName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Billed Weight:</span>
              <span className="font-mono font-bold text-slate-900">{order.quantityKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Escrow Value:</span>
              <span className="font-mono font-bold text-[#0B7A3B]">
                ₹{order.totalValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => alert(`GST Tax Invoice PDF for ${order.id} downloaded successfully.`)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              Download GST Tax Invoice
            </button>

            {order.escrowStatus === 'HANDOVER_PENDING' ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenPasscode(order);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
              >
                View Handover Passcode
              </button>
            ) : (
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
