'use client';

import React, { useState } from 'react';
import {
  KeyRound,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  ShieldCheck,
  Search,
  Eye,
  ScanLine,
  QrCode
} from 'lucide-react';
import { OrderItem, EscrowStatus } from '@/data/data';

interface ActiveOrdersTableProps {
  orders: OrderItem[];
  onViewPasscode: (order: OrderItem) => void;
  onTrackRoute: (order: OrderItem) => void;
  onViewDetails: (order: OrderItem) => void;
  onOpenGateScanner: (order?: OrderItem) => void;
  onSelectOrderForLogistics?: (order: OrderItem) => void;
  selectedOrderId?: string;
}

export const ActiveOrdersTable: React.FC<ActiveOrdersTableProps> = ({
  orders = [],
  onViewPasscode,
  onTrackRoute,
  onViewDetails,
  onOpenGateScanner,
  onSelectOrderForLogistics,
  selectedOrderId,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [tableSearch, setTableSearch] = useState<string>('');

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.escrowStatus === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      order.cropName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      order.farmerName.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EscrowStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
            <Clock className="h-3 w-3 text-blue-500" />
            ACCEPTED
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-[#FF8A00]">
            <Truck className="h-3 w-3 text-[#FF8A00]" />
            IN_TRANSIT
          </span>
        );
      case 'HANDOVER_PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 animate-pulse">
            <KeyRound className="h-3 w-3 text-purple-600" />
            HANDOVER_PENDING
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#0B7A3B]">
            <CheckCircle2 className="h-3 w-3 text-[#0B7A3B]" />
            PAID
          </span>
        );
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Table Header with Filters and Scan QR Action */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Active Orders & Escrow Tracking
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
              {filteredOrders.length} Orders
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Funds held securely in KisanVaani Escrow until digital passcode validation at gate handover.
          </p>
        </div>

        {/* Scan Handover Button & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Prominent Scan QR / Passcode Handover */}
          <button
            type="button"
            onClick={() => onOpenGateScanner()}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 active:scale-95 transition-all cursor-pointer"
          >
            <ScanLine className="h-3.5 w-3.5" />
            Scan QR / Enter Passcode
          </button>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {['ALL', 'HANDOVER_PENDING', 'IN_TRANSIT', 'ACCEPTED', 'PAID'].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-2.5 py-1.5 font-bold transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {status === 'ALL'
                  ? 'All'
                  : status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-600 uppercase">
              <th className="py-3.5 pr-4 pl-2">Order ID</th>
              <th className="py-3.5 px-4">Crop & Qty</th>
              <th className="py-3.5 px-4">Farmer / Cluster</th>
              <th className="py-3.5 px-4">Total Value</th>
              <th className="py-3.5 px-4">Escrow Status</th>
              <th className="py-3.5 pr-2 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              const isSelected = selectedOrderId === order.id;

              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrderForLogistics?.(order)}
                  className={`group cursor-pointer transition-colors duration-150 hover:bg-slate-50/80 ${
                    isSelected ? 'bg-emerald-50/50' : ''
                  }`}
                >
                  {/* Order ID */}
                  <td className="py-4 pr-4 pl-2 font-mono text-xs font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="group-hover:text-[#0B7A3B] transition-colors">{order.id}</span>
                      {isSelected && (
                        <span className="rounded bg-emerald-200 px-1 py-0.2 text-[9px] font-bold text-emerald-900">
                          Selected
                        </span>
                      )}
                    </div>
                    <span className="block text-[11px] font-normal text-slate-600">
                      {order.orderedAt}
                    </span>
                  </td>

                  {/* Crop & Quantity */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900">{order.cropName}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-mono font-bold text-slate-700">
                        {order.quantityKg} kg
                      </span>
                      {order.temperatureC && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600">
                          {order.temperatureC}°C Reefer
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Farmer */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900">{order.farmerName}</div>
                    <div className="text-xs text-slate-600">{order.farmerLocation}</div>
                  </td>

                  {/* Total Value */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    ₹{order.totalValue.toLocaleString('en-IN')}
                    <span className="block text-[10px] font-sans font-normal text-slate-600">
                      ₹{(order.totalValue / order.quantityKg).toFixed(1)}/kg all-in
                    </span>
                  </td>

                  {/* Escrow Status Pill */}
                  <td className="py-4 px-4">
                    {getStatusBadge(order.escrowStatus)}
                    {order.eta && (
                      <span className="mt-1 block text-[10px] text-slate-600">
                        {order.eta}
                      </span>
                    )}
                  </td>

                  {/* Action Column */}
                  <td className="py-4 pr-2 pl-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.escrowStatus === 'HANDOVER_PENDING' ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewPasscode(order);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-purple-700 active:scale-95 cursor-pointer"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                            View Passcode
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenGateScanner(order);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 cursor-pointer"
                            title="Verify Handover at Gate"
                          >
                            <ScanLine className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : order.escrowStatus === 'IN_TRANSIT' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTrackRoute(order);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                        >
                          <Truck className="h-3 w-3 text-[#FF8A00]" />
                          Track Route
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(order);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          <Eye className="h-3 w-3 text-slate-400" />
                          Details
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Helper Note */}
      <div className="mt-4 flex flex-col justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600 sm:flex-row sm:items-center">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-[#0B7A3B]" />
          Smart Contract Auto-Settlement: Scan QR or enter driver passcode to release funds instantly to farmer.
        </span>
        <span className="font-semibold text-slate-600">
          Click any row to test logistics ring routing
        </span>
      </div>
    </section>
  );
};
