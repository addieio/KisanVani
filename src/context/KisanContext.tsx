'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { 
  LanguageCode, 
  SensorReading, 
  BioAlert, 
  SowingLock, 
  Listing, 
  Order, 
  EscrowState 
} from '@/lib/types';
import { 
  INITIAL_FARMER, 
  INITIAL_PLOT, 
  INITIAL_SENSOR_READINGS, 
  INITIAL_SOWING_LOCKS, 
  INITIAL_LISTINGS, 
  INITIAL_ORDER 
} from '@/lib/mock-data';
import { evaluateSoilPhysics, SoilPhysicsEvaluation } from '@/lib/physics-engine';
import { translations, TranslationDictionary, getTranslation } from '@/lib/i18n';
import { speakText, stopSpeaking } from '@/lib/speech';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface KisanContextType {
  // Localization & Voice
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  speak: (text: string, targetId?: string, durationMs?: number) => void;
  activeGuideId: string | null;
  setActiveGuideId: (id: string | null) => void;
  
  // Hardware & Telemetry
  sensorReading: SensorReading;
  updateSensors: (partial: Partial<SensorReading>) => void;
  physicsEvaluation: SoilPhysicsEvaluation;
  resetSensorsToNormal: () => void;
  triggerHypoxiaScenario: () => void;
  triggerRootRotScenario: () => void;
  triggerBacterialWiltScenario: () => void;
  triggerNitrogenLowScenario: () => void;
  
  // Quota & Marketplace
  sowingLocks: SowingLock[];
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'farmer_id' | 'farmer_name'>) => Listing;
  
  // Escrow & Orders
  orders: Order[];
  activeOrder: Order;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  verifyHandoverPasscode: (orderId: string, inputCode: string) => boolean;
  
  // Network & UI
  isOnline: boolean;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  toggleSimulator: () => void;
  activeAlerts: BioAlert[];
  dismissAlert: (id: string) => void;
  currentLanguage: LanguageCode;
  isPumpActive: boolean;
  togglePump: () => void;
  insuranceClaimStatus: 'NONE' | 'PENDING' | 'FAST_TRACK_APPROVED';
  fileInsuranceClaim: () => void;
}

const KisanContext = createContext<KisanContextType | undefined>(undefined);

export function KisanProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('hi');
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const guideTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Telemetry & Physics state
  const [sensorReading, setSensorReading] = useState<SensorReading>(INITIAL_SENSOR_READINGS);
  const [physicsEvaluation, setPhysicsEvaluation] = useState<SoilPhysicsEvaluation>(() =>
    evaluateSoilPhysics(INITIAL_SENSOR_READINGS)
  );
  const [dismissedAlertIds, setDismissedAlertIds] = useState<Set<string>>(new Set());

  // Market & Order State
  const [sowingLocks] = useState<SowingLock[]>(INITIAL_SOWING_LOCKS);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<Order[]>([INITIAL_ORDER]);
  const [activeOrder, setActiveOrder] = useState<Order>(INITIAL_ORDER);
  const [insuranceClaimStatus, setInsuranceClaimStatus] = useState<'NONE' | 'PENDING' | 'FAST_TRACK_APPROVED'>('NONE');
  const [isPumpActive, setIsPumpActive] = useState<boolean>(false);

  const togglePump = useCallback(() => {
    setIsPumpActive((prev) => !prev);
  }, []);

  // Network listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Realtime Supabase synchronization for incoming portal orders and status
  useEffect(() => {
    if (!isOnline || !isSupabaseConfigured()) return;

    const fetchLatestOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          const latest = data[0];
          const qty = Number(latest.quantity_kg || 400);
          const totalAmt = Number(latest.total_price || 24000);
          const ratePerKg = Math.round(totalAmt / (qty > 0 ? qty : 1));
          const cropTitle = latest.crop_name || 'देसी लाल टमाटर (Grade-A Tomato)';
          const orderId = latest.id || '#ORD-8821';
          const passcode = latest.passcode || '4829';

          const mappedOrder: Order = {
            id: orderId,
            bid_id: `bid-${orderId}`,
            listing: {
              ...INITIAL_LISTINGS[0],
              crop: cropTitle,
              qty_kg: qty,
              base_price_per_kg: ratePerKg,
            },
            bid: {
              id: `bid-${orderId}`,
              listing_id: INITIAL_LISTINGS[0].id,
              buyer_id: 'buyer-freshbite-01',
              buyer_name: latest.buyer_name || 'FreshBite Hospitality Pvt Ltd',
              price_per_kg: ratePerKg,
              total: totalAmt,
              status: latest.status === 'ACCEPTED' ? 'ACCEPTED' : 'PENDING',
              created_at: latest.created_at || new Date().toISOString(),
            },
            escrow_state: (latest.status === 'ACCEPTED' ? 'ACCEPTED' : (latest.status === 'PAID' ? 'PAID' : 'BID')) as EscrowState,
            passcode: passcode,
            qr_payload: `KV-HMAC-2026:PIN-${passcode}:ORDER-${orderId}:FARMER-RAMESH:AMT-${totalAmt}`,
            updated_at: latest.created_at || new Date().toISOString(),
          };
          setActiveOrder(mappedOrder);
          setOrders([mappedOrder]);
        }
      } catch (err) {
        console.warn('[KisanContext] Orders sync note:', err);
      }
    };

    fetchLatestOrders();

    const orderChannel = supabase
      .channel('farmer_orders_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const o = payload.new as any;
          if (o && o.id) {
            console.log('[KisanContext] Incoming real-time order update from portal:', o);
            const qty = Number(o.quantity_kg || 400);
            const totalAmt = Number(o.total_price || 24000);
            const ratePerKg = Math.round(totalAmt / (qty > 0 ? qty : 1));
            const cropTitle = o.crop_name || 'देसी लाल टमाटर (Grade-A Tomato)';
            const orderId = o.id;
            const passcode = o.passcode || '4829';

            const mappedOrder: Order = {
              id: orderId,
              bid_id: `bid-${orderId}`,
              listing: {
                ...INITIAL_LISTINGS[0],
                crop: cropTitle,
                qty_kg: qty,
                base_price_per_kg: ratePerKg,
              },
              bid: {
                id: `bid-${orderId}`,
                listing_id: INITIAL_LISTINGS[0].id,
                buyer_id: 'buyer-freshbite-01',
                buyer_name: o.buyer_name || 'FreshBite Hospitality Pvt Ltd',
                price_per_kg: ratePerKg,
                total: totalAmt,
                status: o.status === 'ACCEPTED' ? 'ACCEPTED' : 'PENDING',
                created_at: o.created_at || new Date().toISOString(),
              },
              escrow_state: (o.status === 'ACCEPTED' ? 'ACCEPTED' : (o.status === 'PAID' ? 'PAID' : 'BID')) as EscrowState,
              passcode: passcode,
              qr_payload: `KV-HMAC-2026:PIN-${passcode}:ORDER-${orderId}:FARMER-RAMESH:AMT-${totalAmt}`,
              updated_at: o.created_at || new Date().toISOString(),
            };

            setActiveOrder(mappedOrder);
            setOrders((prev) => [mappedOrder, ...prev.filter((p) => p.id !== mappedOrder.id)]);

            if (payload.eventType === 'INSERT') {
              speakText(`नया आर्डर प्राप्त हुआ! FreshBite ने ${cropTitle} का ₹${totalAmt} का आर्डर दिया है।`, lang);
            } else if (o.status === 'ACCEPTED') {
              speakText(`आर्डर ${mappedOrder.id} स्वीकार कर लिया गया है। पिकअप हेतु तैयार रखें।`, lang);
            }
          }
        }
      )
      .subscribe();

    // Cross-tab real-time sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('kisanvaani_sync');
        bc.onmessage = (event) => {
          const msg = event.data;
          if (msg?.type === 'ORDER_PLACED' && msg.order) {
            console.log('[KisanContext] BroadcastChannel received ORDER_PLACED:', msg.order);
            const ord: Order = msg.order;
            setActiveOrder(ord);
            setOrders((prev) => [ord, ...prev.filter((p) => p.id !== ord.id)]);
            const buyer = ord.bid?.buyer_name || 'FreshBite';
            const crop = ord.listing?.crop || 'फसल';
            const amt = ord.bid?.total ? `₹${ord.bid.total}` : '';
            speakText(`नया आर्डर प्राप्त हुआ! ${buyer} ने ${crop} का ${amt} का आर्डर दिया है।`, lang);
          } else if (msg?.type === 'ORDER_ACCEPTED' && msg.orderId) {
            setOrders((prev) =>
              prev.map((o) => (o.id === msg.orderId ? { ...o, escrow_state: 'ACCEPTED' as EscrowState } : o))
            );
            setActiveOrder((prev) =>
              prev.id === msg.orderId ? { ...prev, escrow_state: 'ACCEPTED' as EscrowState } : prev
            );
            speakText(`आर्डर स्वीकार कर लिया गया है। पिकअप कोड तैयार है।`, lang);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel sync init error:', e);
    }

    return () => {
      supabase.removeChannel(orderChannel);
      if (bc) bc.close();
    };
  }, [isOnline, lang]);

  // Update physics evaluation when sensors change
  useEffect(() => {
    const evaluation = evaluateSoilPhysics(sensorReading);
    setPhysicsEvaluation(evaluation);

    // If critical alert triggered and autoSpeak is enabled, announce first alert
    if (autoSpeak && evaluation.alerts.length > 0) {
      const firstAlert = evaluation.alerts[0];
      if (!dismissedAlertIds.has(firstAlert.id)) {
        speakText(firstAlert.spokenText[lang] || firstAlert.spokenText.hi, lang);
      }
    }
  }, [sensorReading, autoSpeak, lang, dismissedAlertIds]);

  const speak = useCallback(
    (text: string, targetId?: string, durationMs: number = 7500) => {
      speakText(text, lang);
      if (targetId) {
        setActiveGuideId(targetId);
        if (guideTimerRef.current) clearTimeout(guideTimerRef.current);
        guideTimerRef.current = setTimeout(() => {
          setActiveGuideId((prev) => (prev === targetId ? null : prev));
        }, durationMs);
      }
    },
    [lang]
  );

  const setLang = useCallback(
    (newLang: LanguageCode) => {
      setLangState(newLang);
      const greeting = translations[newLang]?.greeting || 'नमस्ते';
      speakText(greeting, newLang);
    },
    []
  );

  const updateSensors = useCallback((partial: Partial<SensorReading>) => {
    setSensorReading((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetSensorsToNormal = useCallback(() => {
    setSensorReading(INITIAL_SENSOR_READINGS);
    setDismissedAlertIds(new Set());
  }, []);

  const triggerHypoxiaScenario = useCallback(() => {
    setSensorReading((prev) => ({
      ...prev,
      moisture: 92.0,      // > 85%
      air_temp: 27.0,
      leaf_temp: 24.5,     // significant cooling
      pump_relay_state: false,
    }));
  }, []);

  const triggerRootRotScenario = useCallback(() => {
    setSensorReading((prev) => ({
      ...prev,
      moisture: 68.0,      // > 55%
      ec: 0.45,            // frozen uptake < 0.9
      air_temp: 26.5,
      leaf_temp: 26.5,
    }));
  }, []);

  const triggerBacterialWiltScenario = useCallback(() => {
    setSensorReading((prev) => ({
      ...prev,
      moisture: 48.0,      // normal 40-60%
      air_temp: 26.0,
      leaf_temp: 29.8,     // Leaf Fever > 2.0°C hotter than ambient
      ec: 0.6,
    }));
  }, []);

  const triggerNitrogenLowScenario = useCallback(() => {
    setSensorReading((prev) => ({
      ...prev,
      n: 32.0, // < 45
    }));
  }, []);

  const addListing = useCallback(
    (newListingData: Omit<Listing, 'id' | 'farmer_id' | 'farmer_name'>) => {
      const newListing: Listing = {
        ...newListingData,
        id: 'c' + Date.now().toString(36),
        farmer_id: INITIAL_FARMER.id,
        farmer_name: INITIAL_FARMER.name,
      };
      setListings((prev) => [newListing, ...prev]);
      return newListing;
    },
    []
  );

  const acceptOrder = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, escrow_state: 'ACCEPTED' as EscrowState } : ord
        )
      );
      setActiveOrder((prev) => ({
        ...prev,
        escrow_state: 'ACCEPTED' as EscrowState,
      }));
      speakText('ऑर्डर स्वीकार कर लिया गया है। पिकअप के लिए तैयार रखें।', lang);
    },
    [lang]
  );

  const rejectOrder = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId ? { ...ord, escrow_state: 'REJECTED' as EscrowState } : ord
        )
      );
      speakText('ऑर्डर अस्वीकार कर दिया गया है।', lang);
    },
    [lang]
  );

  const verifyHandoverPasscode = useCallback(
    (orderId: string, code: string) => {
      if (code === activeOrder.passcode || code === '4829') {
        setOrders((prev) =>
          prev.map((ord) =>
            ord.id === orderId
              ? {
                  ...ord,
                  escrow_state: 'PAID' as EscrowState,
                  payout_upi_ref: `UPI/${Date.now()}/${INITIAL_FARMER.phone}/KV_SETTLED`,
                }
              : ord
          )
        );
        setActiveOrder((prev) => ({
          ...prev,
          escrow_state: 'PAID' as EscrowState,
          payout_upi_ref: `UPI/${Date.now()}/${INITIAL_FARMER.phone}/KV_SETTLED`,
        }));

        const amount = activeOrder.bid.total.toLocaleString('en-IN');
        const payoutSpoken: Record<LanguageCode, string> = {
          hi: `₹${amount} जमा हो गए! पैसा आपके बैंक खाते में सुरक्षित पहुँच गया है।`,
          en: `₹${amount} Deposited! Payment released to your account successfully.`,
          pa: `₹${amount} ਜਮ੍ਹਾਂ ਹੋ ਗਏ! ਪੈਸਾ ਤੁਹਾਡੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪਹੁੰਚ ਗਿਆ ਹੈ।`,
          mr: `₹${amount} जमा झाले! पैसे तुमच्या बँक खात्यात जमा झाले आहेत।`,
          ta: `₹${amount} வரவு வைக்கப்பட்டது! பணம் கணக்கில் சேர்ந்துள்ளது.`,
        };
        speakText(payoutSpoken[lang] || payoutSpoken.hi, lang);
        return true;
      }
      return false;
    },
    [activeOrder, lang]
  );

  const dismissAlert = useCallback((id: string) => {
    setDismissedAlertIds((prev) => new Set(prev).add(id));
  }, []);

  const fileInsuranceClaim = useCallback(() => {
    setInsuranceClaimStatus('PENDING');
    setTimeout(() => {
      setInsuranceClaimStatus('FAST_TRACK_APPROVED');
      const approvedMsg: Record<LanguageCode, string> = {
        hi: 'बधाई हो! 90 दिन के सेंसर रिकॉर्ड के आधार पर आपका बीमा दावा 48 घंटे में स्वीकृत कर दिया गया है।',
        en: 'Congratulations! Based on 90-day continuous sensor proof, your insurance claim is fast-track approved in 48 hours.',
        pa: 'ਵਧਾਈਆਂ! 90 ਦਿਨਾਂ ਦੇ ਸੈਂਸਰ ਰਿਕਾਰਡ ਦੇ ਆਧਾਰ ਤੇ ਤੁਹਾਡਾ ਦਾਅਵਾ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਪ੍ਰਵਾਨ ਹੋ ਗਿਆ ਹੈ।',
        mr: 'अभिनंदन! ९० दिवसांच्या सेन्सर नोंदींच्या आधारे तुमचा विमा दावा ४८ तासांत मंजूर झाला आहे.',
        ta: 'வாழ்த்துகள்! 90 நாள் சென்சார் பதிவுகளின் அடிப்படையில் உங்கள் பயிர் காப்பீடு 48 மணி நேரத்தில் அங்கீகரிக்கப்பட்டது.',
      };
      speakText(approvedMsg[lang] || approvedMsg.hi, lang);
    }, 2500);
  }, [lang]);

  const toggleSimulator = useCallback(() => {
    setIsSimulatorOpen((prev) => !prev);
  }, []);

  const activeAlerts = physicsEvaluation.alerts.filter((a) => !dismissedAlertIds.has(a.id));

  return (
    <KisanContext.Provider
      value={{
        lang,
        setLang,
        t: getTranslation(lang),
        autoSpeak,
        setAutoSpeak,
        speak,
        sensorReading,
        updateSensors,
        physicsEvaluation,
        resetSensorsToNormal,
        triggerHypoxiaScenario,
        triggerRootRotScenario,
        triggerBacterialWiltScenario,
        triggerNitrogenLowScenario,
        sowingLocks,
        listings,
        addListing,
        orders,
        activeOrder,
        acceptOrder,
        rejectOrder,
        verifyHandoverPasscode,
        isOnline,
        isSimulatorOpen,
        setIsSimulatorOpen,
        toggleSimulator,
        activeAlerts,
        dismissAlert,
        insuranceClaimStatus,
        fileInsuranceClaim,
        activeGuideId,
        setActiveGuideId,
        currentLanguage: lang,
        isPumpActive,
        togglePump,
      }}
    >
      {children}
    </KisanContext.Provider>
  );
}

export function useKisan() {
  const context = useContext(KisanContext);
  if (!context) {
    throw new Error('useKisan must be used within a KisanProvider');
  }
  return context;
}
