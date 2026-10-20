'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  Gavel,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Filter,
  Mic,
  PhoneCall
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { CropListing } from '@/data/data';

interface LiveHarvestFeedProps {
  crops: CropListing[];
  onOpenBidModal: (crop: CropListing) => void;
  onBuyNow: (crop: CropListing) => void;
  searchQuery?: string;
}

export const LiveHarvestFeed: React.FC<LiveHarvestFeedProps> = ({
  crops = [],
  onOpenBidModal,
  onBuyNow,
  searchQuery = '',
}) => {
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'organic' | 'nearby' | 'high_health'>('all');

  const filteredCrops = crops.filter((crop) => {
    // Search match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      crop.title.toLowerCase().includes(q) ||
      crop.farmerName.toLowerCase().includes(q) ||
      crop.cluster.toLowerCase().includes(q) ||
      crop.grade.toLowerCase().includes(q);

    // Pill filter match
    let matchesFilter = true;
    if (selectedFilter === 'organic') {
      matchesFilter = crop.farmingType === 'Organic';
    } else if (selectedFilter === 'nearby') {
      matchesFilter = crop.locationKm <= 20;
    } else if (selectedFilter === 'high_health') {
      matchesFilter = crop.healthScore >= 97;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Live Harvest Feed
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-[#0B7A3B]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0B7A3B]" />
              Direct From Farm-Gate
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time harvest lots from verified solar polyhouse clusters with continuous IoT telemetry.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-emerald-100 text-[#0B7A3B] border border-emerald-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Lots ({crops.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('organic')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              selectedFilter === 'organic'
                ? 'bg-emerald-100 text-[#0B7A3B] border border-emerald-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Organic Only
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('nearby')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              selectedFilter === 'nearby'
                ? 'bg-emerald-100 text-[#0B7A3B] border border-emerald-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Within 20 km
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('high_health')}
            className={`rounded-lg px-2.5 py-1 font-bold transition-all cursor-pointer ${
              selectedFilter === 'high_health'
                ? 'bg-emerald-100 text-[#0B7A3B] border border-emerald-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            97%+ IoT Health
          </button>
        </div>
      </div>

      {filteredCrops.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-bold text-slate-700">No crop lots matched your filter.</p>
          <button
            onClick={() => setSelectedFilter('all')}
            className="mt-2 text-xs font-bold text-[#0B7A3B] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Grid of Crop Listing Cards */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCrops.map((crop) => {
            const radialData = [
              {
                name: 'Health',
                value: crop.healthScore,
                fill: '#0B7A3B',
              },
            ];

            return (
              <div
                key={crop.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                {/* Card Image Header with Overlays or Offline Voice Post Header */}
                {crop.isOfflineVoicePost || crop.imageUrl === 'OFFLINE_VOICE_POST' ? (
                  <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-[#064E26] via-[#0B7A3B] to-[#132A1C] p-4 text-white flex flex-col justify-between border-b border-emerald-600/30">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/25 px-2.5 py-1 text-[11px] font-black text-amber-200 border border-amber-300/40 animate-pulse">
                        <Mic className="h-3.5 w-3.5 text-amber-300" />
                        ऑफ़लाइन वॉइस पोस्ट (Offline Post)
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-200 bg-white/10 px-2 py-0.5 rounded-md">
                        <PhoneCall className="h-3 w-3" /> {crop.farmerPhone}
                      </span>
                    </div>

                    <div className="my-auto py-1">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-200/90 font-bold">
                        किसान की रिकॉर्डेड आवाज (IVR Speech):
                      </div>
                      <div className="mt-1 text-xs font-black text-white italic bg-black/40 p-2.5 rounded-xl border border-white/10 shadow-inner line-clamp-2">
                        &ldquo;{crop.rawSpeech || '300 किलो टमाटर 40 रुपये'}&rdquo;
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-emerald-100 border-t border-white/15 pt-1.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Twilio Call Verified
                      </span>
                      <span className="font-bold text-amber-300">
                        ₹{crop.buyNowPrice}/kg भाव
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={crop.imageUrl}
                      alt={crop.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient vignette for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                          {crop.grade}
                        </span>
                        <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs">
                          {crop.farmingType}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-700 backdrop-blur-xs shadow-xs">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        {crop.locationKm} km away
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                      <Clock className="h-3.5 w-3.5 text-[#FF8A00]" />
                      <span>Harvest Window: {crop.timeLeft}</span>
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Crop Title & Farmer Info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[#0B7A3B]">
                      {crop.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      {crop.farmerName} • <span className="text-slate-600 font-semibold">{crop.cluster}</span>
                    </p>
                  </div>

                  {/* Sensor Health Score Component with Interactive Tooltip */}
                  <div className="relative mt-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Mini Radial Gauge */}
                        <div className="relative h-12 w-12 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              innerRadius="72%"
                              outerRadius="100%"
                              data={radialData}
                              startAngle={90}
                              endAngle={-270}
                            >
                              <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                              />
                              <RadialBar
                                background={{ fill: '#d1fae5' }}
                                dataKey="value"
                                cornerRadius={10}
                              />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-[#0B7A3B]">
                            {crop.healthScore}%
                          </div>
                        </div>

                        {/* Text Description */}
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900">
                              Sensor Health Score
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveTooltipId(activeTooltipId === crop.id ? null : crop.id)
                              }
                              onMouseEnter={() => setActiveTooltipId(crop.id)}
                              onMouseLeave={() => setActiveTooltipId(null)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              aria-label="View IoT sensor details"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] font-semibold text-[#0B7A3B]">
                            {crop.healthMetrics.pesticide.split('(')[0]}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-[#0B7A3B]">
                          IoT Verified
                        </span>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Harvested {crop.healthMetrics.harvestedHoursAgo}h ago
                        </p>
                      </div>
                    </div>

                    {/* Interactive Tooltip Popover */}
                    {activeTooltipId === crop.id && (
                      <div className="absolute top-full left-0 z-30 mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl transition-all">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-[#0B7A3B]" />
                            Field Sensor Telemetry (Zero Abuse)
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTooltipId(null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            ×
                          </button>
                        </div>
                        <div className="mt-2 space-y-1.5 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Pesticide Residue:</span>
                            <span className="font-semibold text-emerald-700">
                              {crop.healthMetrics.pesticide}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Soil NPK Nutrition:</span>
                            <span className="font-semibold text-slate-700">
                              {crop.healthMetrics.npkLevel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Moisture & Crispness:</span>
                            <span className="font-semibold text-slate-700">
                              {crop.healthMetrics.moisture}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lot & Pricing Section */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-slate-400" />
                        Lot Size: <strong className="text-slate-700">{crop.lotSizeKg} kg</strong>
                      </span>
                      <span className="font-medium text-slate-600">
                        {crop.bidCount} active bids
                      </span>
                    </div>

                    {/* Pricing Comparison */}
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                      <div>
                        <span className="text-[11px] font-medium text-slate-500">Current Bid</span>
                        <div className="text-base font-bold text-slate-900">
                          ₹{crop.currentBid}
                          <span className="text-xs font-normal text-slate-500">/kg</span>
                        </div>
                      </div>

                      <div className="h-7 w-px bg-slate-200" />

                      <div className="text-right">
                        <span className="text-[11px] font-medium text-slate-500">Buy Now</span>
                        <div className="text-base font-bold text-[#0B7A3B]">
                          ₹{crop.buyNowPrice}
                          <span className="text-xs font-normal text-slate-500">/kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onOpenBidModal(crop)}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-[#0B7A3B] px-3 py-2.5 text-xs font-bold text-[#0B7A3B] transition-all hover:bg-[#0B7A3B]/5 active:scale-95 cursor-pointer"
                    >
                      <Gavel className="h-3.5 w-3.5" />
                      Place Bid
                    </button>

                    <button
                      type="button"
                      onClick={() => onBuyNow(crop)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0B7A3B] px-3 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#096330] active:scale-95 cursor-pointer"
                    >
                      Buy Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
