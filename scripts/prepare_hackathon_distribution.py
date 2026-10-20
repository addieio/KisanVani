#!/usr/bin/env python3
"""
KisanVaani Hackathon Team Code Distribution Script
Divides the complete codebase into 4 logical packages for 4 team members:
- Member 1: Web PWA & Voice Engine (Next.js 15, Tailwind, Web Speech API)
- Member 2: Flutter Android Mobile App (Dart, Native Camera, BLE, Android Manifest)
- Member 3: AI/ML & Vision Service (YOLOv8 Detection, Gemini 3.8 Flash Doctor)
- Member 4: IoT Hardware Stake & Supabase Backend (ESP32 Biophysics, SQL Schema, Mandi Direct)
"""

import os
import shutil
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_DIR = os.path.join(BASE_DIR, "hackathon_team_modules")

def copy_folder_clean(src, dst, ignore_patterns=None):
    if not os.path.exists(src):
        return
    if os.path.exists(dst):
        shutil.rmtree(dst)
    
    if ignore_patterns is None:
        ignore_patterns = shutil.ignore_patterns(
            "node_modules", ".next", "build", ".dart_tool", ".gradle", 
            "*.tsbuildinfo", "*.pyc", "__pycache__"
        )
    shutil.copytree(src, dst, ignore=ignore_patterns)

def copy_file_safe(src, dst):
    if os.path.exists(src):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)

def main():
    print(f"Preparing Hackathon Team Modules in: {OUTPUT_DIR}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # ---------------------------------------------------------
    # Member 1: Frontend & Voice-First Web PWA
    # ---------------------------------------------------------
    m1_dir = os.path.join(OUTPUT_DIR, "member1_web_pwa")
    os.makedirs(m1_dir, exist_ok=True)
    print("Packaging Member 1: Web PWA & Voice Engine...")
    copy_folder_clean(os.path.join(BASE_DIR, "src"), os.path.join(m1_dir, "src"))
    copy_folder_clean(os.path.join(BASE_DIR, "public"), os.path.join(m1_dir, "public"))
    copy_file_safe(os.path.join(BASE_DIR, "package.json"), os.path.join(m1_dir, "package.json"))
    copy_file_safe(os.path.join(BASE_DIR, "package-lock.json"), os.path.join(m1_dir, "package-lock.json"))
    copy_file_safe(os.path.join(BASE_DIR, "next.config.mjs"), os.path.join(m1_dir, "next.config.mjs"))
    copy_file_safe(os.path.join(BASE_DIR, "tailwind.config.js"), os.path.join(m1_dir, "tailwind.config.js"))
    copy_file_safe(os.path.join(BASE_DIR, "postcss.config.js"), os.path.join(m1_dir, "postcss.config.js"))
    copy_file_safe(os.path.join(BASE_DIR, "tsconfig.json"), os.path.join(m1_dir, "tsconfig.json"))
    copy_file_safe(os.path.join(BASE_DIR, ".env.example"), os.path.join(m1_dir, ".env.example"))

    with open(os.path.join(m1_dir, "README_MEMBER1.md"), "w", encoding="utf-8") as f:
        f.write("""# Member 1: KisanVaani Web PWA & Voice Engine

## Responsibilities
- Voice-First Illiterate-Accessible Web PWA (`src/`)
- Pure Vanilla CSS & Tailwind responsive tokens with >=72px touch ergonomics
- Web Speech API integration (`SpeechCaptions.tsx`, `useKisan()` voice engine)
- Farmer Navigation & Multi-Lingual routing (Hindi, Punjabi, Marathi, Tamil, English)

## How to Commit & Push to Repo
```bash
git checkout -b feat/web-pwa-voice-engine
git add src/ public/ package.json next.config.mjs tailwind.config.js
git commit -m "feat(pwa): voice-first multilingual farmer web portal with >=72px touch ergonomics"
git push origin feat/web-pwa-voice-engine
```
""")

    # ---------------------------------------------------------
    # Member 2: Mobile App (Flutter Native Android)
    # ---------------------------------------------------------
    m2_dir = os.path.join(OUTPUT_DIR, "member2_flutter_mobile")
    os.makedirs(m2_dir, exist_ok=True)
    print("Packaging Member 2: Flutter Android Mobile App...")
    copy_folder_clean(
        os.path.join(BASE_DIR, "mobile"), 
        os.path.join(m2_dir, "mobile"),
        ignore_patterns=shutil.ignore_patterns(".dart_tool", "build", ".gradle", "app-debug.apk", "*.lock")
    )

    with open(os.path.join(m2_dir, "README_MEMBER2.md"), "w", encoding="utf-8") as f:
        f.write("""# Member 2: KisanVaani Android Native Mobile App

## Responsibilities
- Flutter 3.29 + Android native build (`mobile/lib/main.dart`)
- Offline camera scanner & laser reticle leaf viewfinder
- Native Android TTS audio with real-time Indic accents
- 5-tab zero-text-input farmer workflow (खेत, डॉक्टर, बेचें, यंत्र, प्रोफाइल)

## How to Commit & Push to Repo
```bash
git checkout -b feat/flutter-android-app
git add mobile/
git commit -m "feat(mobile): offline-capable Flutter Android app with native camera leaf scanner and TTS"
git push origin feat/flutter-android-app
```
""")

    # ---------------------------------------------------------
    # Member 3: AI/ML Vision & Gemini Voice Doctor
    # ---------------------------------------------------------
    m3_dir = os.path.join(OUTPUT_DIR, "member3_ai_ml_vision")
    os.makedirs(m3_dir, exist_ok=True)
    print("Packaging Member 3: AI/ML Vision & Gemini Doctor...")
    copy_folder_clean(os.path.join(BASE_DIR, "detection"), os.path.join(m3_dir, "detection"))
    copy_file_safe(os.path.join(BASE_DIR, "scripts", "detector_service.py"), os.path.join(m3_dir, "detector_service.py"))
    copy_folder_clean(os.path.join(BASE_DIR, "src", "app", "api"), os.path.join(m3_dir, "api_routes"))

    with open(os.path.join(m3_dir, "README_MEMBER3.md"), "w", encoding="utf-8") as f:
        f.write("""# Member 3: AI/ML Disease Vision & Gemini Agronomist Doctor

## Responsibilities
- YOLOv8 Custom-Trained 12-Class Crop Leaf Disease Model (`detection/best (1).pt`)
- FastAPI / Daemon microservice (`detector_service.py`) running on port 8000
- Google Gemini 3.8 Flash Hindi Conversational Agronomist Voice Chat
- Pure function bio-physics disease evaluation rules

## How to Commit & Push to Repo
```bash
git checkout -b feat/yolov8-gemini-ai
git add detection/ scripts/detector_service.py src/app/api/
git commit -m "feat(ai-ml): YOLOv8 12-class edge disease detection and Gemini 3.8 Flash Hindi voice doctor"
git push origin feat/yolov8-gemini-ai
```
""")

    # ---------------------------------------------------------
    # Member 4: IoT Hardware Stake & Supabase Cloud Backend
    # ---------------------------------------------------------
    m4_dir = os.path.join(OUTPUT_DIR, "member4_iot_backend_supabase")
    os.makedirs(m4_dir, exist_ok=True)
    print("Packaging Member 4: IoT Hardware Stake & Supabase Cloud...")
    copy_folder_clean(os.path.join(BASE_DIR, "supabase"), os.path.join(m4_dir, "supabase"))
    copy_folder_clean(os.path.join(BASE_DIR, "src", "app", "simulator"), os.path.join(m4_dir, "simulator_web"))
    copy_file_safe(os.path.join(BASE_DIR, "scripts", "verify-physics.mjs"), os.path.join(m4_dir, "verify-physics.mjs"))

    with open(os.path.join(m4_dir, "README_MEMBER4.md"), "w", encoding="utf-8") as f:
        f.write("""# Member 4: IoT Stake Simulator & Supabase Database Backend

## Responsibilities
- ESP32-S3 Soil Stake Hardware Simulator (N, P, K, Soil Moisture live slider bars)
- 16 PostgreSQL Database Tables (`supabase/full_setup.sql`)
- Dynamic Biophysics Quota Balancer and Regional Sowing Locks
- Escrow Order state machine & KCC / PMFBY Loan & Claim Telemetry Passport Exporter

## How to Commit & Push to Repo
```bash
git checkout -b feat/iot-stake-supabase-backend
git add supabase/ src/app/simulator/
git commit -m "feat(iot-db): ESP32-S3 soil telemetry stake simulator and 16-table Supabase escrow database"
git push origin feat/iot-stake-supabase-backend
```
""")

    print("\nCreating ZIP archives for quick sending via WhatsApp/Email/Drive...")
    zips_dir = os.path.join(OUTPUT_DIR, "zips")
    os.makedirs(zips_dir, exist_ok=True)
    for pkg in ["member1_web_pwa", "member2_flutter_mobile", "member3_ai_ml_vision", "member4_iot_backend_supabase"]:
        pkg_path = os.path.join(OUTPUT_DIR, pkg)
        zip_base = os.path.join(zips_dir, pkg)
        shutil.make_archive(zip_base, "zip", pkg_path)
        print(f" - Created: zips/{pkg}.zip ({round(os.path.getsize(zip_base + '.zip') / 1024, 1)} KB)")

    print("\n✅ All 4 Hackathon Team Packages & ZIPs successfully created in: hackathon_team_modules/")
    for item in sorted(os.listdir(OUTPUT_DIR)):
        print(f" - {item}")

if __name__ == "__main__":
    main()
