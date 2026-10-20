-- ========================================================
-- KISANVAANI SEED DATA (M1 DEMO BENCHMARK)
-- ========================================================

-- 1. Insert Demo Farmer: Ramesh Kumar
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

-- 2. Insert Plot for Ramesh
INSERT INTO plots (id, farmer_id, acres, soil_type, current_crop, gps_coords)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    2.5,
    'Loamy Soil',
    'Tomato (टमाटर)',
    '28.9931° N, 77.0151° E'
) ON CONFLICT DO NOTHING;

-- 3. Dynamic Regional Sowing Locks for Sonipat District
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

-- 4. Buyer Pre-orders (Matching 10% Exotic Blueprint)
INSERT INTO buyer_preorders (buyer_id, buyer_name, crop, qty_kg, month, price_floor)
VALUES 
    ('buyer-freshbite-01', 'FreshBite Cloud Kitchens (Gurugram)', 'Bell Pepper (पीली शिमला मिर्च)', 500.0, 'November 2026', 55.0),
    ('buyer-zomato-hyper-02', 'Hyperpure Dark Store (Delhi North)', 'Cherry Tomato (चेरी टमाटर)', 800.0, 'November 2026', 70.0)
ON CONFLICT DO NOTHING;

-- 5. Verified Agro-Dealer
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

-- 6. Initial Sensor Telemetry (ESP32-S3 Baseline)
INSERT INTO sensor_readings (plot_id, moisture, ec, n, p, k, ph, leaf_temp, air_temp, height_cm, pump_relay_state)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    52.0,  -- optimal moisture
    1.4,   -- EC mS/cm
    85.0,  -- Nitrogen
    42.0,  -- Phosphorus
    110.0, -- Potassium
    6.8,   -- pH
    26.2,  -- leaf temp
    26.5,  -- air temp (no fever)
    48.0,  -- height in cm
    TRUE
) ON CONFLICT DO NOTHING;

-- 7. Live Grade-A Marketplace Listing
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

-- 8. Existing Bid in Escrow
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

-- 9. Active Order with Escrow & Handover Passcode
INSERT INTO orders (id, bid_id, escrow_state, passcode, qr_payload, payout_upi_ref)
VALUES (
    'f6666666-6666-6666-6666-666666666666',
    'e5555555-5555-5555-5555-555555555555',
    'IN_TRANSIT',
    '4829',
    'KISANVAANI:ORDER:f6666666:AMT:11200:CODE:4829:FARMER:RAMESH',
    'UPI/20261017/9876543210/KV992'
) ON CONFLICT DO NOTHING;
