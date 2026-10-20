'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/buyer/Sidebar';
import { Topbar } from '@/components/buyer/Topbar';
import { QuickStats } from '@/components/buyer/QuickStats';
import { LiveHarvestFeed } from '@/components/buyer/LiveHarvestFeed';
import { ActiveOrdersTable } from '@/components/buyer/ActiveOrdersTable';
import { LogisticsCalculator } from '@/components/buyer/LogisticsCalculator';
import { PlaceBidModal } from '@/components/buyer/PlaceBidModal';
import { PasscodeModal } from '@/components/buyer/PasscodeModal';
import { GateScannerModal } from '@/components/buyer/GateScannerModal';
import { BuyNowModal } from '@/components/buyer/BuyNowModal';
import { OrderDetailsModal } from '@/components/buyer/OrderDetailsModal';
import { FreightBookingModal } from '@/components/buyer/FreightBookingModal';
import { OfflineOrderDemo } from '@/components/OfflineOrderDemo';
import {
  CropListing,
  OrderItem,
  LogisticsRing,
  ACTIVE_ORDERS,
  CROP_LISTINGS,
  LOGISTICS_RINGS
} from '@/data/data';
import { placeOrder } from '@/app/actions/placeOrder';
import { supabase } from '@/lib/supabase';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  MapPin,
  ScanLine,
  QrCode,
  Users2,
  Wheat,
  Truck,
  Building2,
  Phone,
  Activity,
  PlusCircle,
  FileCheck2,
  Wallet
} from 'lucide-react';

export default function BuyerPortalPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live mutable state
  const [orders, setOrders] = useState<OrderItem[]>(ACTIVE_ORDERS);
  const [crops, setCrops] = useState<CropListing[]>(CROP_LISTINGS);
  const [escrowBalance, setEscrowBalance] = useState<number>(450000);

  // Modals state
  const [selectedCropForBid, setSelectedCropForBid] = useState<CropListing | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);

  const [selectedCropForBuyNow, setSelectedCropForBuyNow] = useState<CropListing | null>(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState<boolean>(false);

  const [selectedOrderForPasscode, setSelectedOrderForPasscode] = useState<OrderItem | null>(null);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);

  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<OrderItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const [isGateScannerOpen, setIsGateScannerOpen] = useState<boolean>(false);
  const [gateScannerPreSelectedOrder, setGateScannerPreSelectedOrder] = useState<OrderItem | null>(null);

  const [selectedRingForFreight, setSelectedRingForFreight] = useState<LogisticsRing | null>(null);
  const [freightWeightKg, setFreightWeightKg] = useState<number>(500);
  const [isFreightModalOpen, setIsFreightModalOpen] = useState<boolean>(false);

  // Selected Order for Logistics Ring Calculator
  const [selectedLogisticsOrder, setSelectedLogisticsOrder] = useState<OrderItem | null>(
    orders[0] || null
  );

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Realtime Supabase Subscription for listings & orders
  useEffect(() => {
    // 1. Fetch from central /api/listings & /api/orders with live auto-refresh
    const fetchLiveListings = async () => {
      try {
        const res = await fetch('/api/listings');
        if (res.ok) {
          const data = await res.json();
          if (data.listings && Array.isArray(data.listings) && data.listings.length > 0) {
            setCrops((prev) => {
              const currentIds = new Set(prev.map((p) => p.id));
              const hasNew = data.listings.some((l: CropListing) => !currentIds.has(l.id));
              if (hasNew) {
                const latestNew = data.listings.find((l: CropListing) => !currentIds.has(l.id));
                if (latestNew) {
                  showToast(
                    latestNew.isOfflineVoicePost
                      ? `📞 नई ऑफ़लाइन वॉइस लिस्टिंग दर्ज: ${latestNew.title} (${latestNew.lotSizeKg}kg @ ₹${latestNew.buyNowPrice}/kg)`
                      : `⚡ नया हार्वेस्ट लॉट ऐप से जुड़ा: ${latestNew.title} (${latestNew.lotSizeKg}kg @ ₹${latestNew.buyNowPrice}/kg)`
                  );
                }
              }
              return data.listings;
            });
          }
        }
      } catch (err) {
        console.warn('API listings fetch note:', err);
      }
    };

    fetchLiveListings();
    const listingsPoll = setInterval(fetchLiveListings, 2500);

    // Subscribe to realtime changes in Supabase
    const channel = supabase
      .channel('public:realtime_buyer_feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'listings' },
        (payload) => {
          const l = payload.new as any;
          const isOffline = l.photos?.[0] === 'OFFLINE_VOICE_POST' || l.photos?.includes('OFFLINE_VOICE_POST');
          
          let price = Number(l.base_price_per_kg);
          if (!price || isNaN(price)) {
            const match = (l.crop || '').match(/₹\s*(\d+)/);
            price = match ? Number(match[1]) : 40;
          }

          const cleanTitle = (l.crop || 'देसी लाल टमाटर (Tomato)').replace(/\s*\(₹\d+\/kg\)/, '');

          const newCrop: CropListing = {
            id: l.id,
            title: cleanTitle,
            variety: isOffline ? 'ऑफ़लाइन वॉइस पोस्ट (Offline Post)' : (l.grade || 'Grade A'),
            farmerName: l.farmer_name || (isOffline ? 'रामेश कुमार (+919876543210)' : 'Kisan Producer'),
            farmerPhone: l.farmer_phone || '+919876543210',
            cluster: l.village ? `${l.village}, ${l.district || 'NCR'}` : 'Sonipat Cluster',
            locationKm: 18,
            grade: (l.grade as any) || 'Grade A',
            farmingType: isOffline ? 'Natural' : 'Organic',
            imageUrl: isOffline
              ? 'OFFLINE_VOICE_POST'
              : (l.photos?.[0] || 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80'),
            healthScore: 98,
            healthMetrics: {
              pesticide: 'Zero pesticide residue',
              npkLevel: 'Optimal field NPK',
              moisture: '80% crispness',
              harvestedHoursAgo: 1,
            },
            currentBid: Math.round(price * 0.9),
            buyNowPrice: price,
            lotSizeKg: Number(l.qty_kg || 300),
            availableLots: 2,
            bidCount: 1,
            timeLeft: '4h 00m',
            isOfflineVoicePost: isOffline,
            rawSpeech: isOffline ? `${l.qty_kg || 300} किलो ${cleanTitle} @ ₹${price}/kg भाव` : l.crop,
          };
          setCrops((prev) => [newCrop, ...prev.filter((c) => c.id !== newCrop.id)]);
          showToast(
            isOffline
              ? `📞 नई ऑफ़लाइन वॉइस लिस्टिंग दर्ज: ${newCrop.title} (${newCrop.lotSizeKg}kg)`
              : `⚡ नया लाइव हार्वेस्ट लॉट जुड़ा: ${newCrop.title} (${newCrop.lotSizeKg}kg)`
          );
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const o = payload.new as any;
          if (o && o.id) {
            setOrders((prev) =>
              prev.map((ord) =>
                ord.id === o.id
                  ? {
                      ...ord,
                      escrowStatus: o.status === 'ACCEPTED' ? 'ACCEPTED' : ord.escrowStatus,
                      escrowStatusLabel:
                        o.status === 'ACCEPTED' ? 'Accepted by Farmer' : ord.escrowStatusLabel,
                    }
                  : ord
              )
            );
            if (o.status === 'ACCEPTED') {
              showToast(`📞 किसान ने फोन पर ऑर्डर ${o.id} स्वीकार कर लिया है!`);
            }
          }
        }
      )
      .subscribe();

    // Realtime Cross-Tab Sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('kisanvaani_sync');
        bc.onmessage = (event) => {
          const msg = event.data;
          if (msg?.type === 'LISTING_CREATED' && msg.listing) {
            console.log('[BuyerPortal] BroadcastChannel received LISTING_CREATED:', msg.listing);
            const l = msg.listing;
            const newCrop: CropListing = {
              id: l.id || `crop-${Date.now()}`,
              title: l.crop || 'देसी लाल टमाटर',
              variety: l.grade || 'Grade A',
              farmerName: l.farmer_name || 'रामेश कुमार (+919876543210)',
              farmerPhone: '+919876543210',
              cluster: 'Sonipat Cluster, Haryana',
              locationKm: 18,
              grade: (l.grade as any) || 'Grade A',
              farmingType: 'Organic',
              imageUrl: l.photos?.[0] || 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
              healthScore: 98,
              healthMetrics: {
                pesticide: 'Zero residue (<0.01 ppm)',
                npkLevel: 'Balanced NPK (4:2:1)',
                moisture: '82% crispness index',
                harvestedHoursAgo: 1,
              },
              currentBid: Math.round((l.base_price_per_kg || 40) * 0.9),
              buyNowPrice: l.base_price_per_kg || 40,
              lotSizeKg: Number(l.qty_kg || 300),
              availableLots: 2,
              bidCount: 1,
              timeLeft: '4h 00m',
            };
            setCrops((prev) => [newCrop, ...prev.filter((c) => c.id !== newCrop.id)]);
            showToast(`⚡ नया लाइव हार्वेस्ट लॉट ऐप से जुड़ा: ${newCrop.title} (${newCrop.lotSizeKg}kg @ ₹${newCrop.buyNowPrice}/kg)`);
          }
        };
      }
    } catch (e) {}

    return () => {
      clearInterval(listingsPoll);
      supabase.removeChannel(channel);
      if (bc) bc.close();
    };
  }, []);

  // Bid Handler
  const handleOpenBid = (crop: CropListing) => {
    setSelectedCropForBid(crop);
    setIsBidModalOpen(true);
  };

  const handleBidConfirmed = (cropId: string, bidAmount: number, lots: number) => {
    setCrops((prev) =>
      prev.map((c) =>
        c.id === cropId
          ? {
              ...c,
              currentBid: bidAmount,
              bidCount: c.bidCount + 1,
            }
          : c
      )
    );
    showToast(`Bid Placed: ₹${bidAmount}/kg for ${lots} lot(s). Escrow hold reserved!`);
  };

  // Buy Now Handler
  const handleOpenBuyNow = (crop: CropListing) => {
    setSelectedCropForBuyNow(crop);
    setIsBuyNowModalOpen(true);
  };

  const handleConfirmPurchase = (
    crop: CropListing,
    quantityKg: number,
    ringId: number,
    totalCost: number
  ) => {
    const qty = quantityKg;
    const newOrderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderItem = {
      id: newOrderId,
      cropName: `${crop.title} (${crop.grade})`,
      quantityKg: qty,
      farmerName: crop.farmerName,
      farmerLocation: crop.cluster,
      totalValue: totalCost,
      escrowStatus: 'ACCEPTED',
      escrowStatusLabel: 'Accepted by Farmer',
      orderedAt: 'Just Now',
      eta: 'Reefer Dispatch in Progress (ETA: 4h)',
      passcode: `KV-${Math.floor(1000 + Math.random() * 9000)}`,
      temperatureC: 12,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setEscrowBalance((prev) => Math.max(0, prev - totalCost));
    showToast(`Order Confirmed: ${newOrderId} (${qty}kg)! 📞 Calling ${crop.farmerName} in Hindi...`);

    // Broadcast instant sync to Farmer App tab
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('kisanvaani_sync');
        bc.postMessage({
          type: 'ORDER_PLACED',
          order: {
            id: newOrderId,
            bid_id: `bid-${newOrderId}`,
            listing: {
              id: crop.id,
              farmer_id: 'farmer-ramesh-01',
              farmer_name: crop.farmerName,
              crop: crop.title,
              qty_kg: qty,
              grade: crop.grade,
              photos: [crop.imageUrl],
              geo_coords: '28.9931, 77.0151',
              distance_km: crop.locationKm,
              quality_score: crop.healthScore,
              sensor_health_score: 96,
              status: 'LIVE',
              base_price_per_kg: crop.buyNowPrice,
            },
            bid: {
              id: `bid-${newOrderId}`,
              listing_id: crop.id,
              buyer_id: 'buyer-freshbite-01',
              buyer_name: 'FreshBite Hospitality',
              price_per_kg: crop.buyNowPrice,
              total: totalCost,
              status: 'PENDING',
              created_at: new Date().toISOString(),
            },
            escrow_state: 'ACCEPTED',
            passcode: '4829',
            qr_payload: `KV-HMAC-2026:PIN-4829:ORDER-${newOrderId}:FARMER-RAMESH:AMT-${totalCost}`,
            updated_at: new Date().toISOString(),
          },
        });
        bc.close();
      } catch (e) {}
    }

    const phoneToCall = crop.farmerPhone || '+919876543210';

    // Also sync to server-side /api/orders store for Flutter mobile app
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newOrderId,
          cropName: crop.title,
          quantityKg: qty,
          totalValue: totalCost,
          farmerName: crop.farmerName,
          farmerPhone: phoneToCall,
          passcode: '4829',
        }),
      }).catch(() => {});
    } catch {}

    // 🔔 Trigger Twilio Voice IVR call & SMS to farmer in Hindi
    placeOrder({
      orderId: newOrderId,
      farmerPhoneNumber: phoneToCall,
      farmerName: crop.farmerName,
      cropName: crop.title,
      quantityKg: qty,
      totalPrice: totalCost,
      buyerName: 'FreshBite Hospitality',
    })
      .then((result) => {
        if (result.success) {
          showToast(`📞 Farmer ${crop.farmerName} is being called at ${phoneToCall}! Order ${newOrderId} pending confirmation.`);
        } else {
          console.warn('[Twilio] Call status:', result.error || result.message);
          showToast(`Order ${newOrderId} saved. Voice IVR initiated to ${phoneToCall}.`);
        }
      })
      .catch((err) => {
        console.error('[Twilio] Call error:', err);
      });
  };

  // Passcode & Handover Handlers
  const handleViewPasscode = (order: OrderItem) => {
    setSelectedOrderForPasscode(order);
    setIsPasscodeModalOpen(true);
  };

  const handleOpenGateScanner = (order?: OrderItem) => {
    setGateScannerPreSelectedOrder(order || null);
    setIsGateScannerOpen(true);
  };

  const handleOrderHandoverComplete = (orderId: string, passcodeUsed: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              escrowStatus: 'PAID',
              escrowStatusLabel: 'Handover Completed & Paid',
              eta: 'Delivered at Cold Room Dock 2',
            }
          : o
      )
    );

    // Update /api/orders status
    try {
      fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'PAID' }),
      }).catch(() => {});
    } catch {}

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('kisanvaani_sync');
        bc.postMessage({ type: 'ORDER_ACCEPTED', orderId });
        bc.close();
      } catch (e) {}
    }

    showToast(`Smart Escrow Released! Order ${orderId} marked PAID. Farmer bank account credited.`);
  };

  // Route & Details Handlers
  const handleTrackRoute = (order: OrderItem) => {
    setSelectedOrderForDetails(order);
    setIsDetailsModalOpen(true);
  };

  const handleViewDetails = (order: OrderItem) => {
    setSelectedOrderForDetails(order);
    setIsDetailsModalOpen(true);
  };

  const handleSelectOrderForLogistics = (order: OrderItem) => {
    setSelectedLogisticsOrder(order);
    if (activeTab === 'dashboard') {
      const el = document.getElementById('logistics-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Freight Booking Handler
  const handleOpenFreightBooking = (ring: LogisticsRing, weightKg: number) => {
    setSelectedRingForFreight(ring);
    setFreightWeightKg(weightKg);
    setIsFreightModalOpen(true);
  };

  const handleBookingConfirmed = (ringId: number, freightCost: number) => {
    showToast(`Freight Reserved: Ring ${ringId} EV Reefer confirmed for ${freightWeightKg}kg!`);
  };

  // Escrow Top-up
  const handleTopUpEscrow = () => {
    const amount = 50000;
    setEscrowBalance((prev) => prev + amount);
    showToast(`Wallet Top-Up: ₹${amount.toLocaleString('en-IN')} added to Escrow Balance!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl shadow-emerald-900/15 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-5 w-5 text-[#0B7A3B]" />
          <span className="text-xs font-bold text-slate-900">{toastMessage}</span>
        </div>
      )}

      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        ordersCount={orders.length}
        escrowBalance={escrowBalance}
        onTopUpEscrow={handleTopUpEscrow}
      />

      {/* Main Wrapper with left margin for fixed sidebar */}
      <div className="flex flex-col lg:pl-72 min-h-screen">
        {/* Sticky Topbar */}
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenGateScanner={() => handleOpenGateScanner()}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* Header Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#064E26] via-[#0B7A3B] to-[#132A1C] p-6 text-white shadow-md sm:p-8">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30">
                    <Sparkles className="h-3.5 w-3.5" /> Direct B2B Farm Gate Mandi
                  </div>
                  <h1 className="mt-3 text-2xl font-black sm:text-3xl lg:text-4xl tracking-tight">
                    Welcome, FreshBite Hospitality
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Procure sensor-verified Grade A produce directly from smallholder farmer clusters in Sonipat, Karnal, and Delhi NCR with automated telephone IVR & smart escrow.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenGateScanner()}
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#0B7A3B] shadow-sm transition-all hover:bg-emerald-50 active:scale-95 cursor-pointer"
                    >
                      <ScanLine className="h-4 w-4" />
                      Scan Driver QR & Enter Passcode
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('harvest')}
                      className="flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-700/40 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-emerald-700/60 active:scale-95 cursor-pointer"
                    >
                      Browse {crops.length} Live Harvest Lots
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
              </div>

              {/* 1. Quick Stats */}
              <QuickStats />

              {/* 2. Interactive Offline Order Demo (Twilio Phone IVR & NLU) */}
              <OfflineOrderDemo
                onSuccess={(crop, qty, price) => {
                  showToast(`✅ नई ऑफ़लाइन वॉइस लिस्टिंग दर्ज: ${crop} (${qty}kg @ ₹${price}/kg)`);
                }}
              />

              {/* 3. Live Harvest Feed */}
              <LiveHarvestFeed
                crops={crops}
                onOpenBidModal={handleOpenBid}
                onBuyNow={handleOpenBuyNow}
                searchQuery={searchQuery}
              />

              {/* 3. Logistics Rings Calculator */}
              <div id="logistics-section">
                <LogisticsCalculator
                  selectedOrder={selectedLogisticsOrder}
                  onBookFreight={handleOpenFreightBooking}
                />
              </div>

              {/* 4. Active Escrow Orders */}
              <ActiveOrdersTable
                orders={orders}
                onViewPasscode={handleViewPasscode}
                onTrackRoute={handleTrackRoute}
                onViewDetails={handleViewDetails}
                onOpenGateScanner={handleOpenGateScanner}
                onSelectOrderForLogistics={handleSelectOrderForLogistics}
                selectedOrderId={selectedLogisticsOrder?.id}
              />
            </>
          )}

          {/* TAB 2: LIVE HARVEST LOTS ONLY */}
          {activeTab === 'harvest' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">All Live Harvest Lots</h2>
                  <p className="text-xs text-slate-500">
                    Real-time field sensor readings, NPK scores, and ₹10 coin computer vision quality grades.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-[#0B7A3B]">
                    {crops.length} Lots Open for Bidding
                  </span>
                </div>
              </div>

              <LiveHarvestFeed
                crops={crops}
                onOpenBidModal={handleOpenBid}
                onBuyNow={handleOpenBuyNow}
                searchQuery={searchQuery}
              />
            </div>
          )}

          {/* TAB 3: LOGISTICS CALCULATOR ONLY */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">3-Ring Dynamic Logistics Hub</h2>
                <p className="text-xs text-slate-500">
                  Calculate freight cost per kg, cold chain transit time, and CO₂ savings across Delhi-NCR.
                </p>
              </div>

              <LogisticsCalculator
                selectedOrder={selectedLogisticsOrder}
                onBookFreight={handleOpenFreightBooking}
              />

              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Select Order to Route:</h3>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedLogisticsOrder(ord)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedLogisticsOrder?.id === ord.id
                          ? 'border-[#0B7A3B] bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{ord.id}</span>
                        <span className="text-[#0B7A3B]">{ord.quantityKg} kg</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-1">{ord.cropName}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{ord.farmerLocation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVE ORDERS ONLY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Smart Escrow Orders</h2>
                  <p className="text-xs text-slate-500">
                    Track live reefer telematics, dispatch handover passcodes, and optical QR scans.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenGateScanner()}
                  className="flex items-center gap-2 rounded-xl bg-[#0B7A3B] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#096330] cursor-pointer"
                >
                  <ScanLine className="h-3.5 w-3.5" />
                  Scan Gate QR
                </button>
              </div>

              <ActiveOrdersTable
                orders={orders}
                onViewPasscode={handleViewPasscode}
                onTrackRoute={handleTrackRoute}
                onViewDetails={handleViewDetails}
                onOpenGateScanner={handleOpenGateScanner}
                onSelectOrderForLogistics={handleSelectOrderForLogistics}
                selectedOrderId={selectedLogisticsOrder?.id}
              />
            </div>
          )}

          {/* TAB 5: FARMERS DIRECTORY */}
          {activeTab === 'farmers' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Partner Farmers & Clusters</h2>
                <p className="text-xs text-slate-500">
                  Smallholder farmers with active IoT ESP32 soil stakes and verified digital bank accounts.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: 'Ramesh Kumar',
                      contact: '+919876543210',
                      cluster: 'Sonipat Cluster, Haryana',
                      crops: 'Hybrid Bell Peppers, Baby Corn',
                      health: '98% IoT Verified',
                      acreage: '4.5 Acres',
                    },
                    {
                      name: 'Suresh Verma',
                      contact: '+919876543210',
                      cluster: 'Karnal Belt, Haryana',
                      crops: 'San Marzano Cherry Tomatoes',
                      health: '95% IoT Verified',
                      acreage: '6.0 Acres',
                    },
                    {
                      name: 'Anita Devi',
                      contact: '+919876543210',
                      cluster: 'Najafgarh Green Belt, Delhi NCR',
                      crops: 'Mountain Crown Broccoli',
                      health: '97% IoT Verified',
                      acreage: '3.2 Acres',
                    },
                  ].map((farmer) => (
                    <div
                      key={farmer.name}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#0B7A3B] text-xs">
                            {farmer.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{farmer.name}</h3>
                            <p className="text-xs text-slate-500">{farmer.cluster}</p>
                          </div>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-[#0B7A3B] border border-emerald-200">
                          {farmer.health}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <div>
                          Primary Produce: <strong className="text-slate-800">{farmer.crops}</strong>
                        </div>
                        <div>
                          Cultivation Area: <strong className="text-slate-800">{farmer.acreage}</strong>
                        </div>
                        <div>
                          Contact: <strong className="text-slate-800">{farmer.contact}</strong>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Initiating automated verification call to ${farmer.name} at ${farmer.contact}...`);
                          }}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#0B7A3B] hover:underline cursor-pointer"
                        >
                          <Phone className="h-3.5 w-3.5" /> Call Farmer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('harvest');
                            showToast(`Filtered lots from ${farmer.name}!`);
                          }}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                        >
                          View Harvest Lots
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Buyer Portal Settings</h2>
                <p className="text-xs text-slate-500">
                  Manage hospitality enterprise credentials, delivery dock locations, and automated escrow balance.
                </p>

                <div className="mt-6 space-y-5">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-bold text-slate-900">Hospitality Account Profile</h3>
                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="text-slate-500">Company Name</span>
                        <div className="mt-1 font-bold text-slate-900">FreshBite Hospitality Pvt Ltd</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Registered GSTIN</span>
                        <div className="mt-1 font-mono font-bold text-slate-900">07AAACF8892L1ZV</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Delivery Address</span>
                        <div className="mt-1 font-semibold text-slate-900">Dock 2, Connaught Place, New Delhi 110001</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Buyer Tier</span>
                        <div className="mt-1 font-bold text-[#0B7A3B]">Tier 1 Enterprise (Pre-Approved Escrow)</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Smart Escrow Vault Wallet</h3>
                        <p className="text-xs text-slate-500">Automated UPI / NEFT reconciliation upon QR handover.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleTopUpEscrow}
                        className="rounded-xl bg-[#0B7A3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#096330] cursor-pointer"
                      >
                        + Add ₹50,000 Funds
                      </button>
                    </div>
                    <div className="mt-3 text-2xl font-black text-slate-900">
                      ₹{escrowBalance.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 bg-white py-6 px-8 text-center text-xs text-slate-500">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row max-w-7xl mx-auto">
            <p>© 2026 KisanVaani Agritech Pvt. Ltd. • Mandi-Direct B2B Buyer Terminal</p>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
              <span
                onClick={() => handleOpenGateScanner()}
                className="hover:text-slate-900 cursor-pointer font-bold text-[#0B7A3B]"
              >
                Scan Gate Delivery
              </span>
              <span>•</span>
              <span
                onClick={() => setActiveTab('harvest')}
                className="hover:text-slate-900 cursor-pointer"
              >
                Live Harvest Lots
              </span>
              <span>•</span>
              <span
                onClick={() => setActiveTab('logistics')}
                className="hover:text-slate-900 cursor-pointer"
              >
                Freight Telematics
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* 1. Interactive Place Bid Modal */}
      <PlaceBidModal
        crop={selectedCropForBid}
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        onBidConfirmed={handleBidConfirmed}
      />

      {/* 2. Direct Buy Now Modal */}
      <BuyNowModal
        crop={selectedCropForBuyNow}
        isOpen={isBuyNowModalOpen}
        onClose={() => setIsBuyNowModalOpen(false)}
        onConfirmPurchase={handleConfirmPurchase}
      />

      {/* 3. Handover Passcode Modal */}
      <PasscodeModal
        order={selectedOrderForPasscode}
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
      />

      {/* 4. Optical QR Scanner & Passcode Handover Entry Modal */}
      <GateScannerModal
        isOpen={isGateScannerOpen}
        onClose={() => setIsGateScannerOpen(false)}
        orders={orders}
        onOrderHandoverComplete={handleOrderHandoverComplete}
        preSelectedOrder={gateScannerPreSelectedOrder}
      />

      {/* 5. Order Route & GPS Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onOpenPasscode={handleViewPasscode}
      />

      {/* 6. Dedicated Freight Booking Modal */}
      <FreightBookingModal
        ring={selectedRingForFreight}
        weightKg={freightWeightKg}
        isOpen={isFreightModalOpen}
        onClose={() => setIsFreightModalOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />
    </div>
  );
}
