'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Download, 
  Filter, 
  Sparkles, 
  BarChart3, 
  ArrowUpRight, 
  Info, 
  Compass, 
  RefreshCw,
  Search,
  CheckCircle2,
  Wheat,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  X,
  Phone
} from 'lucide-react';

interface StateCropData {
  id: string;
  name: string;
  hindiName: string;
  region: 'North' | 'West' | 'South' | 'East' | 'Central';
  topCrop: string;
  topCropEmoji: string;
  sownAreaLakhHa: number;
  historicalAvgHa: number;
  quotaRatio: number; // e.g. 1.42 = 142% of normal (oversupply)
  glutRisk: 'critical' | 'warning' | 'normal' | 'deficit';
  riskMessage: string;
  farmersCount: number;
  recommendedAlternative: string;
  alternativeRoi: string;
  soilSuitability: string;
  priceExpectation: string;
  timeline: {
    month: string;
    stage: 'Sowing' | 'Growing' | 'Harvesting' | 'Peak Glut';
    volumeTonnes: number;
  }[];
}

const INDIA_STATES_DATA: StateCropData[] = [
  {
    id: 'up',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    region: 'North',
    topCrop: 'Potato (आलू)',
    topCropEmoji: '🥔',
    sownAreaLakhHa: 6.85,
    historicalAvgHa: 4.80,
    quotaRatio: 1.43,
    glutRisk: 'critical',
    riskMessage: 'आगरा व फर्रुखाबाद में 143% बंपर बुवाई! जनवरी-फरवरी में ₹6/kg का भारी भाव क्रैश संभावित।',
    farmersCount: 428000,
    recommendedAlternative: 'Dragon Fruit (कमलम) व बेबी कॉर्न',
    alternativeRoi: '₹180/kg (4.2x शुद्ध लाभ)',
    soilSuitability: 'रेतीली दोमट (pH 6.8, ड्रैगन फ्रूट हेतु 98% उत्तम)',
    priceExpectation: '₹6-8/kg (लागत से नीचे)',
    timeline: [
      { month: 'Oct', stage: 'Sowing', volumeTonnes: 45000 },
      { month: 'Nov', stage: 'Sowing', volumeTonnes: 120000 },
      { month: 'Dec', stage: 'Growing', volumeTonnes: 180000 },
      { month: 'Jan', stage: 'Harvesting', volumeTonnes: 420000 },
      { month: 'Feb', stage: 'Peak Glut', volumeTonnes: 580000 },
      { month: 'Mar', stage: 'Peak Glut', volumeTonnes: 390000 },
    ]
  },
  {
    id: 'haryana',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    region: 'North',
    topCrop: 'Potato (आलू) & Tomato',
    topCropEmoji: '🥔',
    sownAreaLakhHa: 1.15,
    historicalAvgHa: 0.82,
    quotaRatio: 1.40,
    glutRisk: 'critical',
    riskMessage: 'सोनीपत व करनाल क्लस्टर में 40+ किसान आलू बो रहे हैं। एनसीआर मंडी में आवक दबाव।',
    farmersCount: 94000,
    recommendedAlternative: 'Dragon Fruit व विदेशी शिमला मिर्च',
    alternativeRoi: '₹190/kg (4x लाभ + MIDH सब्सिडी)',
    soilSuitability: 'दोमट मिट्टी (pH 7.0, उत्तम जल निकास)',
    priceExpectation: '₹7-9/kg (अत्यधिक जोखिम)',
    timeline: [
      { month: 'Oct', stage: 'Sowing', volumeTonnes: 18000 },
      { month: 'Nov', stage: 'Sowing', volumeTonnes: 34000 },
      { month: 'Dec', stage: 'Growing', volumeTonnes: 48000 },
      { month: 'Jan', stage: 'Harvesting', volumeTonnes: 85000 },
      { month: 'Feb', stage: 'Peak Glut', volumeTonnes: 110000 },
      { month: 'Mar', stage: 'Harvesting', volumeTonnes: 60000 },
    ]
  },
  {
    id: 'punjab',
    name: 'Punjab',
    hindiName: 'पंजाब',
    region: 'North',
    topCrop: 'Seed Potato & Wheat',
    topCropEmoji: '🥔',
    sownAreaLakhHa: 1.25,
    historicalAvgHa: 0.98,
    quotaRatio: 1.28,
    glutRisk: 'warning',
    riskMessage: 'जालंधर बेल्ट में बीज आलू का सामान्य से 28% अधिक रकबा। निर्यात मांग निगरानी आवश्यक।',
    farmersCount: 112000,
    recommendedAlternative: 'ब्रोकोली व स्ट्रॉबेरी',
    alternativeRoi: '₹140/kg (3.5x लाभ)',
    soilSuitability: 'उपजाऊ जलोढ़ (pH 7.2)',
    priceExpectation: '₹11-13/kg (मध्यम दबाव)',
    timeline: [
      { month: 'Oct', stage: 'Sowing', volumeTonnes: 22000 },
      { month: 'Nov', stage: 'Sowing', volumeTonnes: 45000 },
      { month: 'Dec', stage: 'Growing', volumeTonnes: 52000 },
      { month: 'Jan', stage: 'Harvesting', volumeTonnes: 92000 },
      { month: 'Feb', stage: 'Harvesting', volumeTonnes: 105000 },
      { month: 'Mar', stage: 'Harvesting', volumeTonnes: 45000 },
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    region: 'West',
    topCrop: 'Onion (प्याज) & Tomato',
    topCropEmoji: '🧅',
    sownAreaLakhHa: 5.60,
    historicalAvgHa: 4.40,
    quotaRatio: 1.27,
    glutRisk: 'warning',
    riskMessage: 'नासिक व लासलगांव में प्याज व टमाटर की सघन बुवाई। अप्रैल-मई में भारी आवक संभव।',
    farmersCount: 650000,
    recommendedAlternative: 'ड्रैगन फ्रूट (कमलम) व अनार',
    alternativeRoi: '₹160-200/kg (मजबूत बाजार)',
    soilSuitability: 'काली मध्यम दोमट (pH 7.4)',
    priceExpectation: '₹12-14/kg (घटती प्रवृत्ति)',
    timeline: [
      { month: 'Oct', stage: 'Growing', volumeTonnes: 110000 },
      { month: 'Nov', stage: 'Growing', volumeTonnes: 140000 },
      { month: 'Dec', stage: 'Harvesting', volumeTonnes: 280000 },
      { month: 'Jan', stage: 'Harvesting', volumeTonnes: 390000 },
      { month: 'Feb', stage: 'Harvesting', volumeTonnes: 420000 },
      { month: 'Mar', stage: 'Peak Glut', volumeTonnes: 510000 },
    ]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    region: 'West',
    topCrop: 'Dragon Fruit (कमलम Model)',
    topCropEmoji: '🐉',
    sownAreaLakhHa: 0.42,
    historicalAvgHa: 0.15,
    quotaRatio: 0.70,
    glutRisk: 'deficit',
    riskMessage: 'कच्छ व सौराष्ट्र में ड्रैगन फ्रूट का राष्ट्रीय रोल मॉडल! उच्च मांग, शून्य भाव गिरावट।',
    farmersCount: 38000,
    recommendedAlternative: 'वर्तमान ड्रैगन फ्रूट विस्तार जारी रखें',
    alternativeRoi: '₹220/kg (अत्यधिक लाभदायक)',
    soilSuitability: 'शुष्क व कम पानी वाली मिट्टी (100% फिट)',
    priceExpectation: '₹180-240/kg (प्रीमियम भाव)',
    timeline: [
      { month: 'Oct', stage: 'Growing', volumeTonnes: 12000 },
      { month: 'Nov', stage: 'Growing', volumeTonnes: 15000 },
      { month: 'Dec', stage: 'Growing', volumeTonnes: 16000 },
      { month: 'Jan', stage: 'Growing', volumeTonnes: 18000 },
      { month: 'Feb', stage: 'Growing', volumeTonnes: 20000 },
      { month: 'Mar', stage: 'Harvesting', volumeTonnes: 32000 },
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    region: 'South',
    topCrop: 'Tomato & Exotic Vegetables',
    topCropEmoji: '🍅',
    sownAreaLakhHa: 2.10,
    historicalAvgHa: 1.85,
    quotaRatio: 1.13,
    glutRisk: 'normal',
    riskMessage: 'कोलार मंडी में संतुलित आवक। बेंगलुरू सुपरमार्केट मांग के कारण भाव स्थिर।',
    farmersCount: 280000,
    recommendedAlternative: 'रंग-बिरंगी शिमला मिर्च व जुकिनी',
    alternativeRoi: '₹90/kg (स्थिर भाव)',
    soilSuitability: 'लाल बलुई दोमट (pH 6.5)',
    priceExpectation: '₹22-26/kg (संतुलित)',
    timeline: [
      { month: 'Oct', stage: 'Harvesting', volumeTonnes: 75000 },
      { month: 'Nov', stage: 'Harvesting', volumeTonnes: 82000 },
      { month: 'Dec', stage: 'Sowing', volumeTonnes: 45000 },
      { month: 'Jan', stage: 'Growing', volumeTonnes: 60000 },
      { month: 'Feb', stage: 'Harvesting', volumeTonnes: 88000 },
      { month: 'Mar', stage: 'Harvesting', volumeTonnes: 95000 },
    ]
  },
  {
    id: 'mp',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    region: 'Central',
    topCrop: 'Wheat & Garlic (लहसुन)',
    topCropEmoji: '🌾',
    sownAreaLakhHa: 8.90,
    historicalAvgHa: 8.50,
    quotaRatio: 1.05,
    glutRisk: 'normal',
    riskMessage: 'मालवा व चंबल में गेहूं व लहसुन का आदर्श संतुलन। एमएसपी खरीद केंद्र तैयार।',
    farmersCount: 890000,
    recommendedAlternative: 'मल्टी-फ्लोरा सरसों व औषधीय पौधे',
    alternativeRoi: '₹85/kg (सुरक्षित आय)',
    soilSuitability: 'काली गहरी मिट्टी (pH 7.6)',
    priceExpectation: '₹2,425/क्विंटल (MSP संरक्षित)',
    timeline: [
      { month: 'Oct', stage: 'Sowing', volumeTonnes: 120000 },
      { month: 'Nov', stage: 'Sowing', volumeTonnes: 380000 },
      { month: 'Dec', stage: 'Growing', volumeTonnes: 490000 },
      { month: 'Jan', stage: 'Growing', volumeTonnes: 510000 },
      { month: 'Feb', stage: 'Harvesting', volumeTonnes: 620000 },
      { month: 'Mar', stage: 'Harvesting', volumeTonnes: 940000 },
    ]
  },
  {
    id: 'wb',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    region: 'East',
    topCrop: 'Potato (आलू - Jyoti)',
    topCropEmoji: '🥔',
    sownAreaLakhHa: 4.80,
    historicalAvgHa: 3.60,
    quotaRatio: 1.33,
    glutRisk: 'critical',
    riskMessage: 'हुगली व बर्धमान में 133% आलू बुवाई। कोल्ड स्टोरेज क्षमता से 20% अधिक उत्पादन का अंदेशा।',
    farmersCount: 520000,
    recommendedAlternative: 'मशरूम व ड्रेगन फ्रूट बागवानी',
    alternativeRoi: '₹170/kg (3.8x लाभ)',
    soilSuitability: 'जलोढ़ दोमट (pH 6.6)',
    priceExpectation: '₹5-7/kg (गंभीर घाटा खतरा)',
    timeline: [
      { month: 'Oct', stage: 'Sowing', volumeTonnes: 30000 },
      { month: 'Nov', stage: 'Sowing', volumeTonnes: 95000 },
      { month: 'Dec', stage: 'Growing', volumeTonnes: 140000 },
      { month: 'Jan', stage: 'Harvesting', volumeTonnes: 310000 },
      { month: 'Feb', stage: 'Peak Glut', volumeTonnes: 490000 },
      { month: 'Mar', stage: 'Peak Glut', volumeTonnes: 380000 },
    ]
  },
];

const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'] as const;

export default function GovtHeatmapPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('Oct');
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [activeState, setActiveState] = useState<StateCropData>(INDIA_STATES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDragonGuideModal, setShowDragonGuideModal] = useState<boolean>(false);
  const [guideModalTab, setGuideModalTab] = useState<'guide' | 'suppliers'>('guide');

  // Filtered states based on selections
  const filteredStates = useMemo(() => {
    return INDIA_STATES_DATA.filter((st) => {
      // Crop filter
      if (selectedCropFilter !== 'all') {
        if (!st.topCrop.toLowerCase().includes(selectedCropFilter.toLowerCase())) {
          return false;
        }
      }
      // Risk filter
      if (selectedRiskFilter !== 'all' && st.glutRisk !== selectedRiskFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return st.name.toLowerCase().includes(q) || st.hindiName.includes(q) || st.topCrop.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCropFilter, selectedRiskFilter, searchQuery]);

  // Aggregate stats
  const criticalGlutCount = useMemo(() => {
    return INDIA_STATES_DATA.filter(s => s.glutRisk === 'critical').length;
  }, []);

  const totalMonitoredFarmers = useMemo(() => {
    return INDIA_STATES_DATA.reduce((acc, curr) => acc + curr.farmersCount, 0);
  }, []);

  const getRiskColor = (risk: StateCropData['glutRisk']) => {
    switch (risk) {
      case 'critical':
        return {
          bg: 'bg-rose-500',
          text: 'text-rose-700',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          pill: 'bg-rose-500 text-white',
          border: 'border-rose-400',
          label: 'गंभीर भाव क्रैश खतरा (Critical Glut)',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          pill: 'bg-amber-500 text-white',
          border: 'border-amber-400',
          label: 'मध्यम जोखिम (Oversupply Warning)',
        };
      case 'deficit':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          pill: 'bg-purple-600 text-white',
          border: 'border-purple-400',
          label: 'विदेशी फसल अवसर (Exotic Deficit / High ROI)',
        };
      case 'normal':
      default:
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          pill: 'bg-emerald-600 text-white',
          border: 'border-emerald-400',
          label: 'संतुलित बुवाई (Balanced MSP Stable)',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      {/* Top Govt Masthead */}
      <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                  कृषि एवं किसान कल्याण मंत्रालय • GOVT OF INDIA
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  LIVE DEMO RADAR
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                राष्ट्रीय फसल बुवाई व भाव क्रैश हीटमैप
                <span className="text-xs font-medium text-slate-400 hidden md:inline">
                  (National Anti-Glut Crop Intelligence Matrix)
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/farmer"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>← किसान PWA पर जाएं</span>
            </Link>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>नीतिगत रिपोर्ट (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Metric Barometers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Critical Glut Alert */}
          <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                गंभीर भाव क्रैश जोखिम (Glut Alerts)
              </span>
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-700">{criticalGlutCount} राज्य</span>
              <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                140%+ अधिक बुवाई
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-snug">
              आगरा, सोनीपत व हुगली में <strong>आलू की अत्यधिक बुवाई</strong>। किसानों को तुरंत ड्रैगन फ्रूट/विदेशी फसल की ओर मोड़ने की आवश्यकता।
            </p>
          </div>

          {/* Card 2: Monitored Farmers */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                सक्रिय पंजीकृत किसान (Telemetry)
              </span>
              <Compass className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {(totalMonitoredFarmers / 100000).toFixed(1)} लाख
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                8 राज्य सक्रिय
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-snug">
              किसानवाणी IoT खूंटे, वॉइस IVR और उपग्रह रडार से सत्यापित रबी फसल रकबा।
            </p>
          </div>

          {/* Card 3: Exotic Diversification */}
          <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                ड्रैगन फ्रूट / विदेशी फसल लक्ष्य
              </span>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-800">42,000 हे.</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                4x शुद्ध लाभ
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-snug">
              कच्छ मॉडल के तहत कम पानी वाली रेतीली दोमट मिट्टी में ड्रैगन फ्रूट विस्तार हेतु ₹1.2 लाख/एकड़ MIDH अनुदान।
            </p>
          </div>

          {/* Card 4: Farmer Income Saved */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                भाव गिरावट से अनुमानित बचत
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700">₹3,420 करोड़</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Cobweb संरक्षण
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-snug">
              अग्रिम कोटा लॉक और समय रहते वैकल्पिक फसल संस्तुतियों से किसानों का घाटा रोका गया।
            </p>
          </div>
        </div>

        {/* Interactive Month/Timeline Controller */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  समय चक्र व रबी माह चयन (Seasonal Timeline Slider)
                </h3>
                <span className="text-xs text-slate-500">
                  देखें कि कौन से महीने में किस राज्य की फसल मंडी में आएगी और कब भाव क्रैश होगा
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <span className="px-3 py-1 bg-white text-emerald-700 rounded-xl shadow-xs">
                रबी 2026-27 (चालू चक्र)
              </span>
              <span className="px-3 py-1 text-slate-500 hover:text-slate-900 cursor-pointer">
                जायद 2027
              </span>
              <span className="px-3 py-1 text-slate-500 hover:text-slate-900 cursor-pointer">
                खरीफ 2027
              </span>
            </div>
          </div>

          {/* Month Step Slider */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {MONTHS.map((m) => {
              const isSelected = selectedMonth === m;
              const isGlutMonth = m === 'Jan' || m === 'Feb';
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-lg scale-102 border-2 border-emerald-400'
                      : isGlutMonth
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{m}</span>
                  <span className="text-[11px] font-semibold mt-0.5">
                    {m === 'Oct' && 'बुवाई (Sowing)'}
                    {m === 'Nov' && 'विस्तार'}
                    {m === 'Dec' && 'विकास काल'}
                    {m === 'Jan' && '⚠️ आवक शुरू'}
                    {m === 'Feb' && '🚨 पीक क्रैश'}
                    {m === 'Mar' && 'कटाई अंत'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> फसल फिल्टर:
            </span>
            {[
              { id: 'all', label: 'समग्र फसलें' },
              { id: 'potato', label: '🥔 आलू (Potato)' },
              { id: 'onion', label: '🧅 प्याज (Onion)' },
              { id: 'tomato', label: '🍅 टमाटर (Tomato)' },
              { id: 'dragon', label: '🐉 ड्रैगन फ्रूट (Exotic)' },
              { id: 'wheat', label: '🌾 गेहूं (Wheat)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCropFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCropFilter === f.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">जोखिम:</span>
            {[
              { id: 'all', label: 'सभी' },
              { id: 'critical', label: '🔴 गंभीर' },
              { id: 'warning', label: '🟠 मध्यम' },
              { id: 'deficit', label: '🟣 विदेशी अवसर' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRiskFilter(r.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedRiskFilter === r.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Interactive Map + State Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual India State Heat Matrix (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  अखिल भारतीय बुवाई व क्लस्टर रडार
                </h3>
                <p className="text-xs text-slate-500">
                  किसी भी राज्य पर क्लिक करके वहां की बुवाई, भाव क्रैश जोखिम और संस्तुति देखें
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {filteredStates.length} राज्य प्रदर्शित
              </span>
            </div>

            {/* Visual Heatmap Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredStates.map((st) => {
                const colors = getRiskColor(st.glutRisk);
                const isSelected = activeState.id === st.id;
                const activeMonthData = st.timeline.find((t) => t.month === selectedMonth) || st.timeline[0];

                return (
                  <div
                    key={st.id}
                    onClick={() => setActiveState(st)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-md scale-[1.02]'
                        : `${colors.border} bg-white hover:bg-slate-50/80`
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-base text-slate-900">{st.name}</span>
                          <span className="text-xs text-slate-500">({st.hindiName})</span>
                        </div>
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mt-0.5">
                          <span>{st.topCropEmoji}</span>
                          <span>{st.topCrop}</span>
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${colors.badge}`}>
                        {st.glutRisk === 'critical' ? '🔴 140%+ ओवरसप्लाई' : st.glutRisk === 'warning' ? '🟠 125% बुवाई' : st.glutRisk === 'deficit' ? '🟣 विदेशी अवसर' : '🟢 संतुलित'}
                      </span>
                    </div>

                    {/* Progress Bar of Quota */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">रकबा: {st.sownAreaLakhHa} लाख हे.</span>
                        <span className={colors.text}>
                          {(st.quotaRatio * 100).toFixed(0)}% कोटा
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors.bg}`}
                          style={{ width: `${Math.min(100, st.quotaRatio * 70)}%` }}
                        />
                      </div>
                    </div>

                    {/* Month Snapshot */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {selectedMonth} चरण: <strong className="text-slate-800">{activeMonthData.stage}</strong>
                      </span>
                      <span className="font-bold text-slate-700">
                        {(activeMonthData.volumeTonnes / 1000).toFixed(0)}k MT आवक
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
              <span className="text-slate-500 uppercase tracking-wider text-[11px]">हीटमैप संकेत:</span>
              <div className="flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>130%+ भाव क्रैश खतरा</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>110-130% मध्यम आवक</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>80-110% संतुलित</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-700">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>उच्च-मूल्य विदेशी अवसर</span>
              </div>
            </div>
          </div>

          {/* Right Column: Deep-Dive Policy & Crop Detail (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Active Selected State Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500 shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                    विस्तृत राज्य विश्लेषण • State Intelligence
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    {activeState.name} ({activeState.hindiName})
                  </h2>
                  <span className="text-xs text-slate-500 font-semibold">
                    क्षेत्र: {activeState.region} India • पंजीकृत किसान: {activeState.farmersCount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {activeState.topCropEmoji}
                </div>
              </div>

              {/* Glut Risk Box */}
              <div className={`p-4 rounded-2xl border ${getRiskColor(activeState.glutRisk).badge} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {activeState.glutRisk === 'critical' ? 'गंभीर भाव क्रैश अलर्ट' : 'बाजार स्थिति'}
                  </span>
                  <span className="font-extrabold text-xs">
                    {(activeState.quotaRatio * 100).toFixed(0)}% कोटा
                  </span>
                </div>
                <p className="text-xs font-semibold leading-relaxed">
                  {activeState.riskMessage}
                </p>
                <div className="pt-1 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>अनुमानित मंडी भाव: <strong>{activeState.priceExpectation}</strong></span>
                  <span>5-वर्ष औसत: {activeState.historicalAvgHa} लाख हे.</span>
                </div>
              </div>

              {/* Recommended Exotic Crop Recommendation (Requested Feature) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-900 font-extrabold text-sm">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>AI अनुशंसित विकल्प: {activeState.recommendedAlternative}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 text-purple-800 text-[10px] font-black">
                    RECOMMENDED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">मिट्टी अनुकूलता:</span>
                    <span className="font-bold text-slate-800 text-[11px]">{activeState.soilSuitability}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 border border-purple-100">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">अनुमानित लाभ:</span>
                    <span className="font-bold text-emerald-700 text-xs">{activeState.alternativeRoi}</span>
                  </div>
                </div>

                <p className="text-[11px] text-purple-950/80 leading-snug">
                  💡 <strong>सरकारी नीतिगत निर्देश:</strong> किसानों को आलू के स्थान पर ड्रैगन फ्रूट (कमलम) लगाने हेतु राष्ट्रीय बागवानी मिशन (MIDH) से ₹1,20,000/एकड़ अनुदान व 65% पानी बचत ड्रिप सिंचाई पैकेज उपलब्ध कराएं।
                </p>

                <button
                  onClick={() => setShowDragonGuideModal(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>🌱 ड्रैगन फ्रूट संपूर्ण खेती गाइड व प्रमाणित नर्सरी डायरेक्टरी देखें</span>
                </button>
              </div>

              {/* Month-wise Production Projection Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  महीनेवार आवक व मंडी प्रभाव अनुमान:
                </span>
                <div className="grid grid-cols-6 gap-1 text-center">
                  {activeState.timeline.map((t) => (
                    <div
                      key={t.month}
                      className={`p-2 rounded-xl text-xs border ${
                        t.month === selectedMonth
                          ? 'bg-slate-900 text-white font-bold border-slate-900'
                          : t.stage === 'Peak Glut'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-100'
                      }`}
                    >
                      <div className="text-[10px]">{t.month}</div>
                      <div className="text-[11px] font-extrabold mt-0.5">
                        {(t.volumeTonnes / 1000).toFixed(0)}k
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">MT</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Action Directive for Govt Officers */}
              <button
                onClick={() => alert(`राज्य कृषि निदेशक (${activeState.name}) को नीतिगत एडवाइजरी जारी कर दी गई है। किसानों को ड्रैगन फ्रूट विविधीकरण प्रोत्साहन संदेश भेजा गया।`)}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeState.name} हेतु Anti-Glut विविधीकरण एडवाइजरी जारी करें</span>
              </button>

            </div>

            {/* Ministry Interventions Live Feed */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>सक्रिय सरकारी हस्तक्षेप (Live Policy Directives)</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🏛️</span>
                  <div>
                    <strong className="text-slate-900 block font-bold">आलू कोल्ड स्टोरेज अग्रिम कोटा</strong>
                    <span className="text-slate-600 text-[11px]">
                      आगरा व फर्रुखाबाद में 400 कोल्ड स्टोरेज को 80% क्षमता आरक्षित रखने का आदेश जारी।
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🐉</span>
                  <div>
                    <strong className="text-slate-900 block font-bold">कमलम (Dragon Fruit) प्रोत्साहन योजना</strong>
                    <span className="text-slate-600 text-[11px]">
                      सोनीपत व करनाल में आलू किसानों को ड्रैगन फ्रूट लगाने पर ₹1,20,000/एकड़ डीबीटी अनुदान।
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🚚</span>
                  <div>
                    <strong className="text-slate-900 block font-bold">टमाटर अंतर-राज्यीय माल ढुलाई 50% छूट</strong>
                    <span className="text-slate-600 text-[11px]">
                      नासिक से 3,000 मीट्रिक टन टमाटर पूर्वी राज्यों (बिहार, असम) भेजने हेतु किसान रेल फ्रेट सब्सिडी।
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Dragon Fruit Cultivation Guide & Certified Suppliers Modal */}
      {showDragonGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-emerald-50">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐉</span>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>कमलम (ड्रैगन फ्रूट) वैज्ञानिक खेती गाइड व सप्लायर नेटवर्क</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                      ICAR / MIDH APPROVED
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    20 वर्ष निरंतर पैदावार • ₹12L+ वार्षिक शुद्ध मुनाफा • 65% पानी की बचत • ₹1.2L सरकारी सब्सिडी
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDragonGuideModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Nav Tabs */}
            <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setGuideModalTab('guide')}
                className={`py-2 px-4 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                  guideModalTab === 'guide'
                    ? 'border-purple-600 text-purple-700 bg-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                🌱 संपूर्ण 6-चरण खेती तकनीक (Growing Blueprint)
              </button>
              <button
                onClick={() => setGuideModalTab('suppliers')}
                className={`py-2 px-4 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
                  guideModalTab === 'suppliers'
                    ? 'border-emerald-600 text-emerald-700 bg-white shadow-sm'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                📍 नजदीकी 4 प्रमाणित नर्सरी व सप्लायर (Verified Nurseries)
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {guideModalTab === 'guide' ? (
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">1</span>
                      <span>खंभा व ट्रेलिस प्रणाली (RCC Poles & Top Ring)</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      <li><strong>दूरी व घनत्व:</strong> 10 × 10 फीट की ग्रिड (प्रति एकड़ 450 से 500 आरसीसी खंभे)।</li>
                      <li><strong>खंभा माप:</strong> 7 फीट लंबा, 5×5 इंच चौकोर (2 फीट जमीन में कंक्रीट बेस, 5 फीट जमीन से ऊपर)।</li>
                      <li><strong>शीर्ष रिंग:</strong> खंभे के शीर्ष पर 2 फीट व्यास की कंक्रीट रिंग या रिसाइकिल रबर टायर लगाएं।</li>
                      <li><strong>पौध रोपाई:</strong> प्रत्येक खंभे के चारों कोनों पर 4 रूटेड कटिंग रोपें (प्रति एकड़ 1,800-2,000 पौधे)।</li>
                    </ul>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">2</span>
                      <span>ड्रिप सिंचाई समय-सारिणी (Drip Irrigation Schedule)</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      <li>कैक्टस कुल की फसल है: ज्यादा पानी से जड़ सड़न हो सकती है, जलभराव बिल्कुल न होने दें।</li>
                      <li><strong>गर्मियों में:</strong> प्रति खंभा 2 से 4 लीटर पानी हर 4-5 दिन में एक बार पर्याप्त है।</li>
                      <li><strong>सर्दियों में:</strong> 8 से 10 दिन में एक बार हल्की सिंचाई।</li>
                      <li><strong>पानी की बचत:</strong> धान या आलू की तुलना में 65% पानी की बचत होती है।</li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">3</span>
                      <span>खाद, उर्वरक व जैविक पोषण (Nutrient Management)</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      <li><strong>रोपाई पूर्व:</strong> 10-15 किग्रा सड़ी गोबर खाद (FYM) + 100g SSP + 50g पोटाश प्रति खंभा।</li>
                      <li><strong>मासिक पोषण:</strong> 200 लीटर जीवामृत ड्रिप द्वारा महीने में एक बार चलाएं।</li>
                      <li><strong>सूक्ष्म पोषक तत्व:</strong> फूल आने से पूर्व 00:52:34 व फल चमक हेतु 00:00:50 का छिड़काव करें।</li>
                    </ul>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1.5">
                      <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center">4</span>
                      <span>छंटाई व कैनोपी प्रबंधन (Training & Pruning)</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                      <li><strong>प्रथम वर्ष:</strong> मुख्य तने को खंभे से प्लास्टिक रस्सी से सहारा देकर ऊपर रिंग तक ले जाएं।</li>
                      <li><strong>शीर्ष कटाई:</strong> रिंग के स्तर पर मुख्य तने का सिरा काटें, जिससे 40-50 छतरीनुमा शाखाएं नीचे लटकें।</li>
                      <li><strong>शीतकालीन छंटाई:</strong> हर सर्दी (दिसंबर-जनवरी) में पुरानी व सूखी शाखाओं की हल्की छंटाई करें।</li>
                    </ul>
                  </div>

                  {/* Step 5 & 6 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
                      <div className="flex items-center gap-2 text-pink-900 font-bold text-sm mb-1.5">
                        <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs font-black flex items-center justify-center">5</span>
                        <span>फलन व तुड़ाई चक्र</span>
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                        <li>मई-जून में रात को बड़े सफेद सुगंधित फूल खिलते हैं।</li>
                        <li>फूल से फल पकने में केवल 30-35 दिन लगते हैं।</li>
                        <li>जुलाई से दिसंबर: 5 से 6 बार तुड़ाई (Flushes)।</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">6</span>
                        <span>पैदावार व आय का पक्का गणित</span>
                      </div>
                      <div className="text-xs text-slate-800 space-y-1">
                        <div>• पैदावार: 8-10 टन/एकड़ (दूसरे साल से)</div>
                        <div>• B2B मंडी भाव: ₹180-220/किग्रा</div>
                        <div>• वार्षिक सकल आय: ₹14.4 - 18.0 लाख/एकड़</div>
                        <div className="font-extrabold text-emerald-700 pt-1">
                          • शुद्ध वार्षिक लाभ: ₹12.0+ लाख/एकड़ (20 साल तक!)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Supplier 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">CCSHAU बागवानी अनुसंधान केंद्र नर्सरी</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ICAR & NHM प्रमाणित
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">उचानी फार्म, करनाल (18 किमी दूर) • 100% रूटेड फंगस-मुक्त कटिंग</p>
                      <div className="text-xs text-slate-700 flex gap-4 pt-1 font-semibold">
                        <span>किस्में: ताइवानी रेड जंबो व वियतनाम व्हाइट</span>
                        <span className="text-emerald-700 font-bold">दर: ₹65 / कटिंग</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium">✅ 50% MIDH सरकारी सब्सिडी बिलिंग अधिकृत</p>
                    </div>
                    <a
                      href="tel:+919416248920"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>कॉल करें (+91 94162 48920)</span>
                    </a>
                  </div>

                  {/* Supplier 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">एनसीआर कमलम फार्म व हाई-टेक नर्सरी</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                          प्रगतिशील किसान एक्सीलेंस
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">जीटी रोड, मुरथल, सोनीपत (8 किमी दूर) • ऑन-साइट ट्रेलिस सेटअप सहायता</p>
                      <div className="text-xs text-slate-700 flex gap-4 pt-1 font-semibold">
                        <span>किस्में: सी-रेड (C-Red - गहरे लाल गूदे वाली मीठी किस्म, 18° Brix)</span>
                        <span className="text-emerald-700 font-bold">दर: ₹75 / तैयार पौधा</span>
                      </div>
                      <p className="text-[11px] text-purple-700 font-medium">✅ मुफ्त ऑन-साइट फील्ड विजिट व 2 वर्ष की निशुल्क कृषि सलाह</p>
                    </div>
                    <a
                      href="tel:+919812455102"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>कॉल करें (+91 98124 55102)</span>
                    </a>
                  </div>

                  {/* Supplier 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">कृषि विज्ञान केंद्र (KVK) अनुसंधान फार्म</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          सरकारी अनुसंधान केंद्र
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">करनाल अनुसंधान क्षेत्र (24 किमी दूर) • पॉलीकार्बोनेट ग्रीनहाउस कटिंग</p>
                      <div className="text-xs text-slate-700 flex gap-4 pt-1 font-semibold">
                        <span>किस्में: हाइब्रिड रॉयल रेड व पिंक ड्रैगन कटिंग</span>
                        <span className="text-emerald-700 font-bold">दर: ₹60 / कटिंग</span>
                      </div>
                      <p className="text-[11px] text-blue-700 font-medium">✅ मिट्टी परीक्षण रिपोर्ट आधारित व्यक्तिगत पोषण शेड्यूल शामिल</p>
                    </div>
                    <a
                      href="tel:+919896012845"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>कॉल करें (+91 98960 12845)</span>
                    </a>
                  </div>

                  {/* Supplier 4 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">MHU महाराणा प्रताप बागवानी विश्वविद्यालय</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          राज्य बागवानी वि.वि.
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">अंजनथली परिसर, करनाल (30 किमी दूर) • टिश्यू कल्चर मदर प्लांट</p>
                      <div className="text-xs text-slate-700 flex gap-4 pt-1 font-semibold">
                        <span>किस्में: कमलम स्पेशल ग्राफ्टेड व टिश्यू कल्चर</span>
                        <span className="text-emerald-700 font-bold">दर: ₹70 / पौधा</span>
                      </div>
                      <p className="text-[11px] text-amber-700 font-medium">✅ हरियाणा सरकार ₹1,20,000/एकड़ MIDH अनुदान हेतु अधिकृत बिल</p>
                    </div>
                    <a
                      href="tel:+919876543210"
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>कॉल करें (+91 93557 75531)</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                🏛️ राष्ट्रीय बागवानी मिशन (MIDH) व किसानवाणी एंटी-ग्लूट विविधीकरण सहायता कार्यक्रम
              </span>
              <button
                onClick={() => setShowDragonGuideModal(false)}
                className="py-2 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
