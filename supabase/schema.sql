-- ========================================================
-- KISANVAANI SUPABASE DATABASE SCHEMA
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
    soil_type TEXT NOT NULL, -- e.g. 'Loamy', 'Black Cotton', 'Sandy Loam'
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

-- 5. Sensor Readings (ESP32-S3 Stake telemetry)
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
    type TEXT NOT NULL, -- 'HYPOXIA', 'ROOT_ROT', 'BACTERIAL_WILT', 'NITROGEN_CURVE', 'PHOSPHORUS_LOCK'
    severity TEXT NOT NULL, -- 'CRITICAL', 'WARNING', 'INFO'
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

-- 9. Dealer Referral Leads (Monetization tracker)
CREATE TABLE IF NOT EXISTS dealer_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Marketplace Listings
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop TEXT NOT NULL,
    qty_kg NUMERIC(10,2) NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade A', -- 'Grade A', 'Grade B', 'Grade C'
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    geo_coords TEXT,
    quality_score NUMERIC(5,2) DEFAULT 95.0,
    status TEXT NOT NULL DEFAULT 'LIVE', -- 'PENDING_SYNC', 'LIVE', 'SOLD', 'CANCELLED'
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
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'REJECTED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Orders & Escrow
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
    escrow_state TEXT NOT NULL DEFAULT 'BID', -- 'BID', 'ACCEPTED', 'IN_TRANSIT', 'HANDOVER', 'PAID', 'REJECTED'
    passcode VARCHAR(4) NOT NULL,
    qr_payload TEXT NOT NULL,
    payout_upi_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Order Events (SMS / Voice IVR audit log)
CREATE TABLE IF NOT EXISTS order_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    payload JSONB,
    ts TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Farm Diary (Insurance Evidence)
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
    status TEXT NOT NULL DEFAULT 'PENDING_REVIEW', -- 'PENDING_REVIEW', 'FAST_TRACK_APPROVED', 'REJECTED'
    filed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Logistics Routes
CREATE TABLE IF NOT EXISTS logistics_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    ring INT NOT NULL, -- 1 (<80km), 2 (80-300km), 3 (>300km)
    cluster_id TEXT,
    cost_per_kg NUMERIC(6,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_plot ON sensor_readings(plot_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_sowing_locks_district ON sowing_locks(district);
