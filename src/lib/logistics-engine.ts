// KisanVaani 3-Ring Smart Distance Logistics Calculator
import { LanguageCode, LocalizedMap } from './types';

export interface LogisticsRingDetails {
  ring: 1 | 2 | 3;
  name: LocalizedMap;
  distanceRange: string;
  costPerKg: number;
  deliveryType: LocalizedMap;
  transitTimeHrs: number;
  savingsVsRegularPct: number;
  description: LocalizedMap;
}

export function computeLogisticsRing(distanceKm: number): LogisticsRingDetails {
  if (distanceKm < 80) {
    return {
      ring: 1,
      name: {
        hi: 'रिंग 1: सीधी फार्म-गेट डिलीवरी',
        en: 'Ring 1: Direct Farm-Gate Delivery',
        pa: 'ਰਿੰਗ 1: ਸਿੱਧੀ ਫਾਰਮ-ਗੇਟ ਡਿਲੀਵਰੀ',
        mr: 'रिंग १: थेट शेतातून डिलिव्हरी',
      },
      distanceRange: '< 80 km',
      costPerKg: 2.40,
      deliveryType: {
        hi: 'सीधी डिलीवरी (सिंगल वाहन)',
        en: 'Direct Farm-to-Kitchen',
        pa: 'ਸਿੱਧੀ ਡਿਲੀਵਰੀ',
        mr: 'थेट डिलिव्हरी',
      },
      transitTimeHrs: Math.max(1.5, Math.round(distanceKm / 35 * 10) / 10),
      savingsVsRegularPct: 15,
      description: {
        hi: '80 किमी से कम दूरी पर खेत से सीधे रेस्टोरेंट या डार्क स्टोर पर माल पहुँचता है। शून्य टूट-फूट।',
        en: 'Direct delivery under 80 km without transit hub transfers. Minimal produce bruising.',
        pa: '80 ਕਿਲੋਮੀਟਰ ਤੋਂ ਘੱਟ ਦੂਰੀ ਤੇ ਸਿੱਧਾ ਖੇਤ ਤੋਂ ਰਸੋਈ ਤੱਕ।',
        mr: '८० किमी पेक्षा कमी अंतरावर थेट शेतातून स्वयंपाकघरापर्यंत.',
      },
    };
  } else if (distanceKm <= 300) {
    return {
      ring: 2,
      name: {
        hi: 'रिंग 2: गांव क्लस्टर साझा डिलीवरी (मिल्क-रन)',
        en: 'Ring 2: Pooled Village Cluster Milk-Run',
        pa: 'ਰਿੰਗ 2: ਪਿੰਡ ਕਲੱਸਟਰ ਸਾਂਝੀ ਡਿਲੀਵਰੀ',
        mr: 'रिंग २: गाव क्लस्टर एकत्रित वाहतूक',
      },
      distanceRange: '80 - 300 km',
      costPerKg: 1.60,
      deliveryType: {
        hi: '1.5 टन क्लस्टर साझा ट्रक',
        en: '1.5-Ton Cluster Aggregation',
        pa: 'ਸਾਂਝਾ ਟਰੱਕ',
        mr: 'एकत्रित ट्रक वाहतूक',
      },
      transitTimeHrs: Math.round(distanceKm / 40 * 10) / 10,
      savingsVsRegularPct: 35,
      description: {
        hi: 'गांव के 4-6 किसानों का माल एक साथ 1.5 टन वाहन में लोड होता है। भाड़ा प्रति किलो घट जाता है।',
        en: 'Aggregated milk-run across 4-6 village farms. Freight cost shared per kilo.',
        pa: 'ਪਿੰਡ ਦੇ ਕਿਸਾਨਾਂ ਦਾ ਮਾਲ ਇੱਕਠਾ ਲੋਡ ਹੁੰਦਾ ਹੈ, ਖਰਚਾ ਘੱਟ ਪੈਂਦਾ ਹੈ।',
        mr: 'गावातील ४-६ शेतकऱ्यांचा माल एकत्र भरला जातो, वाहतूक खर्च कमी होतो.',
      },
    };
  } else {
    return {
      ring: 3,
      name: {
        hi: 'रिंग 3: वापसी खाली ट्रक (60% छूट)',
        en: 'Ring 3: Return-Leg Empty Truck (60% Discount)',
        pa: 'ਰਿੰਗ 3: ਵਾਪਸੀ ਖਾਲੀ ਟਰੱਕ (60% ਛੋਟ)',
        mr: 'रिंग ३: परतीचे रिकामे ट्रक (६०% सवलत)',
      },
      distanceRange: '> 300 km',
      costPerKg: 0.95,
      deliveryType: {
        hi: 'बैकहॉल लॉजिस्टिक्स (Backhaul)',
        en: 'Return-Leg Empty Match',
        pa: 'ਵਾਪਸੀ ਖਾਲੀ ਟਰੱਕ',
        mr: 'परतीचे ट्रक',
      },
      transitTimeHrs: Math.round(distanceKm / 45 * 10) / 10,
      savingsVsRegularPct: 60,
      description: {
        hi: 'महानगरों से सामान उतारकर खाली लौट रहे ट्रकों से माल भेजा जाता है। 60% तक भाड़े की बचत।',
        en: 'Utilizes returning empty long-haul trucks from metro terminals, saving up to 60% freight.',
        pa: 'ਖਾਲੀ ਮੁੜ ਰਹੇ ਟਰੱਕਾਂ ਰਾਹੀਂ 60% ਤੱਕ ਭਾੜੇ ਦੀ ਬੱਚਤ।',
        mr: 'शहरातून रिकाम्या परतणाऱ्या ट्रकमधून वाहतूक, ६०% पर्यंत बचत.',
      },
    };
  }
}
