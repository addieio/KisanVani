// KisanVaani Comprehensive Indic Language System (Hindi, English, Punjabi, Marathi)
import { LanguageCode } from './types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  offlinePill: string;
  listen: string;
  speak: string;
  listening: string;
  greeting: string;
  healthRingTitle: string;
  soilHealth: string;
  navHome: string;
  navOrders: string;
  navHelp: string;
  navField: string;
  navPlan: string;
  card1Title: string;
  card1Sub: string;
  card2Title: string;
  card2Sub: string;
  card3Title: string;
  card3Sub: string;
  card4Title: string;
  card4Sub: string;
  // Field Telemetry
  moisture: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  phLevel: string;
  leafTemp: string;
  airTemp: string;
  pumpRelay: string;
  pumpOn: string;
  pumpOff: string;
  // Plan / Quotas
  quotaTitle: string;
  quotaSubtitle: string;
  exoticBlueprintTitle: string;
  exoticBlueprintSubtitle: string;
  variety: string;
  seedSource: string;
  expectedPrice: string;
  preorderMatch: string;
  // Sell & Grader
  sellTitle: string;
  takePhoto: string;
  speakQuantity: string;
  coinGraderTitle: string;
  coinGraderDesc: string;
  gradeACert: string;
  publishListing: string;
  // Order & Payout
  newOrderAlert: string;
  acceptOrder: string;
  rejectOrder: string;
  payoutConfirmed: string;
  handoverCode: string;
  handoverDesc: string;
  // Insurance
  insuranceTitle: string;
  insuranceSubtitle: string;
  claimButton: string;
  proofOfCare: string;
  fastTrackNotice: string;
  // Buyer Portal
  buyerPortalTitle: string;
  mandiDirectDesc: string;
  liveHarvestFeed: string;
  placeBid: string;
  buyNow: string;
  escrowStatus: string;
  smartLogistics: string;
  ring1: string;
  ring2: string;
  ring3: string;
  verifyHandover: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  hi: {
    appName: 'किसानवाणी',
    tagline: 'मिट्टी में वैज्ञानिक, जेब में दलाल',
    offlinePill: '● बिना इंटरनेट चालू (ऑफलाइन मोड)',
    listen: '🔊 सुनें',
    speak: 'बोलिए',
    listening: 'सुन रहे हैं... बोलिए...',
    greeting: 'नमस्ते, रामेश जी 🙏',
    healthRingTitle: 'खेत की कुल सेहत',
    soilHealth: 'खेत की सेहत',
    navHome: 'होम',
    navOrders: 'ऑर्डर',
    navHelp: 'मदद',
    navField: 'खेत सेंसर',
    navPlan: 'क्या बोएँ?',
    card1Title: 'मेरी फसल / क्या बोएँ?',
    card1Sub: 'कोटा जांचें एवं 10% सुरक्षित लाभ',
    card2Title: 'बीमारी जाँच / पत्ती फोटो',
    card2Sub: 'गुप्त सड़न व पत्ती बुखार की जांच',
    card3Title: 'मंडी भाव / ताज़ा दाम',
    card3Sub: 'सोनीपत व आजादपुर के सीधे भाव',
    card4Title: 'बेचें / फसल की फोटो डालें',
    card4Sub: '₹10 सिक्के से ग्रेडिंग एवं सीधी बिक्री',
    moisture: 'मिट्टी की नमी',
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटाश (K)',
    phLevel: 'मिट्टी का पीएच (pH)',
    leafTemp: 'पत्ती का तापमान (IR)',
    airTemp: 'हवा का तापमान',
    pumpRelay: '5HP मोटर रिले',
    pumpOn: 'चालू (ON)',
    pumpOff: 'बंद (सुरक्षा कट-ऑफ)',
    quotaTitle: 'क्षेत्रीय बुवाई कोटा एवं मंदी चेतावनी',
    quotaSubtitle: 'सोनीपत जिला - मांग के अनुसार सुरक्षित फसल चुनें',
    exoticBlueprintTitle: '10% एक्सोटिक माइक्रो-प्लॉट ब्लूप्रिंट',
    exoticBlueprintSubtitle: 'मंदी के खतरे से बचाव - गारंटीड अग्रिम खरीददार',
    variety: 'प्रमाणित किस्म',
    seedSource: 'सरकारी बीज केंद्र',
    expectedPrice: 'अपेक्षित न्यूनतम मूल्य',
    preorderMatch: 'जुड़ा हुआ खरीदार (प्री-ऑर्डर)',
    sellTitle: 'फसल बेचें एवं ग्रेडिंग करें',
    takePhoto: 'सिक्के के साथ फोटो खींचें',
    speakQuantity: 'मात्रा बोलिए (जैसे: 400 किलो)',
    coinGraderTitle: '₹10 सिक्का-आधारित AI ग्रेडर',
    coinGraderDesc: 'कैमरे के सामने ₹10 का सिक्का और टमाटर रखें',
    gradeACert: 'ग्रेड-A गुणवत्ता प्रमाण पत्र',
    publishListing: 'सीधा मंडी-डायरेक्ट पर बेचें',
    newOrderAlert: 'नया खरीददार ऑर्डर आया है!',
    acceptOrder: 'हाँ, मंज़ूर है 👍',
    rejectOrder: 'ना, मना करें ❌',
    payoutConfirmed: 'पैसा पक्का! खाते में सुरक्षित',
    handoverCode: '4-अंकों का हैंडओवर कोड',
    handoverDesc: 'गाड़ी चालक को यह कोड दिखाएं, पैसा तुरंत खाते में आएगा',
    insuranceTitle: 'संकट में? एक-क्लिक बीमा दावा',
    insuranceSubtitle: '90 दिनों का सेंसर डिजिटल रिकॉर्ड (केयर प्रमाण)',
    claimButton: 'बीमा दावा प्रस्तुत करें',
    proofOfCare: 'केयर प्रमाण डिजिटल रिपोर्ट (90 दिन सेंसर रिकॉर्ड)',
    fastTrackNotice: 'सेंसर प्रमाण के आधार पर 48 घंटे में सीधे खाते में स्वीकृति',
    buyerPortalTitle: 'मंडी-डायरेक्ट B2B खरीद पोर्टल',
    mandiDirectDesc: 'रेस्टोरेंट व डार्क स्टोर हेतु प्रमाणित ग्रेड-A उपज',
    liveHarvestFeed: 'ताज़ा ग्रेड-A फसलें',
    placeBid: 'बोली लगाएँ',
    buyNow: 'तुरंत खरीदें (Buy-Now)',
    escrowStatus: 'एस्क्रो स्थिति',
    smartLogistics: '3-रिंग स्मार्ट दूरी लॉजिस्टिक्स',
    ring1: 'रिंग 1 (<80 किमी) सीधी डिलीवरी',
    ring2: 'रिंग 2 (80-300 किमी) क्लस्टर साझा डिलीवरी',
    ring3: 'रिंग 3 (>300 किमी) वापसी ट्रक 60% छूट',
    verifyHandover: 'हैंडओवर कोड सत्यापित करें',
  },
  en: {
    appName: 'KisanVaani',
    tagline: 'Agronomist in the soil, broker in the pocket',
    offlinePill: '● Working Offline (Zero Internet)',
    listen: '🔊 Listen',
    speak: 'Speak',
    listening: 'Listening... please speak...',
    greeting: 'Namaste, Ramesh Ji 🙏',
    healthRingTitle: 'Overall Farm Health',
    soilHealth: 'Soil Health',
    navHome: 'Home',
    navOrders: 'Orders',
    navHelp: 'Help',
    navField: 'Sensors',
    navPlan: 'What to Sow?',
    card1Title: 'My Crop / What to Sow?',
    card1Sub: 'Check District Quotas & 10% Blueprint',
    card2Title: 'Disease Check / Leaf Photo',
    card2Sub: 'Detect Root Rot & Leaf Fever',
    card3Title: 'Mandi Rates / Live Prices',
    card3Sub: 'Direct Sonipat & Azadpur Spot Prices',
    card4Title: 'Sell Produce / Add Photo',
    card4Sub: '₹10 Coin Grade & Direct Sale',
    moisture: 'Soil Moisture',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    phLevel: 'Soil pH',
    leafTemp: 'Leaf Temp (IR)',
    airTemp: 'Air Temp',
    pumpRelay: '5HP Pump Relay',
    pumpOn: 'ACTIVE (ON)',
    pumpOff: 'TRIPPED (SAFETY OFF)',
    quotaTitle: 'Regional Sowing Quota & Demand Balancer',
    quotaSubtitle: 'Sonipat District - Align sowing with buyer demand',
    exoticBlueprintTitle: '10% Exotic Micro-Plot Blueprint',
    exoticBlueprintSubtitle: 'Glut Protection - Guaranteed Pre-Order Match',
    variety: 'Certified Variety',
    seedSource: 'Govt Seed Hub',
    expectedPrice: 'Expected Floor Price',
    preorderMatch: 'Matched Buyer (Pre-Order)',
    sellTitle: 'Sell Produce & Grade Quality',
    takePhoto: 'Take Photo with ₹10 Coin',
    speakQuantity: 'Speak Quantity (e.g. 400 kg)',
    coinGraderTitle: '₹10 Coin AI Scale Grader',
    coinGraderDesc: 'Align a ₹10 coin (27mm) beside your produce',
    gradeACert: 'Grade-A Inspection Certificate',
    publishListing: 'Publish to Mandi-Direct',
    newOrderAlert: 'New Buyer Bid Received!',
    acceptOrder: 'Yes, Accept 👍',
    rejectOrder: 'Decline ❌',
    payoutConfirmed: 'Payment Secured in Escrow!',
    handoverCode: '4-Digit Handover Passcode',
    handoverDesc: 'Share with driver upon loading to release escrow funds',
    insuranceTitle: 'In Trouble? One-Tap Crop Insurance Claim',
    insuranceSubtitle: '90-day continuous sensor proof of care',
    claimButton: 'File Insurance Claim',
    proofOfCare: 'Proof of Care Sensor Audit (90 Days)',
    fastTrackNotice: 'Automated 48-hour approval fast-track via sensor telemetry',
    buyerPortalTitle: 'Mandi-Direct B2B Procurement',
    mandiDirectDesc: 'Farm-direct certified Grade-A produce for kitchens & retailers',
    liveHarvestFeed: 'Live Grade-A Harvest Feed',
    placeBid: 'Place Bid',
    buyNow: 'Buy Now',
    escrowStatus: 'Escrow State',
    smartLogistics: '3-Ring Smart Distance Logistics',
    ring1: 'Ring 1 (<80 km) Direct Farm-Gate Delivery',
    ring2: 'Ring 2 (80-300 km) Village Cluster Milk-Run',
    ring3: 'Ring 3 (>300 km) Empty Return-Leg 60% Discount',
    verifyHandover: 'Verify Handover Passcode',
  },
  pa: {
    appName: 'ਕਿਸਾਨਵਾਣੀ',
    tagline: 'ਮਿੱਟੀ ਵਿੱਚ ਵਿਗਿਆਨੀ, ਜੇਬ ਵਿੱਚ ਆੜ੍ਹਤੀਆ',
    offlinePill: '● ਬਿਨਾਂ ਇੰਟਰਨੈੱਟ ਚਾਲੂ (ਆਫ਼ਲਾਈਨ ਮੋਡ)',
    listen: '🔊 ਸੁਣੋ',
    speak: 'ਬੋਲੋ',
    listening: 'ਸੁਣ ਰਹੇ ਹਾਂ... ਬੋਲੋ ਜੀ...',
    greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਰਮੇਸ਼ ਜੀ 🙏',
    healthRingTitle: 'ਖੇਤ ਦੀ ਕੁੱਲ ਸਿਹਤ',
    soilHealth: 'ਖੇਤ ਦੀ ਸਿਹਤ',
    navHome: 'ਮੁੱਖ',
    navOrders: 'ਆਰਡਰ',
    navHelp: 'ਮਦਦ',
    navField: 'ਸੈਂਸਰ',
    navPlan: 'ਕੀ ਬੀਜੀਏ?',
    card1Title: 'ਮੇਰੀ ਫਸਲ / ਕੀ ਬੀਜੀਏ?',
    card1Sub: 'ਜ਼ਿਲ੍ਹਾ ਕੋਟਾ ਜਾਂਚੋ ਅਤੇ 10% ਸੁਰੱਖਿਅਤ ਮੁਨਾਫ਼ਾ',
    card2Title: 'ਬਿਮਾਰੀ ਜਾਂਚ / ਪੱਤੇ ਦੀ ਫੋਟੋ',
    card2Sub: 'ਜੜ੍ਹਾਂ ਦੀ ਗਲਣ ਅਤੇ ਪੱਤਾ ਬੁਖਾਰ ਜਾਂਚੋ',
    card3Title: 'ਮੰਡੀ ਭਾਅ / ਤਾਜ਼ਾ ਰੇਟ',
    card3Sub: 'ਸੋਨੀਪਤ ਅਤੇ ਆਜ਼ਾਦਪੁਰ ਮੰਡੀ ਦੇ ਸਿੱਧੇ ਭਾਅ',
    card4Title: 'ਵੇਚੋ / ਫਸਲ ਦੀ ਫੋਟੋ ਪਾਓ',
    card4Sub: '₹10 ਸਿੱਕੇ ਨਾਲ ਗ੍ਰੇਡਿੰਗ ਅਤੇ ਸਿੱਧੀ ਵਿਕਰੀ',
    moisture: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
    nitrogen: 'ਨਾਈਟ੍ਰੋਜਨ (N)',
    phosphorus: 'ਫਾਸਫੋਰਸ (P)',
    potassium: 'ਪੋਟਾਸ਼ (K)',
    phLevel: 'ਮਿੱਟੀ ਦਾ ਪੀ.ਐਚ (pH)',
    leafTemp: 'ਪੱਤੇ ਦਾ ਤਾਪਮਾਨ (IR)',
    airTemp: 'ਹਵਾ ਦਾ ਤਾਪਮਾਨ',
    pumpRelay: '5HP ਮੋਟਰ ਰਿਲੇਅ',
    pumpOn: 'ਚਾਲੂ (ON)',
    pumpOff: 'ਬੰਦ (ਸੁਰੱਖਿਆ ਕੱਟ-ਆਫ)',
    quotaTitle: 'ਖੇਤਰੀ ਬਿਜਾਈ ਕੋਟਾ ਅਤੇ ਮੰਦੀ ਚਿਤਾਵਨੀ',
    quotaSubtitle: 'ਸੋਨੀਪਤ ਜ਼ਿਲ੍ਹਾ - ਮੰਗ ਅਨੁਸਾਰ ਸੁਰੱਖਿਅਤ ਫਸਲ ਚੁਣੋ',
    exoticBlueprintTitle: '10% ਐਕਸੋਟਿਕ ਮਾਈਕ੍ਰੋ-ਪਲਾਟ ਬਲੂਪ੍ਰਿੰਟ',
    exoticBlueprintSubtitle: 'ਮੰਦੀ ਤੋਂ ਬਚਾਅ - ਗਾਰੰਟੀਸ਼ੁਦਾ ਖਰੀਦਦਾਰ',
    variety: 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਮ',
    seedSource: 'ਸਰਕਾਰੀ ਬੀਜ ਕੇਂਦਰ',
    expectedPrice: 'ਅਨੁਮਾਨਿਤ ਰੇਟ',
    preorderMatch: 'ਜੁੜਿਆ ਖਰੀਦਦਾਰ (ਪ੍ਰੀ-ਆਰਡਰ)',
    sellTitle: 'ਫਸਲ ਵੇਚੋ ਅਤੇ ਗ੍ਰੇਡਿੰਗ ਕਰੋ',
    takePhoto: 'ਸਿੱਕੇ ਨਾਲ ਫੋਟੋ ਖਿੱਚੋ',
    speakQuantity: 'ਮਾਤਰਾ ਬੋਲੋ (ਜਿਵੇਂ: 400 ਕਿਲੋ)',
    coinGraderTitle: '₹10 ਸਿੱਕਾ-ਆਧਾਰਿਤ AI ਗ੍ਰੇਡਰ',
    coinGraderDesc: 'ਕੈਮਰੇ ਅੱਗੇ ₹10 ਦਾ ਸਿੱਕਾ ਅਤੇ ਟਮਾਟਰ ਰੱਖੋ',
    gradeACert: 'ਗ੍ਰੇਡ-A ਗੁਣਵੱਤਾ ਸਰਟੀਫਿਕੇਟ',
    publishListing: 'ਸਿੱਧਾ ਮੰਡੀ-ਡਾਇਰੈਕਟ ਤੇ ਵੇਚੋ',
    newOrderAlert: 'ਨਵਾਂ ਖਰੀਦਦਾਰ ਆਰਡਰ ਆਇਆ ਹੈ!',
    acceptOrder: 'ਹਾਂ, ਮਨਜ਼ੂਰ ਹੈ 👍',
    rejectOrder: 'ਨਾ, ਰੱਦ ਕਰੋ ❌',
    payoutConfirmed: 'ਪੈਸਾ ਪੱਕਾ! ਖਾਤੇ ਵਿੱਚ ਸੁਰੱਖਿਅਤ',
    handoverCode: '4-ਅੰਕਾਂ ਦਾ ਹੈਂਡਓਵਰ ਕੋਡ',
    handoverDesc: 'ਡਰਾਈਵਰ ਨੂੰ ਇਹ ਕੋਡ ਦਿਖਾਓ, ਪੈਸਾ ਤੁਰੰਤ ਖਾਤੇ ਵਿੱਚ ਆਵੇਗਾ',
    insuranceTitle: 'ਮੁਸੀਬਤ ਵਿੱਚ? ਇੱਕ-ਕਲਿੱਕ ਬੀਮਾ ਦਾਅਵਾ',
    insuranceSubtitle: '90 ਦਿਨਾਂ ਦਾ ਸੈਂਸਰ ਡਿਜੀਟਲ ਰਿਕਾਰਡ (ਦੇਖਭਾਲ ਪ੍ਰਮਾਣ)',
    claimButton: 'ਬੀਮਾ ਦਾਅਵਾ ਪੇਸ਼ ਕਰੋ',
    proofOfCare: 'ਦੇਖਭਾਲ ਪ੍ਰਮਾਣ ਡਿਜੀਟਲ ਰਿਪੋਰਟ',
    fastTrackNotice: 'ਸੈਂਸਰ ਪ੍ਰਮਾਣ ਦੇ ਆਧਾਰ ਤੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਪ੍ਰਵਾਨਗੀ',
    buyerPortalTitle: 'ਮੰਡੀ-ਡਾਇਰੈਕਟ B2B ਖਰੀਦ ਪੋਰਟਲ',
    mandiDirectDesc: 'ਰੈਸਟੋਰੈਂਟ ਅਤੇ ਡਾਰਕ ਸਟੋਰਾਂ ਲਈ ਗ੍ਰੇਡ-A ਫਸਲ',
    liveHarvestFeed: 'ਤਾਜ਼ਾ ਗ੍ਰੇਡ-A ਫਸਲਾਂ',
    placeBid: 'ਬੋਲੀ ਲਗਾਓ',
    buyNow: 'ਤੁਰੰਤ ਖਰੀਦੋ',
    escrowStatus: 'ਐਸਕਰੋ ਸਥਿਤੀ',
    smartLogistics: '3-ਰਿੰਗ ਸਮਾਰਟ ਦੂਰੀ ਲੌਜਿਸਟਿਕਸ',
    ring1: 'ਰਿੰਗ 1 (<80 ਕਿਮੀ) ਸਿੱਧੀ ਡਿਲੀਵਰੀ',
    ring2: 'ਰਿੰਗ 2 (80-300 ਕਿਮੀ) ਸਾਂਝੀ ਡਿਲੀਵਰੀ',
    ring3: 'ਰਿੰਗ 3 (>300 ਕਿਮੀ) ਵਾਪਸੀ ਟਰੱਕ 60% ਛੋਟ',
    verifyHandover: 'ਹੈਂਡਓਵਰ ਕੋਡ ਜਾਂਚੋ',
  },
  mr: {
    appName: 'किसानवाणी',
    tagline: 'मातीत कृषी शास्त्रज्ञ, खिशात दलाल',
    offlinePill: '● इंटरनेटशिवाय चालू (ऑफलाइन मोड)',
    listen: '🔊 ऐका',
    speak: 'बोला',
    listening: 'ऐकत आहे... बोला...',
    greeting: 'नमस्कार, रमेश जी 🙏',
    healthRingTitle: 'शेताचे एकूण आरोग्य',
    soilHealth: 'शेताचे आरोग्य',
    navHome: 'मुख्य',
    navOrders: 'ऑर्डर्स',
    navHelp: 'मदत',
    navField: 'सेंसर',
    navPlan: 'काय पेरावे?',
    card1Title: 'माझे पीक / काय पेरावे?',
    card1Sub: 'जिल्हा कोटा तपासा व १०% सुरक्षित नफा',
    card2Title: 'रोग तपासणी / पानाचा फोटो',
    card2Sub: 'गुप्त कूज व पानांचा ताप तपासा',
    card3Title: 'बाजार भाव / ताजे दर',
    card3Sub: 'सोनीपत व आझादपूरचे थेट दर',
    card4Title: 'विक्री करा / पिकाचा फोटो टाका',
    card4Sub: '₹१० नाण्याने प्रतवारी व थेट विक्री',
    moisture: 'मातीतील ओलावा',
    nitrogen: 'नायट्रोजन (N)',
    phosphorus: 'फॉस्फरस (P)',
    potassium: 'पोटॅश (K)',
    phLevel: 'मातीचा सामू (pH)',
    leafTemp: 'पानांचे तापमान (IR)',
    airTemp: 'हवेचे तापमान',
    pumpRelay: '5HP मोटर रिले',
    pumpOn: 'चालू (ON)',
    pumpOff: 'बंद (सुरक्षा कट-ऑफ)',
    quotaTitle: 'प्रादेशिक पेरणी कोटा व मंदी पूर्वसूचना',
    quotaSubtitle: 'सोनीपत जिल्हा - मागणीनुसार सुरक्षित पीक निवडा',
    exoticBlueprintTitle: '१०% एक्झोटिक मायक्रो-प्लॉट ब्लूप्रिंट',
    exoticBlueprintSubtitle: 'दर घसरणीपासून संरक्षण - हमी खरेदीदार',
    variety: 'प्रमाणित जात',
    seedSource: 'शासकीय बी-बियाणे केंद्र',
    expectedPrice: 'अपेक्षित हमीभाव',
    preorderMatch: 'थेट खरेदीदार (प्री-ऑर्डर)',
    sellTitle: 'पीक विका व प्रतवारी करा',
    takePhoto: 'नाण्यासोबत फोटो काढा',
    speakQuantity: 'प्रमाण सांगा (उदा: ४०० किलो)',
    coinGraderTitle: '₹१० नाणे-आधारित AI ग्रेडर',
    coinGraderDesc: 'कॅमेऱ्यासमोर ₹१० चे नाणे व टोमॅटो ठेवा',
    gradeACert: 'ग्रेड-A गुणवत्ता प्रमाणपत्र',
    publishListing: 'थेट मंडी-डायरेक्टवर विका',
    newOrderAlert: 'नवीन खरेदीदार ऑर्डर आली आहे!',
    acceptOrder: 'होय, मान्य आहे 👍',
    rejectOrder: 'नाही, नकार द्या ❌',
    payoutConfirmed: 'पैसे खात्रीशीर! खात्यात जमा',
    handoverCode: '४-अंकी हँडओव्हर कोड',
    handoverDesc: 'गाडी चालकाला हा कोड दाखवा, पैसे लगेच खात्यात येतील',
    insuranceTitle: 'संकटात आहात? एक-क्लिक पीक विमा दावा',
    insuranceSubtitle: '९० दिवसांचा डिजिटल सेन्सर पुरावा (काळजी पुरावा)',
    claimButton: 'विमा दावा दाखल करा',
    proofOfCare: 'काळजी पुरावा डिजिटल अहवाल',
    fastTrackNotice: 'सेन्सर पुराव्यावरून ४८ तासांत खात्यात थेट मंजुरी',
    buyerPortalTitle: 'मंडी-डायरेक्ट B2B खरेदी पोर्टल',
    mandiDirectDesc: 'रेस्टॉरंट व डार्क स्टोअर्ससाठी प्रमाणित ग्रेड-A शेतीमाल',
    liveHarvestFeed: 'ताजा ग्रेड-A शेतीमाल',
    placeBid: 'बोली लावा',
    buyNow: 'लगेच खरेदी करा',
    escrowStatus: 'एस्क्रो स्थिती',
    smartLogistics: '३-रिंग स्मार्ट अंतर वाहतूक',
    ring1: 'रिंग १ (<८० किमी) थेट डिलिव्हरी',
    ring2: 'रिंग २ (८०-३०० किमी) एकत्रित वाहतूक',
    ring3: 'रिंग ३ (>३०० किमी) परतीचे ट्रक ६०% सवलत',
    verifyHandover: 'हँडओव्हर कोड पडताळा',
  },
  ta: {
    appName: 'கிசான்வாணி',
    tagline: 'மண்ணில் விஞ்ஞானி, பையில் தரகர்',
    offlinePill: '● இணையம் இன்றி இயங்குகிறது (ஆஃப்லைன்)',
    listen: '🔊 கேளுங்கள்',
    speak: 'பேசுங்கள்',
    listening: 'கேட்கிறோம்... பேசுங்கள்...',
    greeting: 'வணக்கம், ரமேஷ் அவர்களே 🙏',
    healthRingTitle: 'வயலின் ஒட்டுமொத்த நலம்',
    soilHealth: 'மண் நலம்',
    navHome: 'முகப்பு',
    navOrders: 'ஆர்டர்கள்',
    navHelp: 'உதவி',
    navField: 'சென்சார்',
    navPlan: 'என்ன பயிரிடுவது?',
    card1Title: 'பயிர் திட்டம் / என்ன பயிரிடுவது?',
    card1Sub: 'மண்டி ஒதுக்கீடு & 10% உறுதி லாபம்',
    card2Title: 'நோய் பரிசோதனை / இலை புகைப்படம்',
    card2Sub: 'மறைந்த வேர் அழுகல் & இலை காய்ச்சல் கண்டறிதல்',
    card3Title: 'சந்தை விலை / நேரடி நிலவரம்',
    card3Sub: 'நேரடி சந்தை விலை & தரவரிசை',
    card4Title: 'விற்பனை / விளைச்சல் பதிவு',
    card4Sub: '₹10 நாணயம் தரவரிசை & நேரடி விற்பனை',
    moisture: 'மண் ஈரப்பதம்',
    nitrogen: 'நைட்ரஜன் (N)',
    phosphorus: 'பாஸ்பரஸ் (P)',
    potassium: 'பொட்டாசியம் (K)',
    phLevel: 'மண் காரத்தன்மை (pH)',
    leafTemp: 'இலை வெப்பநிலை (IR)',
    airTemp: 'காற்று வெப்பநிலை',
    pumpRelay: '5HP மோட்டார் சுவிட்ச்',
    pumpOn: 'இயங்குகிறது (ON)',
    pumpOff: 'நிறுத்தப்பட்டது (பாதுகாப்பு)',
    quotaTitle: 'பகுதி பயிர் ஒதுக்கீடு & விலை வீழ்ச்சி தடுப்பு',
    quotaSubtitle: 'அதிக உற்பத்தி நஷ்டத்தைத் தவிர்க்க பாதுகாப்பான பயிரை தேர்வு செய்க',
    exoticBlueprintTitle: '10% உயர் மதிப்பு சிறப்பு பயிர் மாதிரி',
    exoticBlueprintSubtitle: 'விலை வீழ்ச்சி பாதுகாப்பு - ஒப்பந்த வாங்குபவர்',
    variety: 'சான்றளிக்கப்பட்ட ரகம்',
    seedSource: 'அரசு விதை மையம்',
    expectedPrice: 'எதிர்பார்க்கும் விலை',
    preorderMatch: 'முன்பதிவு ஒப்பந்தம் (பிரெஷ்பைட்)',
    sellTitle: 'விளைச்சல் விற்பனை & நாணய தரம்',
    takePhoto: '₹10 நாணயத்துடன் புகைப்படம் எடுங்கள்',
    speakQuantity: 'எடையைக் கூறுங்கள் (எ.கா: 400 கிலோ)',
    coinGraderTitle: '₹10 நாணய AI தரவரிசை முறை',
    coinGraderDesc: 'கேமரா முன் ₹10 நாணயம் மற்றும் தக்காளியை வையுங்கள்',
    gradeACert: 'கிரேடு-A தர பாஸ்போர்ட்',
    publishListing: 'மண்டி-டைரக்டில் நேரடியாக விற்கவும்',
    newOrderAlert: 'புதிய வாங்குபவர் ஆர்டர் வந்துள்ளது!',
    acceptOrder: 'ஆம், ஏற்றுக்கொள்கிறேன் 👍',
    rejectOrder: 'இல்லை, நிராகரி ❌',
    payoutConfirmed: 'பணம் உறுதி! வங்கிக் கணக்கில் வரவு',
    handoverCode: '4-இலக்க ஒப்படைப்பு குறியீடு',
    handoverDesc: 'சரக்கு ஓட்டுனரிடம் இந்த குறியீட்டைக் காட்டுங்கள்',
    insuranceTitle: 'பிரச்சினையா? 1-கிளிக் பயிர் காப்பீட்டு கோரிக்கை',
    insuranceSubtitle: '90-நாள் டிஜிட்டல் சென்சார் தணிக்கை சான்றிதழ்',
    claimButton: 'காப்பீடு கோருங்கள்',
    proofOfCare: 'பராமரிப்பு சான்று டிஜிட்டல் அறிக்கை',
    fastTrackNotice: 'சென்சார் சான்றின் மூலம் 48 மணி நேரத்தில் ஒப்புதல்',
    buyerPortalTitle: 'மண்டி-டைரக்ட் B2B போர்டல்',
    mandiDirectDesc: 'உணவகங்களுக்கான சான்றளிக்கப்பட்ட கிரேடு-A விளைச்சல்',
    liveHarvestFeed: 'நேரடி கிரேடு-A விளைச்சல் பட்டியல்',
    placeBid: 'விலை கேட்க',
    buyNow: 'உடனே வாங்கவும்',
    escrowStatus: 'எஸ்க்ரோ நிலை',
    smartLogistics: '3-வளைய ஸ்மார்ட் சரக்கு போக்குவரத்து',
    ring1: 'வளையம் 1 (<80 கிமீ) நேரடி விநியோகம்',
    ring2: 'வளையம் 2 (80-300 கிமீ) ஒருங்கிணைந்த சரக்கு',
    ring3: 'வளையம் 3 (>300 கிமீ) திரும்பும் லாரி 60% தள்ளுபடி',
    verifyHandover: 'ஒப்படைப்பு குறியீட்டை சரிபார்க்கவும்',
  },
};

export function getTranslation(lang: LanguageCode): TranslationDictionary {
  return translations[lang] || translations.hi;
}
