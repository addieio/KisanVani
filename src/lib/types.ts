// KisanVaani Shared Domain Types

export type LanguageCode = 'hi' | 'en' | 'pa' | 'mr' | 'ta';
export type LocalizedMap = { [K in LanguageCode]?: string } & { hi: string };

export interface Farmer {
  id: string;
  name: string;
  lang: LanguageCode;
  phone: string;
  village: string;
  district: string;
  geo_lat: number;
  geo_lng: number;
}

export interface Plot {
  id: string;
  farmer_id: string;
  acres: number;
  soil_type: string;
  current_crop: string;
  gps_coords: string;
}

export interface SensorReading {
  id?: string;
  plot_id: string;
  ts: string;
  moisture: number;    // % (0 - 100)
  ec: number;          // mS/cm
  n: number;           // mg/kg
  p: number;           // mg/kg
  k: number;           // mg/kg
  ph: number;          // (0 - 14)
  leaf_temp: number;   // °C (IR MLX90614)
  air_temp: number;    // °C (DHT22)
  height_cm: number;   // cm (Ultrasonic)
  pump_relay_state: boolean;
}

export type AlertType = 
  | 'HYPOXIA'
  | 'ROOT_ROT'
  | 'BACTERIAL_WILT'
  | 'NITROGEN_CURVE'
  | 'PHOSPHORUS_LOCK'
  | 'POTASSIUM_BOOST';

export interface BioAlert {
  id: string;
  type: AlertType;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: LocalizedMap;
  message: LocalizedMap;
  spokenText: LocalizedMap;
  recommendedAction: LocalizedMap;
  remedySteps: {
    step: number;
    title: LocalizedMap;
    desc: LocalizedMap;
    icon: string;
  }[];
  timestamp: string;
  active: boolean;
  pumpAction?: 'RELAY_OFF' | 'NO_CHANGE';
}

export interface SowingLock {
  id: string;
  district: string;
  crop: string;
  acres_locked: number;
  demand_ceiling_acres: number;
  status: 'GREEN' | 'AMBER' | 'RED';
}

export interface ExoticBlueprint {
  cropName: LocalizedMap;
  variety: string;
  certifiedSeedSource: string;
  expectedPricePerKg: number;
  matchedBuyer: string;
  demandAcres: number;
  netMarginEstimate: string;
}

export interface Listing {
  id: string;
  farmer_id: string;
  farmer_name: string;
  crop: string;
  qty_kg: number;
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  photos: string[];
  geo_coords: string;
  distance_km: number;
  quality_score: number;
  sensor_health_score: number;
  status: 'PENDING_SYNC' | 'LIVE' | 'SOLD' | 'CANCELLED';
  base_price_per_kg: number;
}

export interface Bid {
  id: string;
  listing_id: string;
  buyer_id: string;
  buyer_name: string;
  price_per_kg: number;
  total: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export type EscrowState = 'BID' | 'ACCEPTED' | 'IN_TRANSIT' | 'HANDOVER' | 'PAID' | 'REJECTED';

export interface Order {
  id: string;
  bid_id: string;
  listing: Listing;
  bid: Bid;
  escrow_state: EscrowState;
  passcode: string;
  qr_payload: string;
  payout_upi_ref?: string;
  updated_at: string;
}

export interface Dealer {
  id: string;
  name: string;
  phone: string;
  address: string;
  distance_km: number;
  verified: boolean;
  mrp_cap_line: LocalizedMap;
}

export interface ProduceGradeResult {
  sizeMM: number;
  targetMM: number;
  ripenessPct: number;
  blemishPct: number;
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  passed: boolean;
  timestamp: string;
}
