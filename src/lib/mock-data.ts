// KisanVaani Pre-Seeded Store & Live Reactive Data Store
import { Farmer, Plot, SensorReading, SowingLock, Listing, Order, Dealer } from './types';

export const INITIAL_FARMER: Farmer = {
  id: 'a1111111-1111-1111-1111-111111111111',
  name: 'रामेश कुमार (Ramesh Kumar)',
  lang: 'hi',
  phone: '+919876543210',
  village: 'मुरथल (Murthal Village)',
  district: 'सोनीपत (Sonipat)',
  geo_lat: 28.9931,
  geo_lng: 77.0151,
};

export const INITIAL_PLOT: Plot = {
  id: 'b2222222-2222-2222-2222-222222222222',
  farmer_id: INITIAL_FARMER.id,
  acres: 2.5,
  soil_type: 'दोमट मिट्टी (Loamy Soil)',
  current_crop: 'टमाटर (Tomato - US 440 F1)',
  gps_coords: '28.9931° N, 77.0151° E',
};

export const INITIAL_SOWING_LOCKS: SowingLock[] = [
  {
    id: 'lock-tomato-01',
    district: 'सोनीपत (Sonipat)',
    crop: 'टमाटर (Tomato)',
    acres_locked: 1200,
    demand_ceiling_acres: 1200,
    status: 'RED',
  },
  {
    id: 'lock-wheat-02',
    district: 'सोनीपत (Sonipat)',
    crop: 'गेहूं (Wheat)',
    acres_locked: 4100,
    demand_ceiling_acres: 5000,
    status: 'AMBER',
  },
  {
    id: 'lock-pepper-03',
    district: 'सोनीपत (Sonipat)',
    crop: 'शिमला मिर्च (Bell Pepper)',
    acres_locked: 350,
    demand_ceiling_acres: 1000,
    status: 'GREEN',
  },
  {
    id: 'lock-mustard-04',
    district: 'सोनीपत (Sonipat)',
    crop: 'सरसों (Mustard)',
    acres_locked: 200,
    demand_ceiling_acres: 800,
    status: 'GREEN',
  },
];

export const INITIAL_SENSOR_READINGS: SensorReading = {
  plot_id: INITIAL_PLOT.id,
  ts: new Date().toISOString(),
  moisture: 52.0,
  ec: 1.4,
  n: 85.0,
  p: 42.0,
  k: 110.0,
  ph: 6.8,
  leaf_temp: 26.2,
  air_temp: 26.5,
  height_cm: 48.0,
  pump_relay_state: true,
};

export const VERIFIED_DEALER_SHARMA: Dealer = {
  id: 'd4444444-4444-4444-4444-444444444444',
  name: 'शर्मा किसान सेवा केंद्र (Sharma Kisan Seva Kendra)',
  phone: '+919812000000',
  address: 'जी.टी. रोड, बस स्टैंड के पास, मुरथल, सोनीपत',
  distance_km: 2.1,
  verified: true,
  mrp_cap_line: {
    hi: 'सरकारी एमआरपी सीमा: ₹150 से ऊपर कतई न दें',
    en: 'Govt MRP Cap: Maximum ₹150 / pack',
    pa: 'ਸਰਕਾਰੀ ਰੇਟ: ₹150 ਤੋਂ ਵੱਧ ਨਾ ਦਿਓ',
    mr: 'शासकीय दर: ₹१५० पेक्षा जास्त देऊ नका',
  },
};

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    farmer_id: INITIAL_FARMER.id,
    farmer_name: INITIAL_FARMER.name,
    crop: 'देसी लाल टमाटर (Grade-A Tomato)',
    qty_kg: 400,
    grade: 'Grade A',
    photos: ['/tomato_sample.jpg'],
    geo_coords: '28.9931, 77.0151',
    distance_km: 38,
    quality_score: 96.5,
    sensor_health_score: 96,
    status: 'LIVE',
    base_price_per_kg: 28,
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    farmer_id: 'farmer-gurpreet-02',
    farmer_name: 'गुरप्रीत सिंह (Gurpreet Singh)',
    crop: 'पीली डच शिमला मिर्च (Yellow Bell Pepper)',
    qty_kg: 250,
    grade: 'Grade A',
    photos: ['/bell_pepper_sample.jpg'],
    geo_coords: '29.1492, 76.9930',
    distance_km: 62,
    quality_score: 98.2,
    sensor_health_score: 98,
    status: 'LIVE',
    base_price_per_kg: 62,
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    farmer_id: 'farmer-satish-03',
    farmer_name: 'सतीश देशपांडे (Satish Deshpande)',
    crop: 'चेरी टमाटर (Cherry Tomato Cluster)',
    qty_kg: 500,
    grade: 'Grade A',
    photos: ['/cherry_tomato_sample.jpg'],
    geo_coords: '28.7041, 77.1025',
    distance_km: 44,
    quality_score: 94.0,
    sensor_health_score: 92,
    status: 'LIVE',
    base_price_per_kg: 72,
  },
];

export const INITIAL_ORDER: Order = {
  id: 'f6666666-6666-6666-6666-666666666666',
  bid_id: 'e5555555-5555-5555-5555-555555555555',
  listing: INITIAL_LISTINGS[0],
  bid: {
    id: 'e5555555-5555-5555-5555-555555555555',
    listing_id: INITIAL_LISTINGS[0].id,
    buyer_id: 'buyer-freshbite-01',
    buyer_name: 'FreshBite Cloud Kitchens (Delhi NCR)',
    price_per_kg: 28,
    total: 11200,
    status: 'ACCEPTED',
    created_at: new Date().toISOString(),
  },
  escrow_state: 'IN_TRANSIT',
  passcode: '4829',
  qr_payload: 'KISANVAANI:ORDER:f6666666:AMT:11200:CODE:4829:FARMER:RAMESH',
  payout_upi_ref: 'UPI/20261017/9876543210/KV992',
  updated_at: new Date().toISOString(),
};
