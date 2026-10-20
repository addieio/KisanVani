// Verification script for biological physics formulas and business rules
import { evaluateSoilPhysics } from '../src/lib/physics-engine.ts';
import { evaluateCropQuota } from '../src/lib/quota-engine.ts';
import { computeLogisticsRing } from '../src/lib/logistics-engine.ts';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('\n--- 1. Testing Root Hypoxia Guard (Moisture > 85% -> Pump Relay OFF) ---');
const hypoxiaReading = {
  plot_id: 'test-plot',
  ts: new Date().toISOString(),
  moisture: 91.0,
  ec: 1.4,
  n: 80,
  p: 40,
  k: 100,
  ph: 6.8,
  leaf_temp: 24.0,
  air_temp: 26.5,
  height_cm: 48,
  pump_relay_state: true,
};
const hypoxiaEval = evaluateSoilPhysics(hypoxiaReading);
assert(hypoxiaEval.pumpRelayState === false, '5HP pump relay turned OFF automatically');
assert(hypoxiaEval.alerts.some(a => a.type === 'HYPOXIA'), 'Hypoxia alert generated');

console.log('\n--- 2. Testing Pre-Visual Bacterial Wilt (Leaf Fever: Leaf > Air + 2°C) ---');
const wiltReading = {
  plot_id: 'test-plot',
  ts: new Date().toISOString(),
  moisture: 50.0, // normal moisture
  ec: 0.7,
  n: 80,
  p: 40,
  k: 100,
  ph: 6.8,
  leaf_temp: 30.5, // 30.5 - 27.0 = 3.5°C fever
  air_temp: 27.0,
  height_cm: 48,
  pump_relay_state: true,
};
const wiltEval = evaluateSoilPhysics(wiltReading);
assert(wiltEval.alerts.some(a => a.type === 'BACTERIAL_WILT'), 'Bacterial Wilt / Leaf Fever detected 3-5 days early');

console.log('\n--- 3. Testing Phytophthora Root Rot (Moisture > 55% + Low EC uptake) ---');
const rootRotReading = {
  plot_id: 'test-plot',
  ts: new Date().toISOString(),
  moisture: 70.0,
  ec: 0.4, // frozen uptake
  n: 80,
  p: 40,
  k: 100,
  ph: 6.8,
  leaf_temp: 25.0,
  air_temp: 25.5,
  height_cm: 48,
  pump_relay_state: true,
};
const rootRotEval = evaluateSoilPhysics(rootRotReading);
assert(rootRotEval.alerts.some(a => a.type === 'ROOT_ROT'), 'Phytophthora Root Rot detected');

console.log('\n--- 4. Testing Dynamic Regional Sowing Quota Engine (Tomato RED 100%) ---');
const redLock = {
  id: 'lock-01',
  district: 'Sonipat',
  crop: 'Tomato (टमाटर)',
  acres_locked: 1200,
  demand_ceiling_acres: 1200,
  status: 'RED',
};
const quotaEval = evaluateCropQuota(redLock);
assert(quotaEval.status === 'RED', 'Sonipat Tomato quota evaluated as RED');
assert(quotaEval.isLocked === true, 'Sowing lock activated on 100% saturation');
assert(quotaEval.exoticAlternative !== undefined, '10% Exotic Micro-Plot Blueprint provided');
assert(quotaEval.exoticAlternative.expectedPricePerKg === 65, 'Exotic Yellow Bell Pepper floor price is ₹65/kg');

console.log('\n--- 5. Testing 3-Ring Smart Distance Logistics Calculator ---');
const ring1 = computeLogisticsRing(45);
assert(ring1.ring === 1 && ring1.costPerKg === 2.40, 'Ring 1 (<80 km) delivers direct at ₹2.40/kg');

const ring2 = computeLogisticsRing(150);
assert(ring2.ring === 2 && ring2.costPerKg === 1.60, 'Ring 2 (80-300 km) delivers pooled cluster at ₹1.60/kg');

const ring3 = computeLogisticsRing(380);
assert(ring3.ring === 3 && ring3.costPerKg === 0.95, 'Ring 3 (>300 km) delivers backhaul empty truck at ₹0.95/kg');

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log(`========================================\n`);

if (testsFailed > 0) {
  process.exit(1);
}
