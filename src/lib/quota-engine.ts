// KisanVaani Dynamic Regional Crop Quota Engine
import { SowingLock, ExoticBlueprint, LanguageCode, LocalizedMap } from './types';

export interface QuotaStatus {
  lock: SowingLock;
  percentage: number;
  status: 'GREEN' | 'AMBER' | 'RED';
  explanation: LocalizedMap;
  isLocked: boolean;
  exoticAlternative?: ExoticBlueprint;
}

export const EXOTIC_BLUEPRINT_BELL_PEPPER: ExoticBlueprint = {
  cropName: {
    hi: 'पीली व लाल शिमला मिर्च (Yellow & Red Bell Pepper)',
    en: 'Yellow & Red Bell Pepper (Dutch Variety)',
    pa: 'ਪੀਲੀ ਅਤੇ ਲਾਲ ਸ਼ਿਮਲਾ ਮਿਰਚ (ਡੱਚ ਵਰਾਇਟੀ)',
    mr: 'पिवळी व लाल ढोबळी मिरची (डच जात)',
  },
  variety: 'Syngenta Orobelle / Indra F1',
  certifiedSeedSource: 'IARI पूसा बीज केंद्र, नई दिल्ली (प्रमाणित बीज उपलब्ध)',
  expectedPricePerKg: 65,
  matchedBuyer: 'FreshBite Cloud Kitchens (500 किग्रा अग्रिम आर्डर पक्का)',
  demandAcres: 650, // open demand acres
  netMarginEstimate: '₹1,35,000 प्रति 0.25 एकड़ (साधारण टमाटर से 3.5 गुना अधिक लाभ)',
};

export const EXOTIC_BLUEPRINT_CHERRY_TOMATO: ExoticBlueprint = {
  cropName: {
    hi: 'चेरी टमाटर (Exotic Cherry Tomato)',
    en: 'Cluster Cherry Tomato',
    pa: 'ਚੈਰੀ ਟਮਾਟਰ (ਐਕਸੋਟਿਕ ਵਰਾਇਟੀ)',
    mr: 'चेरी टोमॅटो (विदेशी जात)',
  },
  variety: 'Rubi F1 Cluster',
  certifiedSeedSource: 'हरियाणा बीज निगम, करनाल केंद्र',
  expectedPricePerKg: 75,
  matchedBuyer: 'Hyperpure Dark Store (800 किग्रा अग्रिम खरीद)',
  demandAcres: 400,
  netMarginEstimate: '₹1,50,000 प्रति 0.25 एकड़',
};

/**
 * Calculates quota saturation for a given crop in a district.
 */
export function evaluateCropQuota(lock: SowingLock): QuotaStatus {
  const percentage = Math.round((lock.acres_locked / lock.demand_ceiling_acres) * 100);
  let status: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
  let isLocked = false;
  let exoticAlternative: ExoticBlueprint | undefined;

  if (percentage >= 100) {
    status = 'RED';
    isLocked = true;
    exoticAlternative = lock.crop.toLowerCase().includes('tomato') 
      ? EXOTIC_BLUEPRINT_BELL_PEPPER 
      : EXOTIC_BLUEPRINT_CHERRY_TOMATO;
  } else if (percentage >= 80) {
    status = 'AMBER';
  } else {
    status = 'GREEN';
  }

  const explanation: LocalizedMap = {
    hi: isLocked
      ? `${lock.district} में ${lock.crop} का कोटा 100% भर चुका है। मंडी में भारी मंदी का खतरा है। हमारे 10% एक्सोटिक विकल्प को अपनाएं।`
      : `${lock.district} में ${lock.crop} की बुवाई ${percentage}% हुई है। अभी बुवाई की जा सकती है।`,
    en: isLocked
      ? `${lock.crop} sowing ceiling reached 100% in ${lock.district}. High glut and crash risk. Pivot to our 10% Exotic Micro-Plot Blueprint.`
      : `${lock.crop} quota is at ${percentage}%. Sowing is permissible.`,
    pa: isLocked
      ? `${lock.district} ਵਿੱਚ ${lock.crop} ਦਾ ਕੋਟਾ 100% ਭਰ ਗਿਆ ਹੈ। ਮੰਦੀ ਦੇ ਖਤਰੇ ਕਾਰਨ 10% ਐਕਸੋਟਿਕ ਵਿਕਲਪ ਚੁਣੋ।`
      : `${lock.district} ਵਿੱਚ ${lock.crop} ਦਾ ਕੋਟਾ ${percentage}% ਹੈ। ਬਿਜਾਈ ਖੁੱਲ੍ਹੀ ਹੈ।`,
    mr: isLocked
      ? `${lock.district} मध्ये ${lock.crop} चा कोटा १००% भरला आहे. दर घसरण्याचा धोका असल्याने १०% एक्झोटिक पर्याय निवडा.`
      : `${lock.district} मध्ये ${lock.crop} ची पेरणी ${percentage}% झाली आहे. पेरणी खुली आहे.`,
    ta: isLocked
      ? `${lock.district}-ல் ${lock.crop} ஒதுக்கீடு 100% நிறைவடைந்தது. விலை வீழ்ச்சியைத் தவிர்க்க 10% உயர் மதிப்பு பயிரை தேர்வு செய்க.`
      : `${lock.district}-ல் ${lock.crop} பயிரிடல் ${percentage}%. பயிரிடலாம்.`,
  };

  return {
    lock,
    percentage,
    status,
    explanation,
    isLocked,
    exoticAlternative,
  };
}
