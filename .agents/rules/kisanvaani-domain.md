# KisanVaani Agricultural Domain Rules & Bio-Physics Formulas

## 1. Soil Physics Guardians
All rules must be evaluated as pure functions without side effects:
- **Root Hypoxia Guard**:
  ```ts
  hypoxia = moisture > 85 for 48h && soilTempDrop > 1.5°C
  // Action: Voice "पानी देना बंद करें! जड़ें डूब रही हैं" + 5HP pump relay OFF
  ```
- **Pre-Visual Phytophthora Root Rot**:
  ```ts
  rootRot = moisture > 55 && npkUptakeDelta36h ≈ 0
  // Action: Fires 3-5 days before visual wilting -> Remedy Trichoderma viride Day-1
  ```
- **Bacterial Wilt (Leaf Fever)**:
  ```ts
  wilt = moisture >= 40 && moisture <= 60 && npkUptake ≈ 0 && (leafTemp - airTemp) > 2.0°C
  // Action: Leaf fever alert -> Copper Oxychloride / Streptocycline soil drench
  ```
- **Nitrogen Curve**:
  ```ts
  nLow = dN/day < expected * 0.6  // Chlorosis alert
  nHigh = dN/day > expected * 1.5 // Vegetative lock warning: "Zero flowers"
  ```
- **Phosphorus Lockout**:
  ```ts
  pLock = (pH < 6.0 || pH > 7.5) && P < threshold && heightGrowth7d == 0
  // Action: pH-fix / gypsum plan
  ```
- **Potassium Fruiting Boost**:
  ```ts
  kBoost = cropDay >= 60 && K < threshold
  // Action: MOP (Muriate of Potash) alert
  ```

## 2. Dynamic Regional Crop Quota
- `quotaRed = lockedAcres / demandCeilingAcres >= 1.0` (RED: 100% full, lock sowing)
- `quotaAmber = lockedAcres / demandCeilingAcres >= 0.8` (AMBER: filling fast)
- `quotaGreen = lockedAcres / demandCeilingAcres < 0.8` (GREEN: open)
- When RED is triggered, pivot farmer to **10% Exotic Micro-Plot Blueprint** matching buyer pre-orders.

## 3. Computer Vision Grading
- Scale calibration: ₹10 Indian Coin has an exact diameter of **27.0 mm**.
- Target:
  ```ts
  gradeA = sizeMM >= targetMM * 0.9 && ripenessPct >= 80 && blemishPct <= 5
  ```

## 4. 3-Ring Smart Distance Logistics
- Ring 1 (<80 km): Direct farm-gate delivery (₹2.40/kg)
- Ring 2 (80–300 km): Pooled 1.5-ton village cluster (milk-run) (₹1.60/kg)
- Ring 3 (>300 km): Return-leg empty trucks at 60% discount (₹0.95/kg)
