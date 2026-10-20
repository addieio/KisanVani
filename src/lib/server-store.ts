import { CropListing, OrderItem, CROP_LISTINGS, ACTIVE_ORDERS } from '@/data/data';
import { supabase } from '@/lib/supabase';

interface ServerStore {
  listings: CropListing[];
  orders: OrderItem[];
}

declare global {
  // eslint-disable-next-line no-var
  var __kisanvaani_store__: ServerStore | undefined;
}

if (!globalThis.__kisanvaani_store__) {
  globalThis.__kisanvaani_store__ = {
    listings: [...CROP_LISTINGS],
    orders: [...ACTIVE_ORDERS],
  };
}

const store = globalThis.__kisanvaani_store__;

export function getAllListings(): CropListing[] {
  return store.listings;
}

export function addServerListing(listing: Partial<CropListing> & { title: string; lotSizeKg: number; buyNowPrice: number }): CropListing {
  const isOffline = listing.isOfflineVoicePost || listing.imageUrl === 'OFFLINE_VOICE_POST' || listing.variety?.includes('ऑफ़लाइन');
  
  const newListing: CropListing = {
    id: listing.id || `listing-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: listing.title,
    variety: listing.variety || (isOffline ? 'ऑफ़लाइन वॉइस पोस्ट (Offline Post)' : 'Grade A Certified'),
    farmerName: listing.farmerName || 'रामेश कुमार (+919876543210)',
    farmerPhone: listing.farmerPhone || '+919876543210',
    cluster: listing.cluster || 'Sonipat Cluster, Haryana',
    locationKm: listing.locationKm || 18,
    grade: (listing.grade as any) || 'Grade A',
    farmingType: listing.farmingType || (isOffline ? 'Natural' : 'Organic'),
    imageUrl: isOffline ? 'OFFLINE_VOICE_POST' : (listing.imageUrl || 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80'),
    healthScore: listing.healthScore || 96,
    healthMetrics: listing.healthMetrics || {
      pesticide: 'Zero residue (<0.01 ppm)',
      npkLevel: 'Balanced NPK (4:2:1)',
      moisture: '82% crispness index',
      harvestedHoursAgo: 1,
    },
    currentBid: Math.round(listing.buyNowPrice * 0.9),
    buyNowPrice: listing.buyNowPrice,
    lotSizeKg: listing.lotSizeKg,
    availableLots: listing.availableLots || 3,
    bidCount: listing.bidCount || 1,
    timeLeft: listing.timeLeft || '3h 30m',
    isOfflineVoicePost: isOffline,
    rawSpeech: listing.rawSpeech || `${listing.lotSizeKg} किलो ${listing.title} @ ₹${listing.buyNowPrice}/kg भाव`,
  };

  // Prepend to server listings store
  store.listings = [newListing, ...store.listings.filter((l) => l.id !== newListing.id)];

  // Also best-effort insert into Supabase
  try {
    Promise.resolve(
      supabase.from('listings').insert([
        {
          id: newListing.id,
          crop: `${newListing.title} (₹${newListing.buyNowPrice}/kg)`,
          qty_kg: newListing.lotSizeKg,
          grade: newListing.grade,
          photos: [newListing.imageUrl],
          geo_coords: '28.9931, 77.0151',
          quality_score: newListing.healthScore,
          status: 'LIVE',
          base_price_per_kg: newListing.buyNowPrice,
        },
      ])
    ).then((res: any) => {
      if (res?.error) console.warn('[server-store] Supabase listing mirror note:', res.error.message);
    }).catch(() => {});
  } catch {}

  return newListing;
}

export function getAllOrders(): OrderItem[] {
  return store.orders;
}

export function addServerOrder(order: OrderItem): OrderItem {
  store.orders = [order, ...store.orders.filter((o) => o.id !== order.id)];

  // Best-effort Supabase insert
  try {
    Promise.resolve(
      supabase.from('orders').insert([
        {
          id: order.id,
          crop_name: order.cropName,
          quantity_kg: order.quantityKg,
          total_price: order.totalValue,
          farmer_name: order.farmerName,
          farmer_phone: '+919876543210',
          status: order.escrowStatus === 'PAID' ? 'PAID' : (order.escrowStatus === 'ACCEPTED' ? 'ACCEPTED' : 'PENDING'),
          created_at: new Date().toISOString(),
        },
      ])
    ).then((res: any) => {
      if (res?.error) console.warn('[server-store] Supabase order mirror note:', res.error.message);
    }).catch(() => {});
  } catch {}

  return order;
}

export function updateServerOrderStatus(orderId: string, status: 'ACCEPTED' | 'PAID' | 'IN_TRANSIT'): OrderItem | null {
  const found = store.orders.find((o) => o.id === orderId);
  if (!found) return null;

  found.escrowStatus = status;
  found.escrowStatusLabel = status === 'PAID' ? 'Handover Completed & Paid' : (status === 'ACCEPTED' ? 'Accepted by Farmer' : 'In Transit');
  if (status === 'PAID') {
    found.eta = 'Delivered at Cold Room Dock 2';
  }

  // Best-effort Supabase update
  try {
    Promise.resolve(
      supabase.from('orders').update({
        status,
        updated_at: new Date().toISOString(),
      }).eq('id', orderId)
    ).then((res: any) => {
      if (res?.error) console.warn('[server-store] Supabase order status note:', res.error.message);
    }).catch(() => {});
  } catch {}

  return found;
}
