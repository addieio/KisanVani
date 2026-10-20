<div align="center">

# 🌾 किसानवाणी (KisanVaani)
### *Voice-First AI Agronomist, ESP32 Soil Telemetry Stake & Mandi-Direct Escrow Portal*

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.29-02569B?logo=flutter)](https://flutter.dev/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-Custom_12--Class-00FFFF?logo=ultralytics)](https://ultralytics.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google)](https://deepmind.google/technologies/gemini/)
[![Sarvam AI](https://img.shields.io/badge/Sarvam_AI-Bulbul_Indic_TTS-FF6F00)](https://api.sarvam.ai/)
[![Twilio](https://img.shields.io/badge/Twilio-Voice_%26_SMS_API-F22F46?logo=twilio)](https://www.twilio.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_16-3ECF8E?logo=supabase)](https://supabase.com/)
[![ESP32-S3](https://img.shields.io/badge/Hardware-ESP32--S3_Telemetry-E7352C?logo=espressif)](https://www.espressif.com/)

**Empowering smallholder Indian farmers with real-time biophysical soil intelligence, edge computer-vision crop pathology, Indic-language voice AI, and disintermediated fair-price mandi sales.**

</div>

---

## 📖 Executive Summary & Vision

Smallholder farmers across India face four systemic vulnerabilities:
1. **Late Crop Disease Detection**: Lack of localized diagnostic tools leads to 20-40% yield loss from preventable leaf blights and root rots.
2. **Digital Literacy & Interface Barrier**: Complex keyboards and text-heavy dashboards alienate non-literate farmers who operate primarily through oral communication.
3. **Exploitative Middlemen & Asymmetric Data**: Middlemen depress farmgate prices, while banks (KCC loans) and insurance providers (PMFBY claims) demand verified telemetry evidence that farmers cannot produce.
4. **The Smartphone & Connectivity Divide**: Over 65% of rural Indian farmers do not own a smartphone or operate in dark zones with zero mobile data. They carry basic ₹1,000 keypad feature phones (Nokia, JioBharat) and are completely excluded by modern screen-based AgriTech apps.

**KisanVaani solves this through a unified 4-tier ecosystem**:
- **Zero-Smartphone Offline Inclusion (Sarvam AI + Twilio Voice & SMS Engine)**: Enables 100% offline farmers with basic keypad phones and zero internet to post crops verbally, accept buyer orders over automated Hindi phone calls, and receive order passcodes and biophysical soil alarms via SMS.
- **Voice-First Farmer App (PWA & Flutter Android)**: ≥72px touch targets, zero-typing requirement, native Indic audio (Hindi, Punjabi, Marathi, Tamil, English).
- **ESP32-S3 Soil Stake & Simulator**: Multi-depth capacitive moisture, NPK optical/EC sensing, leaf vs. air temperature differential ("leaf fever" detector).
- **AI Agronomist Doctor**: Real-time YOLOv8 edge vision running on trained weights (`detection/best (1).pt`) paired with Google Gemini 3.8 Flash for conversational Hindi advice with spoken audio.

---

## 🏛️ System Architecture

```
                                  [ Farmer / Smallholder ]
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
   [ Next.js 15 Web PWA ]         [ 2G/Basic Feature Phone ]         [ Flutter Android App ]
 (Speech API, PWA, Vanilla CSS)   (Zero Internet / Keypad GSM)    (Offline-Sync, Camera HUD, TTS)
             │                               │                               │
             │                ┌──────────────┴──────────────┐                │
             │                ▼                             ▼                │
             │      [ Twilio Voice IVR ]          [ Twilio SMS Gateway ]     │
             │   • Verbal Crop Posting (NLU)     • Order Passcode & Updates  │
             │   • Sarvam Bulbul Indic TTS       • Soil Emergency Alerts     │
             │   • Voice / DTMF Acceptance       (Hypoxia, Drought, Urea)    │
             │                └──────────────┬──────────────┘                │
             │                               │                               │
             ├───────────────────────────────┼───────────────────────────────┤
             ▼                               ▼                               ▼
 [ YOLOv8 Edge Vision ]           [ Gemini 3.8 Flash Doctor ]       [ ESP32-S3 Telemetry Dock ]
 • Custom 12-Class Model          • Concise Hindi Agronomy          • N, P, K, Moisture Sliders
 • Real Weights (best.pt)         • Automated Hindi Speech          • 6 Dynamic Biophysics Alerts
 • Bounding Box Localization      • Voice Q&A Diagnostic            • Tubewell Auto-Cutoff Relay
             │                               │                               │
             └───────────────────────────────┴───────────────────────────────┘
                                             │
                                             ▼
                             [ Supabase PostgreSQL 16 ]
                    • 16 Normalized Database Tables
                    • Quota Balancer & Regional Sowing Locks
                    • Mandi-Direct Escrow (4-Digit Handover PIN)
                    • KCC Loan & PMFBY Insurance Dossier Exports
```

---

## ✨ Core Pillars & Features

### 1. 📞 Zero-Smartphone & Zero-Internet Engine (Sarvam AI + Twilio Voice & SMS)

A majority of smallholder cultivators in India do not possess smartphones, 4G/5G mobile data, or literacy in navigating mobile applications. KisanVaani makes **basic keypad feature phones (GSM/2G)** first-class participants in the agricultural economy. Through seamless orchestration between **Twilio Telephony APIs** and **Sarvam AI's Indic Voice Engine**, farmers can execute the complete mandi lifecycle entirely through phone calls and standard SMS.

#### 🎙️ Workflow A: Posting Crops Verbally via Phone Call (No Internet Required)
1. **Interactive Voice IVR**: The farmer dials into the platform (or receives an automated scheduled check-in call) powered by Twilio Voice (`/api/twilio/offline-listing/voice`).
2. **Natural Spoken Hindi Welcome**: The system greets the farmer in clear Devanagari Hindi:
   > *"नमस्ते किसान भाई! किसानवाणी में आपका स्वागत है। आप कौन सी सब्जी या फसल का आर्डर पोस्ट करना चाहते हैं और कितनी मात्रा? जैसे बोलिए: 300 किलो टमाटर। बीप के बाद अपनी आवाज में बोलें।"*
3. **Dialect-Agnostic Speech Capture**: The farmer speaks naturally into their phone's microphone (e.g., *"300 किलो टमाटर 40 रुपये भाव"* or *"5 क्विंटल आलू"*).
4. **Twilio Speech Recognition**: Twilio's `<Gather input="speech" language="hi-IN">` streams the farmer's raw voice audio to the backend (`/api/twilio/offline-listing/gather`).
5. **AI Speech NLU Extraction (Gemini 3.8 Flash + Regex Engine)**: The server extracts structured agricultural parameters:
   - **Crop Commodity**: Translates colloquial names (*"tamatar"*, *"aloo"*, *"pyaz"*, *"mirch"*, *"gobhi"*, *"bhindi"*) into standard marketplace items (e.g., `देसी लाल टमाटर (Tomato)`).
   - **Quantity**: Accurately handles both `किलो (kg)` and `क्विंटल (quintal = 100 kg)`.
   - **Target Rate / Bhav**: Identifies explicit price mentions per kg.
6. **Dynamic Two-Step Conversation**: If the farmer only speaks the crop and quantity without mentioning a price, the IVR does not fail. It asks a conversational follow-up question:
   > *"बहुत बढ़िया! 300 किलो टमाटर दर्ज हो गया। अब आप इसका क्या भाव यानी रेट रखना चाहते हैं? जैसे बोलें 40 रुपये।"*
7. **Instant Supabase & Marketplace Sync**: The produce is automatically published live to the Supabase database (`listings` table) tagged as `OFFLINE_VOICE_POST` and synced with the active buyer portal.
8. **Verbal Confirmation**: Twilio confirms over the phone call:
   > *"धन्यवाद किसान भाई! आपकी आवाज दर्ज कर ली गई है। 300 किलो टमाटर, 40 रुपये प्रति किलो भाव पर मंडी पोर्टल पर ऑफ़लाइन पोस्ट कर दिया गया है। धन्यवाद!"*

---

#### 🤝 Workflow B: Accepting Buyer Orders via Automated Hindi Voice Calls (Sarvam AI Bulbul TTS)
1. **Outbound Call Trigger**: When a mandi buyer or institutional kitchen places an order on the KisanVaani marketplace, the backend triggers an outbound phone call to the farmer's phone via Twilio REST API (`sendOrderConfirmationCall`).
2. **Sarvam AI Bulbul TTS Integration (`bulbul:v4-flash`)**:
   - KisanVaani invokes Sarvam AI's specialized Indic text-to-speech API (`/api/sarvam/audio`) to generate lifelike, natural Hindi audio:
     > *"नमस्कार जी। आपके लिए एक नया ऑर्डर आया है। देसी लाल टमाटर, 300 किलो, कुल राशि 12,000 रुपये। ऑर्डर स्वीकार करने के लिए कृपया एक दबाएं। या हाँ बोलें।"*
   - Generated as telecom-compliant **8000Hz WAV audio** for pristine audio clarity on 2G feature phones.
   - **Zero-Latency In-Memory Audio Pre-Warming**: Audio buffers are pre-rendered during order placement, ensuring Twilio streams the speech in **<15ms** without telecom delay or stutter.
3. **Frictionless Acceptance (Keypad DTMF or Voice Response)**:
   - The farmer can accept hands-free without looking at a screen:
     - **Keypad**: Press **`1`** on physical buttons (DTMF tone detection).
     - **Voice**: Speak affirmative Hindi phrases: *"हाँ"*, *"हां"*, *"स्वीकार"*, *"मंजूर"*, *"हाँ जी"*, *"एक"*, *"ठीक"*, *"done"*.
4. **Colloquial Speech Classifier & State Transition**:
   - Twilio's `<Gather input="speech dtmf" language="hi-IN">` routes the input to `/api/twilio/gather`.
   - The classifier validates the response and immediately updates the Supabase order status from `BID` to **`ACCEPTED`**.
5. **Immediate Verbal Confirmation**:
   - Sarvam AI dynamically streams a warm confirmation back to the call:
     > *"धन्यवाद। आपका ऑर्डर स्वीकार कर लिया गया है। भुगतान आपके बैंक खाते में जल्द आएगा। धन्यवाद।"*

---

#### 📩 Workflow C: Real-Time Updates & Digital Handover Gate PIN via SMS
1. **Instant Order Receipt**: Simultaneously with the order call, Twilio SMS engine (`sendOrderPlacedSms`) dispatches a targeted Unicode Hindi SMS directly to the farmer's keypad phone:
   ```text
   किसानवाणी आर्डर: देसी लाल टमाटर 300किग्रा (₹12000) बुक हुआ। गेट पास पिन: 4829
   ```
2. **Strict Telecom Optimization**: Crafted under 70 Unicode characters to ensure single-segment delivery on Indian telecom networks without multi-part message corruption.
3. **Cryptographic Escrow Security**: The SMS provides the farmer with their unique **4-digit Gate Pass PIN** (`4829`). When cold-chain logistics or mandi trucks arrive at the farmgate, the driver verifies this PIN against the portal before the cryptographic escrow funds are unlocked and transferred.

---

#### 🚨 Workflow D: Biophysical Soil & Crop Emergency Alarms via SMS
1. **IoT Field Sensing**: The ESP32-S3 biophysical stake continuously monitors root-zone moisture, electrical conductivity, and N-P-K nutrient equilibrium.
2. **Autonomous Alert Trigger**: When biophysical pure functions detect a critical stress condition, the system immediately invokes `sendSensorAlertSms`.
3. **Direct Actionable Hindi SMS to Keypad Phone**:
   - 🌊 **Waterlogging / Root Hypoxia**:
     `किसानवाणी अलर्ट: जलभराव! खेत में नमी अधिक है, मोटर तुरंत बंद करें।`
   - ☀️ **Severe Drought Stress**:
     `किसानवाणी अलर्ट: सूखा तनाव! खेत में नमी कम है, तुरंत सिंचाई करें।`
   - ⚠️ **Excess Urea / Nitrogen Toxicity**:
     `किसानवाणी अलर्ट: अत्यधिक नाइट्रोजन! रासायनिक खाद तुरंत रोक दें।`
   - 🍂 **Nitrogen Starvation**:
     `किसानवाणी अलर्ट: नाइट्रोजन कमी! यूरिया या जीवामृत का छिड़काव करें।`
   - 🔒 **Phosphorus Lockout**:
     `किसानवाणी अलर्ट: फास्फोरस कमी! जड़ विकास हेतु डीएपी या SSP खाद दें।`
   - 🥀 **Potassium Deficit**:
     `किसानवाणी अलर्ट: पोटाश कमी! फल चमक व मिठास हेतु 00:00:50 छिड़कें।`
4. **Zero-Data Preservation**: Smallholder farmers receive timely alerts directly in the field, safeguarding their harvest even when far from internet connectivity.

---

### 2. 🌿 Real Edge Crop Pathology (YOLOv8 Detection)
- Replaces generic/mock PlantVillage data with a dedicated custom-trained YOLOv8 model (`detection/best (1).pt`).
- Detects **12 agricultural pathology classes** from [`detection/labels (1).txt`](file:///c:/Users/adity/OneDrive/Documents/krishiagro/detection/labels%20(1).txt):
  `ALS`, `Angular Leafspot`, `Anthracnose Fruit Rot`, `Bean Rust`, `Blossom Blight`, `Gray Mold`, `Leaf Spot`, `Powdery Mildew Fruit`, `Powdery Mildew Leaf`, `disease`, `leaf mold`, `spider mites`.
- Includes verified remedy, active ingredient, dosage per 15L backpack pump, and government-subsidized MRP caps.

### 3. 🤖 Gemini 3.8 Flash Conversational Hindi Agronomist
- Seamless conversational consultation powered by Google Gemini 3.8 Flash.
- Prompt-engineered specifically for smallholder agronomist triage: delivers actionable, 2-3 sentence Hindi remedies.
- **Native Indic Text-To-Speech (TTS)**: Every diagnosis and response is automatically spoken out loud in native accents.

### 4. 📡 ESP32-S3 Hardware Stake & Live Simulator
- **Interactive Slider Bars**: Real-time manipulation of:
  - 💧 **Soil Moisture**: `0% - 100%` (highlights drought <30% vs. saturation >80%)
  - 🧪 **Nitrogen (N)**: `0 - 200 mg/kg` (flags starvation <40 vs. toxicity >150)
  - 🌿 **Phosphorus (P)**: `0 - 150 mg/kg` (detects lockout <25)
  - 🥔 **Potassium (K)**: `0 - 300 mg/kg` (detects fruit quality deficit <60)
- **Dynamic Biophysics Pure Functions**: Evaluates root hypoxia, transpiration shutdown ("leaf fever"), and nutrient starvation without arbitrary heuristics.
- **1-Click Test Scenarios (Presets)**:
  - 🌊 *Root Hypoxia & Waterlogging* (`88% moisture`)
  - ☀️ *Severe Drought Stress* (`18% moisture`)
  - 🍂 *Nitrogen Starvation* (`22 mg/kg N`)
  - ⚠️ *Nitrogen Toxicity / Excess Urea* (`175 mg/kg N`)
  - 🔒 *Phosphorus Lockout* (`14 mg/kg P`)
  - 🥀 *Potassium Deficit* (`45 mg/kg K`)
  - 🟢 *Optimal Soil Equilibrium* (`98% Health Score`)
- **1-Tap Cloud Broadcast**: Direct HTTP POST to Supabase `sensor_readings` and `alerts` tables.

### 5. 💰 Mandi-Direct B2B Marketplace & Escrow Logistics
- **Dual Quantity Input & Flexible Checkout**: Buyers can enter custom kilogram quantities, use increment/decrement controls, quick preset pills (50kg, 100kg, 250kg, 500kg), or adjust an interactive range slider.
- **Cold-Chain Logistics Ring Matrix**: Multi-ring dispatch routing (R1, R2, R3) calculating per-kg freight, sensor telemetry, and transit temperature monitoring.
- **Cryptographic Escrow Handover**: Generates spoken passcodes and digital gate scanner verification (`KV-XXXX`) before escrow release.

### 6. 📄 Farmer Financial Passport (KCC Loan & PMFBY Claim)
- Dedicated **प्रोफाइल (Profile)** tab (`KISAN-DL-9821`).
- Provides 3 verified download exports for formal institutional inclusion:
  1. **KCC Bank Loan Telemetry Passport**: Certified soil quality, irrigation compliance, and NPK stability record for bank credit officers.
  2. **PMFBY Crop Insurance Loss Dossier**: Tamper-proof telemetry audit log proving waterlogging / drought events for fast-track claim settlement.
  3. **Complete CSV Ledger Export**: Timestamped audit trail of all transactions and sensor logs.

---

## 🗄️ Supabase Database Architecture (16 Tables)

The platform is backed by a fully normalized Supabase PostgreSQL schema defined in [`supabase/full_setup.sql`](file:///c:/Users/adity/OneDrive/Documents/krishiagro/supabase/full_setup.sql):

| Table | Purpose |
| :--- | :--- |
| `farmers` | Farmer registration, phone, district, GPS coordinates, language preference. |
| `plots` | Acreage, soil classification, active crop, GIS polygon boundaries. |
| `sowing_locks` | Quota Balancer: regional crop ceiling locks (`GREEN`, `AMBER`, `RED`). |
| `buyer_preorders` | Forward contracts from institutional cloud kitchens and dark stores. |
| `sensor_readings` | ESP32-S3 telemetry: Moisture, EC, N, P, K, pH, leaf temp, air temp, pump state. |
| `alerts` | Dynamic biophysics alerts with multilingual spoken text (`hi`, `pa`, `mr`, `en`). |
| `dealers` | Verified local agro-dealers and distance calculations. |
| `remedies` | Recommended chemical & organic curative steps with MRP price caps. |
| `dealer_leads` | Lead tracking and referral monetization log. |
| `listings` | Active marketplace crop listings, quality scores, and verification PINs. |
| `bids` | Buyer bids and procurement offers. |
| `orders` | Escrow state machine: `BID` ➔ `ACCEPTED` ➔ `IN_TRANSIT` ➔ `HANDOVER` ➔ `PAID`. |
| `order_events` | Immutable audit log of all order events and SMS/IVR notifications. |
| `farm_diary` | Immutable sensor diary for insurance proof. |
| `insurance_claims`| PMFBY insurance claims, evidence dossier URLs, and approval status. |
| `logistics_routes`| Radial delivery clusters (<80km, 80-300km, >300km) and transport costs. |


---


## 📱 Hardware Stake Pinout Reference (ESP32-S3)

For physical hardware deployments in the field:

| Sensor Module | Protocol | ESP32-S3 Pin | Function |
| :--- | :--- | :--- | :--- |
| **RS485 NPK Sensor** | Modbus RTU (9600 baud) | GPIO 17 (TX), GPIO 18 (RX) | N, P, K nutrient levels (mg/kg) |
| **Capacitive Moisture v2.0** | Analog (ADC1) | GPIO 4 (ADC1_CH3) | Volumetric Water Content (VWC %) |
| **DS18B20 Soil Probe** | 1-Wire Bus | GPIO 5 (4.7kΩ pullup) | Sub-surface root zone temperature |
| **MLX90614 IR Temp** | I2C (100kHz) | GPIO 8 (SDA), GPIO 9 (SCL) | Non-contact leaf canopy temperature |
| **5V Pump Relay** | Active-High Logic | GPIO 21 | Tubewell motor auto-cutoff control |

---



## 📜 License & Acknowledgements

Developed with ❤️ for Indian smallholder farmers. Distributed under the MIT License.
