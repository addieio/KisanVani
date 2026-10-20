-- ========================================================
-- KISANVAANI COMPLETE SUPABASE SCHEMA & BENCHMARK SEED
-- Project: mrucdirherpccfdarxvx
-- Run this in Supabase Dashboard -> SQL Editor (New Query)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Farmers
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'hi', -- 'hi', 'en', 'pa', 'mr'
    phone TEXT NOT NULL UNIQUE,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    geo_lat NUMERIC(9,6),
    geo_lng NUMERIC(9,6),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Plots
CREATE TABLE IF NOT EXISTS plots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    acres NUMERIC(5,2) NOT NULL,
    soil_type TEXT NOT NULL,
    current_crop TEXT,
    gps_coords TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Regional Sowing Locks (Quota Balancer)
CREATE TABLE IF NOT EXISTS sowing_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district TEXT NOT NULL,
    crop TEXT NOT NULL,
    acres_locked NUMERIC(10,2) NOT NULL DEFAULT 0,
    demand_ceiling_acres NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'GREEN', -- 'GREEN', 'AMBER', 'RED'
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_district_crop UNIQUE (district, crop)
);

-- 4. Buyer Pre-orders
CREATE TABLE IF NOT EXISTS buyer_preorders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    crop TEXT NOT NULL,
    qty_kg NUMERIC(10,2) NOT NULL,
    month TEXT NOT NULL,
    price_floor NUMERIC(8,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sensor Readings (ESP32-S3 Stake Telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    ts TIMESTAMPTZ DEFAULT NOW(),
    moisture NUMERIC(5,2) NOT NULL,
    ec NUMERIC(5,2) NOT NULL,
    n NUMERIC(6,2) NOT NULL,
    p NUMERIC(6,2) NOT NULL,
    k NUMERIC(6,2) NOT NULL,
    ph NUMERIC(4,2) NOT NULL,
    leaf_temp NUMERIC(5,2) NOT NULL,
    air_temp NUMERIC(5,2) NOT NULL,
    height_cm NUMERIC(6,2) NOT NULL,
    pump_relay_state BOOLEAN DEFAULT TRUE
);

-- 6. Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    signature_json JSONB,
    spoken_text_hi TEXT NOT NULL,
    spoken_text_en TEXT,
    spoken_text_pa TEXT,
    spoken_text_mr TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Dealers
CREATE TABLE IF NOT EXISTS dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    distance_km NUMERIC(5,2) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Remedies
CREATE TABLE IF NOT EXISTS remedies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    steps_json JSONB NOT NULL,
    dealer_id UUID REFERENCES dealers(id) ON DELETE SET NULL,
    mrp_cap NUMERIC(8,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Dealer Referral Leads
CREATE TABLE IF NOT EXISTS dealer_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Marketplace Listings (Connected to App "Sell Produce")
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop TEXT NOT NULL,
    qty_kg NUMERIC(10,2) NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade A',
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    geo_coords TEXT,
    quality_score NUMERIC(5,2) DEFAULT 95.0,
    status TEXT NOT NULL DEFAULT 'LIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Bids
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    price_per_kg NUMERIC(8,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Orders & Escrow
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
    escrow_state TEXT NOT NULL DEFAULT 'BID',
    passcode VARCHAR(4) NOT NULL,
    qr_payload TEXT NOT NULL,
    payout_upi_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Order Events (Audit Log)
CREATE TABLE IF NOT EXISTS order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    payload JSONB,
    ts TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Farm Diary (Insurance Telemetry)
CREATE TABLE IF NOT EXISTS farm_diary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    payload JSONB,
    ts TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Insurance Claims
CREATE TABLE IF NOT EXISTS insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES plots(id) ON DELETE CASCADE,
    proof_pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    filed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Logistics Routes
CREATE TABLE IF NOT EXISTS logistics_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    ring INT NOT NULL,
    cluster_id TEXT,
    cost_per_kg NUMERIC(6,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid queries
CREATE INDEX IF NOT EXISTS idx_sensor_readings_plot ON sensor_readings(plot_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_sowing_locks_district ON sowing_locks(district);

-- Allow public read/write for Anon Key during development/demo
ALTER TABLE farmers DISABLE ROW LEVEL SECURITY;
ALTER TABLE plots DISABLE ROW LEVEL SECURITY;
ALTER TABLE sowing_locks DISABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_preorders DISABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE dealers DISABLE ROW LEVEL SECURITY;
ALTER TABLE remedies DISABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE bids DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE farm_diary DISABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims DISABLE ROW LEVEL SECURITY;
ALTER TABLE logistics_routes DISABLE ROW LEVEL SECURITY;

-- ========================================================
-- SEED DATA (M1 DEMO BENCHMARK)
-- ========================================================

-- Insert Demo Farmer: Ramesh Kumar
INSERT INTO farmers (id, name, lang, phone, village, district, geo_lat, geo_lng)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'रामेश कुमार (Ramesh Kumar)',
    'hi',
    '+919876543210',
    'Murthal Village',
    'Sonipat',
    28.9931,
    77.0151
) ON CONFLICT (phone) DO NOTHING;

-- Insert Plot for Ramesh
INSERT INTO plots (id, farmer_id, acres, soil_type, current_crop, gps_coords)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    2.5,
    'Loamy Soil',
    'Tomato (टमाटर)',
    '28.9931° N, 77.0151° E'
) ON CONFLICT DO NOTHING;

-- Dynamic Regional Sowing Locks for Sonipat District
INSERT INTO sowing_locks (district, crop, acres_locked, demand_ceiling_acres, status)
VALUES 
    ('Sonipat', 'Tomato (टमाटर)', 1200.0, 1200.0, 'RED'),
    ('Sonipat', 'Wheat (गेहूं)', 4100.0, 5000.0, 'AMBER'),
    ('Sonipat', 'Bell Pepper / Shimla Mirch (शिमला मिर्च)', 350.0, 1000.0, 'GREEN'),
    ('Sonipat', 'Mustard / Sarson (सरसों)', 200.0, 800.0, 'GREEN')
ON CONFLICT (district, crop) DO UPDATE 
SET acres_locked = EXCLUDED.acres_locked,
    demand_ceiling_acres = EXCLUDED.demand_ceiling_acres,
    status = EXCLUDED.status;

-- Buyer Pre-orders
INSERT INTO buyer_preorders (buyer_id, buyer_name, crop, qty_kg, month, price_floor)
VALUES 
    ('buyer-freshbite-01', 'FreshBite Cloud Kitchens (Gurugram)', 'Bell Pepper (पीली शिमला मिर्च)', 500.0, 'November 2026', 55.0),
    ('buyer-zomato-hyper-02', 'Hyperpure Dark Store (Delhi North)', 'Cherry Tomato (चेरी टमाटर)', 800.0, 'November 2026', 70.0)
ON CONFLICT DO NOTHING;

-- Verified Agro-Dealer
INSERT INTO dealers (id, name, phone, address, district, distance_km, verified)
VALUES (
    'd4444444-4444-4444-4444-444444444444',
    'शर्मा किसान सेवा केंद्र (Sharma Kisan Seva Kendra)',
    '+919812000000',
    'G.T. Road, Near Bus Stand, Murthal',
    'Sonipat',
    2.1,
    TRUE
) ON CONFLICT DO NOTHING;

-- Initial Sensor Telemetry (ESP32-S3 Baseline)
INSERT INTO sensor_readings (plot_id, moisture, ec, n, p, k, ph, leaf_temp, air_temp, height_cm, pump_relay_state)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    52.0,
    1.4,
    85.0,
    42.0,
    110.0,
    6.8,
    26.2,
    26.5,
    48.0,
    TRUE
) ON CONFLICT DO NOTHING;

-- Live Grade-A Marketplace Listing
INSERT INTO listings (id, farmer_id, crop, qty_kg, grade, geo_coords, quality_score, status)
VALUES (
    'c3333333-3333-3333-3333-333333333333',
    'a1111111-1111-1111-1111-111111111111',
    'Grade-A Ripe Tomato (देसी लाल टमाटर)',
    400.0,
    'Grade A',
    '28.9931, 77.0151',
    96.5,
    'LIVE'
) ON CONFLICT DO NOTHING;

-- Existing Bid in Escrow
INSERT INTO bids (id, listing_id, buyer_id, buyer_name, price_per_kg, total, status)
VALUES (
    'e5555555-5555-5555-5555-555555555555',
    'c3333333-3333-3333-3333-333333333333',
    'buyer-freshbite-01',
    'FreshBite Cloud Kitchens (Delhi NCR)',
    28.0,
    11200.0,
    'ACCEPTED'
) ON CONFLICT DO NOTHING;

-- Active Order with Escrow & Handover Passcode
INSERT INTO orders (id, bid_id, escrow_state, passcode, qr_payload, payout_upi_ref)
VALUES (
    'f6666666-6666-6666-6666-666666666666',
    'e5555555-5555-5555-5555-555555555555',
    'IN_TRANSIT',
    '4829',
    'KISANVAANI:ORDER:f6666666:AMT:11200:CODE:4829:FARMER:RAMESH',
    'UPI/20261017/9876543210/KV992'
) ON CONFLICT DO NOTHING;
