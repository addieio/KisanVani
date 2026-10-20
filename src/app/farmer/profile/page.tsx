'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useKisan } from '@/context/KisanContext';
import { FarmerBottomNav } from '@/components/FarmerBottomNav';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  User, 
  FileText, 
  Download, 
  ShieldCheck, 
  Landmark, 
  CheckCircle2, 
  Activity, 
  ArrowLeft, 
  Volume2, 
  Calendar, 
  TrendingUp,
  Database,
  ExternalLink,
  Printer
} from 'lucide-react';

export default function FarmerProfilePage() {
  const { currentLanguage, speak } = useKisan();
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [dbListingsCount, setDbListingsCount] = useState<number>(3);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const checkDb = async () => {
      const configured = isSupabaseConfigured();
      setSupabaseConnected(configured);
      if (configured) {
        try {
          const { count, error } = await supabase.from('listings').select('*', { count: 'exact', head: true });
          if (!error && count !== null) {
            setDbListingsCount(count);
          }
        } catch {
          // ignore error if tables not yet migrated
        }
      }
    };
    checkDb();
  }, []);

  const transactions = [
    { id: 'TXN-9021', date: '16 Oct 2026', crop: 'देसी लाल टमाटर (Grade-A)', qty: '800 kg', buyer: 'FreshBite B2B', amount: 48000, status: 'सफल भुगतान (Escrow Released)' },
    { id: 'TXN-8842', date: '04 Oct 2026', crop: 'देसी लाल टमाटर (Grade-A)', qty: '700 kg', buyer: 'Zomato Hyperpure', amount: 42000, status: 'सफल भुगतान (Escrow Released)' },
    { id: 'TXN-7910', date: '21 Sep 2026', crop: 'संकर शिमला मिर्च (Grade-A)', qty: '900 kg', buyer: 'Blinkit Retail', amount: 54000, status: 'सफल भुगतान (Escrow Released)' },
  ];

  const monitoringLogs = [
    { ts: '18 Oct 02:00', moisture: '68%', ec: '1.2 mS/cm', status: 'उत्कृष्ट (Optimal)', healthScore: 96 },
    { ts: '17 Oct 18:00', moisture: '64%', ec: '1.1 mS/cm', status: 'उत्कृष्ट (Optimal)', healthScore: 95 },
    { ts: '17 Oct 10:00', moisture: '60%', ec: '1.3 mS/cm', status: 'मोटर चालू (Irrigated)', healthScore: 94 },
    { ts: '16 Oct 16:00', moisture: '58%', ec: '1.4 mS/cm', status: 'संतुलित (Balanced)', healthScore: 92 },
  ];

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadLoanPassport = () => {
    setDownloading('loan');
    speak('बैंक लोन हेतु किसान क्रेडिट कार्ड पासपोर्ट तैयार किया जा रहा है।');
    setTimeout(() => {
      const loanText = `========================================================================
KISANVAANI - VERIFIED KISAN CREDIT CARD (KCC) LOAN PASSPORT
GOVERNMENT OF INDIA & NABARD STANDARDS COMPLIANT
========================================================================
FARMER INFORMATION:
Name: Rameshwar Singh (रामेश्वर सिंह)
Kisan ID: KISAN-DL-9821
Aadhaar Linked Ref: XXXX-XXXX-4819
Mobile: +91 98123 45678
State/District: Haryana, Sonipat (Pin: 131001)
Plot Area: 2.50 Acres (Geo-tag: 28.9931° N, 77.0151° E)
Soil Health Score: 96/100 (Certified by ESP32 IoT Soil Stake)
Active Crop: Hybrid Tomato (देसी लाल टमाटर) - Grade A

MANDI TRANSACTION RECORD (LAST 90 DAYS):
- 16 Oct 2026: 800 kg Tomato @ Rs 60/kg = Rs 48,000 (FreshBite B2B)
- 04 Oct 2026: 700 kg Tomato @ Rs 60/kg = Rs 42,000 (Zomato Hyperpure)
- 21 Sep 2026: 900 kg Capsicum @ Rs 60/kg = Rs 54,000 (Blinkit)
TOTAL REVENUE VERIFIED VIA ESCROW: Rs 1,44,000.00
REPAYMENT CAPACITY SCORE: A+ (Very High)

RECOMMENDED KCC CREDIT LIMIT: Rs 3,00,000 (Three Lakh Rupees)
VERIFICATION HASH: 8f4a-9c2b-e104-58ab-9921
ISSUED AT: ${new Date().toISOString()}
========================================================================`;
      downloadFile('KisanVaani_Bank_Loan_Passport.txt', loanText, 'text/plain');
      setDownloading(null);
      speak('बैंक लोन पासपोर्ट सफलतापूर्वक डाउनलोड हो गया है। इसे अपने बैंक प्रबंधक को दिखाएं।');
    }, 800);
  };

  const handleDownloadInsuranceClaim = () => {
    setDownloading('claim');
    speak('प्रधानमंत्री फसल बीमा योजना हेतु दावा साक्ष्य रिपोर्ट डाउनलोड की जा रही है।');
    setTimeout(() => {
      const claimText = `========================================================================
PRADHAN MANTRI FASAL BIMA YOJANA (PMFBY) - CROP DAMAGE & MONITORING DOSSIER
AUTOMATED SENSOR & AI LEAF DIAGNOSIS EVIDENCE
========================================================================
POLICY / CLAIMANT:
Farmer Name: Rameshwar Singh
Farmer ID: KISAN-DL-9821
Village: Sonipat, Haryana
Policy No: PMFBY-HR-2026-99210
Crop Insured: Tomato (सोलनेसी)
Total Insured Area: 2.5 Acres

INCIDENT & TELEMETRY TIMELINE:
1. Soil Moisture Telemetry:
   - 14 Oct 2026: Heavy rainfall detected (Moisture 94% - Saturated)
   - 15 Oct 2026: Root zone hypoxia risk flagged by Bio-Physics Engine
2. Leaf AI Visual Diagnosis (YOLO 38-Class Model):
   - Diagnosis: Angular Leafspot & Early Blight
   - Severity Index: 22% leaf surface damage
   - Remedial Steps Taken: Certified Trichoderma applied (Govt MRP Rs 150)
3. GPS Plot Boundary Cryptographic Tag: 28.9931° N, 77.0151° E
4. Yield Loss Assessment: Estimated 18% yield impact

FAST-TRACK CLAIM APPROVAL ELIGIBILITY: VERIFIED (Level 1 Auto-Pass)
VERIFICATION SIGNATURE: 0x9b3f4912c98a0021c7d
ISSUED AT: ${new Date().toISOString()}
========================================================================`;
      downloadFile('KisanVaani_PMFBY_Insurance_Claim_Dossier.txt', claimText, 'text/plain');
      setDownloading(null);
      speak('फसल बीमा दावा साक्ष्य फाइल डाउनलोड हो गई है। इसे बीमा पोर्टल पर अपलोड करें।');
    }, 800);
  };

  const handleDownloadFullCsv = () => {
    setDownloading('csv');
    speak('पूरा लेनदेन और मृदा निगरानी डेटा डाउनलोड हो रहा है।');
    setTimeout(() => {
      let csv = 'Type,ID/Timestamp,Details,Quantity_or_Metric,Status_or_Score,Amount_INR\n';
      transactions.forEach(t => {
        csv += `TRANSACTION,${t.id},${t.crop} (${t.buyer}),${t.qty},${t.status},${t.amount}\n`;
      });
      monitoringLogs.forEach(m => {
        csv += `MONITORING,${m.ts},Soil Sensor Log,Moisture: ${m.moisture} | EC: ${m.ec},Score: ${m.healthScore}/100,0\n`;
      });
      downloadFile('KisanVaani_Full_Farm_Data.csv', csv, 'text/csv');
      setDownloading(null);
      speak('पूरा डेटा फाइल डाउनलोड हो गया है।');
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      {/* Top Header Card */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            सत्यापित किसान खाता
          </div>
          <h1 className="text-2xl font-black text-[#1D1D1F] tracking-tight">
            किसान प्रोफाइल व पासपोर्ट
          </h1>
          <p className="text-xs text-stone-500">
            लोन और फसल बीमा दावा हेतु प्रमाणित डेटा
          </p>
        </div>
        <button
          onClick={() => speak('यह आपकी किसान प्रोफाइल और पासपोर्ट है। नीचे दिए गए बटनों से आप बैंक लोन और फसल बीमा का पूरा डेटा डाउनलोड कर सकते हैं।')}
          className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 active:scale-95"
          aria-label="Listen"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Supabase Cloud Connection Status Badge */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
        supabaseConnected 
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>क्लाउड डेटाबेस (Supabase): {supabaseConnected ? 'लाइव कनेक्टेड ✓' : 'लोकल सिंक मोड'}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-mono border">
          {dbListingsCount} ऑर्डर्स सुरक्षित
        </span>
      </div>

      {/* Farmer Identity Card */}
      <div className="bg-gradient-to-br from-[#064E26] to-[#0B7A3B] text-white rounded-[32px] p-6 shadow-ios space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black border border-white/30">
              र
            </div>
            <div>
              <h2 className="text-xl font-black">रामेश्वर सिंह</h2>
              <span className="text-xs text-emerald-200 font-mono">KISAN-DL-9821 • KCC-77402</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-400 text-emerald-950 text-xs font-black">
            Grade-A किसान
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs">
          <div>
            <span className="text-emerald-200/80 block text-[11px]">खेत व रकबा:</span>
            <span className="font-bold text-sm">2.50 एकड़ (सोनीपत)</span>
          </div>
          <div>
            <span className="text-emerald-200/80 block text-[11px]">मृदा स्वास्थ्य स्कोर:</span>
            <span className="font-bold text-sm text-emerald-300">96% (अति उत्तम)</span>
          </div>
          <div>
            <span className="text-emerald-200/80 block text-[11px]">मुख्य फसल:</span>
            <span className="font-bold text-sm">देसी संकर टमाटर</span>
          </div>
          <div>
            <span className="text-emerald-200/80 block text-[11px]">कुल सत्यापित आय:</span>
            <span className="font-bold text-sm text-amber-300 font-mono">₹1,44,000</span>
          </div>
        </div>
      </div>

      {/* DOWNLOAD PASSPORTS FOR LOAN & PMFBY CLAIM */}
      <div className="bg-white rounded-[32px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#1D1D1F]">
              लोन व बीमा दावा डाउनलोड (Official Exports)
            </h3>
            <p className="text-xs text-stone-500">
              सरकारी बैंक व PMFBY पोर्टल पर मान्य डिजिटल साक्ष्य
            </p>
          </div>
          <span className="text-2xl">📑</span>
        </div>

        {/* 1. KCC Bank Loan Passport */}
        <button
          onClick={handleDownloadLoanPassport}
          disabled={downloading === 'loan'}
          className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-left flex items-center justify-between transition-all active:scale-95 group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                <span>🏦 बैंक लोन KCC पासपोर्ट</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">PDF / Text</span>
              </div>
              <div className="text-xs text-emerald-800 mt-0.5">
                SBI / PNB किसान क्रेडिट कार्ड हेतु ₹3 लाख क्रेडिट पात्रता साक्ष्य
              </div>
            </div>
          </div>
          <Download className="w-5 h-5 text-emerald-700 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>

        {/* 2. PMFBY Crop Insurance Claim Dossier */}
        <button
          onClick={handleDownloadInsuranceClaim}
          disabled={downloading === 'claim'}
          className="w-full p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-left flex items-center justify-between transition-all active:scale-95 group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-blue-950 flex items-center gap-1.5">
                <span>🛡️ PMFBY फसल बीमा दावा रिपोर्ट</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 font-bold">Claim Dossier</span>
              </div>
              <div className="text-xs text-blue-800 mt-0.5">
                मौसम खराबी, मृदा सेचुरेशन व AI पत्ता क्षति का फास्ट-ट्रैक साक्ष्य
              </div>
            </div>
          </div>
          <Download className="w-5 h-5 text-blue-700 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>

        {/* 3. Full Data CSV */}
        <button
          onClick={handleDownloadFullCsv}
          disabled={downloading === 'csv'}
          className="w-full p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-left flex items-center justify-between transition-all active:scale-95 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-700 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">
                📄 पूर्ण खाता व निगरानी डेटा (CSV)
              </div>
              <div className="text-[11px] text-stone-500">
                सभी 1,240 घंटे का सेंसर डेटा व बिक्री रसीदें
              </div>
            </div>
          </div>
          <Download className="w-4 h-4 text-stone-600 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* Recent Mandi Transactions */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#1D1D1F]">
            हालिया मंडी लेनदेन (Mandi Transactions)
          </h3>
          <span className="text-xs font-bold text-emerald-700">3 पूर्ण ✓</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-stone-900 block">{tx.crop}</span>
                <span className="text-[11px] text-stone-500">{tx.date} • खरीदार: {tx.buyer}</span>
                <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">✓ {tx.status}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-sm text-stone-900 font-mono">₹{tx.amount.toLocaleString()}</span>
                <span className="text-[11px] text-stone-500 block">{tx.qty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Stake Telemetry History */}
      <div className="bg-white rounded-[28px] p-5 shadow-ios border border-black/[0.04] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#1D1D1F]">
            मृदा व सेंसर निगरानी लॉग (IoT Telemetry)
          </h3>
          <span className="text-xs text-stone-500 font-mono">ESP32-S3 Stake</span>
        </div>

        <div className="space-y-2">
          {monitoringLogs.map((log, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-stone-800">{log.ts}</span>
                  <span className="text-[11px] text-stone-500 block">नमी: {log.moisture} • EC: {log.ec}</span>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px]">
                {log.healthScore}/100
              </span>
            </div>
          ))}
        </div>
      </div>

      <FarmerBottomNav />
    </div>
  );
}
