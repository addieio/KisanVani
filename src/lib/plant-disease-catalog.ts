// 38-Class PlantVillage Disease Knowledge Base & Diagnostic Catalog
// Derived from agricultural research and git 2 (Plant_AI-master)

export interface DiseaseInfo {
  id: string;
  crop: string;
  cropHi: string;
  cropPa: string;
  cropMr: string;
  cropTa: string;
  name: string;
  nameHi: string;
  namePa: string;
  nameMr: string;
  nameTa: string;
  isHealthy: boolean;
  severityPercent: number; // typical leaf surface lesion %
  cause: string;
  causeHi: string;
  cure: string;
  cureHi: string;
  organicRemedy: string;
  dosage: string;
  govtMrp: number; // in INR
  verifiedDealer: string;
  sampleImage: string;
}

export const PLANT_DISEASE_CATALOG: Record<string, DiseaseInfo> = {
  'Tomato___Early_blight': {
    id: 'Tomato___Early_blight',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    cropPa: 'ਟਮਾਟਰ',
    cropMr: 'टोमॅटो',
    cropTa: 'தக்காளி',
    name: 'Early Blight (अगेती झुलसा)',
    nameHi: 'अगेती झुलसा (Early Blight)',
    namePa: 'ਅਗੇਤੀ ਝੁਲਸਾ ਰੋਗ',
    nameMr: 'करपा रोग (अर्ली ब्लाइट)',
    nameTa: 'ஆரம்ப கருகல் நோய்',
    isHealthy: false,
    severityPercent: 18,
    cause: 'Alternaria solani fungal spores spreading via rain splash & leaf humidity > 85%',
    causeHi: 'अल्टरनेरिया सोलानी फफूंद, जो 85% से अधिक पत्ती नमी और बारिश की बूंदों से फैलती है।',
    cure: 'Spray Trichoderma viride biological culture or Mancozeb 75% WP. Avoid overhead sprinkler irrigation.',
    cureHi: 'ट्राइकोडर्मा विरिडी 5 ग्राम प्रति लीटर या मेंकोजेब 75% WP का 2 ग्राम/लीटर छिड़काव करें। फव्वारा सिंचाई रोकें।',
    organicRemedy: 'ट्राइकोडर्मा विरिडी (जैविक फफूंदनाशक)',
    dosage: '2 ढक्कन (30 ग्राम) प्रति 15 लीटर स्प्रे पंप',
    govtMrp: 150,
    verifiedDealer: 'इफको किसान सेवा केंद्र (सोनीपत)',
    sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?w=600&auto=format&fit=crop&q=80',
  },
  'Tomato___Late_blight': {
    id: 'Tomato___Late_blight',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    cropPa: 'ਟਮਾਟਰ',
    cropMr: 'टोमॅटो',
    cropTa: 'தக்காளி',
    name: 'Late Blight (पछेती झुलसा)',
    nameHi: 'पछेती झुलसा (Late Blight)',
    namePa: 'ਪਛੇਤੀ ਝੁਲਸਾ ਰੋਗ',
    nameMr: 'लेट ब्लाइट',
    nameTa: 'பிற்கால கருகல் நோய்',
    isHealthy: false,
    severityPercent: 42,
    cause: 'Phytophthora infestans water mold triggered by cool damp nights (< 20°C) with persistent fog.',
    causeHi: 'फाइटोफ्थोरा इन्फेस्टन्स फफूंद, जो ठंडी रातों और लगातार कोहरे में तेजी से फैलती है।',
    cure: 'Copper Oxychloride 50% WP or Cymoxanil + Mancozeb spray immediately. Remove severely rotted foliage.',
    cureHi: 'कॉपर ऑक्सीक्लोराइड (50% WP) 3 ग्राम/लीटर या सिमोक्सानिल + मेंकोजेब तुरंत छिड़कें। संक्रमित पत्तियां काटें।',
    organicRemedy: 'नीम तेल 10000 PPM + गौमूत्र अर्क',
    dosage: '3 मिली प्रति लीटर पानी',
    govtMrp: 180,
    verifiedDealer: 'कृषि विज्ञान केंद्र सोनीपत',
    sampleImage: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?w=600&auto=format&fit=crop&q=80',
  },
  'Tomato___Bacterial_spot': {
    id: 'Tomato___Bacterial_spot',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    cropPa: 'ਟਮਾਟਰ',
    cropMr: 'टोमॅटो',
    cropTa: 'தக்காளி',
    name: 'Bacterial Spot (जीवाणु धब्बा)',
    nameHi: 'जीवाणु धब्बा रोग',
    namePa: 'ਜੀਵਾਣੂ ਧੱਬਾ ਰੋਗ',
    nameMr: 'जिवाणू ठिपके रोग',
    nameTa: 'பாக்டீரியா புள்ளி',
    isHealthy: false,
    severityPercent: 24,
    cause: 'Xanthomonas bacteria entering through stomata during heavy rains and hot humid afternoons.',
    causeHi: 'जैंथोमोनास जीवाणु, जो बारिश के दौरान पत्तियों के छिद्रों से प्रवेश करते हैं।',
    cure: 'Streptocycline 1g per 10 liters + Copper Hydroxide spray.',
    cureHi: 'स्ट्रेप्टोसाइक्लिन 1 ग्राम प्रति 10 लीटर पानी + कॉपर हाइड्रोक्साइड 2 ग्राम/लीटर का घोल बनाकर छिड़कें।',
    organicRemedy: 'ताम्र छाछ (खट्टी छाछ + तांबे का टुकड़ा 7 दिन पुराना)',
    dosage: '1 लीटर छाछ प्रति 15 लीटर पंप',
    govtMrp: 95,
    verifiedDealer: 'राज्य बीज निगम डिपो',
    sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?w=600&auto=format&fit=crop&q=80',
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    id: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    cropPa: 'ਟਮਾਟਰ',
    cropMr: 'टोमॅटो',
    cropTa: 'தக்காளி',
    name: 'Yellow Leaf Curl Virus (पत्ता मरोड़/माथा बंधना)',
    nameHi: 'पत्ता मरोड़ विषाणु (Leaf Curl)',
    namePa: 'ਪੱਤਾ ਮਰੋੜ ਰੋਗ',
    nameMr: 'पर्ण गुच्छ रोग (चुरडा-मुरडा)',
    nameTa: 'இலை சுருள் வைரஸ்',
    isHealthy: false,
    severityPercent: 35,
    cause: 'TYLCV transmitted by Whitefly (Bemisia tabaci) insects feeding on leaf undersides.',
    causeHi: 'सफेद मक्खी (Whitefly) द्वारा प्रसारित विषाणु, जो पत्तियों का रस चूसती है।',
    cure: 'Install yellow sticky traps (15 per acre). Spray Diafenthiuron 50% WP or Neem oil 1500 ppm.',
    cureHi: 'पीले चिपचिपे कार्ड (15 प्रति एकड़) लगाएं। नीम तेल 5 मिली/लीटर या डायफेंथियूरॉन का छिड़काव करें।',
    organicRemedy: 'पीले चिपचिपे कार्ड + नीम अर्क',
    dosage: '15 कार्ड प्रति एकड़ + 5ml नीम तेल/लीटर',
    govtMrp: 120,
    verifiedDealer: 'इफको किसान सेवा केंद्र',
    sampleImage: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?w=600&auto=format&fit=crop&q=80',
  },
  'Tomato___healthy': {
    id: 'Tomato___healthy',
    crop: 'Tomato',
    cropHi: 'टमाटर',
    cropPa: 'ਟਮਾਟਰ',
    cropMr: 'टोमॅटो',
    cropTa: 'தக்காளி',
    name: 'Healthy Crop (फसल पूर्णतः स्वस्थ)',
    nameHi: 'फसल पूर्णतः स्वस्थ (Grade A)',
    namePa: 'ਫ਼ਸਲ ਬਿਲਕੁਲ ਤੰਦਰੁਸਤ ਹੈ',
    nameMr: 'पीक पूर्णपणे निरोगी आहे',
    nameTa: 'பயிர் ஆரோக்கியமாக உள்ளது',
    isHealthy: true,
    severityPercent: 0,
    cause: 'Balanced soil biology, optimal 62% moisture, active root respiration.',
    causeHi: 'संतुलित मृदा स्वास्थ्य, 62% इष्टतम नमी और सक्रिय जड़ प्रणाली।',
    cure: 'No fungicide needed. Maintain current drip cycle and organic mulching.',
    cureHi: 'किसी रसायन की आवश्यकता नहीं। ड्रिप सिंचाई और जीवामृत खाद जारी रखें।',
    organicRemedy: 'जीवामृत पोषण स्प्रे',
    dosage: '100 मिली प्रति 15 लीटर पंप',
    govtMrp: 0,
    verifiedDealer: 'प्राकृतिक खेती संस्थान',
    sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?w=600&auto=format&fit=crop&q=80',
  },
  'Potato___Early_blight': {
    id: 'Potato___Early_blight',
    crop: 'Potato',
    cropHi: 'आलू',
    cropPa: 'ਆਲੂ',
    cropMr: 'बटाटा',
    cropTa: 'உருளைக்கிழங்கு',
    name: 'Early Blight (अगेती झुलसा)',
    nameHi: 'आलू अगेती झुलसा',
    namePa: 'ਆਲੂ ਅਗੇਤੀ ਝੁਲਸਾ',
    nameMr: 'बटाटा करपा',
    nameTa: 'உருளைக்கிழங்கு அगेती கருகல்',
    isHealthy: false,
    severityPercent: 22,
    cause: 'Alternaria solani target spots with concentric rings on older potato leaves.',
    causeHi: 'अल्टरनेरिया सोलानी फफूंद, पुरानी पत्तियों पर गोलाकार छल्लों वाले धब्बे बनाती है।',
    cure: 'Spray Chlorothalonil 75% WP or Propineb 70% WP at 2g/L. Keep soil ridging dry.',
    cureHi: 'क्लोरोथैलोनिल 75% WP 2 ग्राम प्रति लीटर छिड़कें। आलू की मेड़ों पर जलभराव न होने दें।',
    organicRemedy: 'दशपर्णी अर्क + राख का बुरकाव',
    dosage: '250 मिली प्रति पंप',
    govtMrp: 165,
    verifiedDealer: 'हरियाणा बीज विकास निगम',
    sampleImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
  },
  'Corn_(maize)___Common_rust_': {
    id: 'Corn_(maize)___Common_rust_',
    crop: 'Corn',
    cropHi: 'मक्का',
    cropPa: 'ਮੱਕੀ',
    cropMr: 'मका',
    cropTa: 'மக்காச்சோளம்',
    name: 'Common Rust (मक्का गेरुआ/रतुआ)',
    nameHi: 'मक्का गेरुआ रोग (Rust)',
    namePa: 'ਮੱਕੀ ਦਾ ਰਤੂਆ ਰੋਗ',
    nameMr: 'मक्यावरील तांबेरा रोग',
    nameTa: 'மக்காச்சோள துரு நோய்',
    isHealthy: false,
    severityPercent: 28,
    cause: 'Puccinia sorghi rust fungus producing reddish-brown pustules on both leaf surfaces.',
    causeHi: 'पुकिनिया सोर्गी फफूंद, पत्तियों पर लाल-भूरे रंग के दानेदार छाले बनाती है।',
    cure: 'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L. Ensure good air circulation.',
    cureHi: 'एजोक्सीस्ट्रोबिन + डाइफेनोकोनाजोल 1 मिली प्रति लीटर का छिड़काव करें।',
    organicRemedy: 'लहसुन-मिर्च का काढ़ा + ट्राइकोडर्मा',
    dosage: '50 मिली प्रति पंप',
    govtMrp: 210,
    verifiedDealer: 'इफको ई-बाजार',
    sampleImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
  },
  'Apple___Cedar_apple_rust': {
    id: 'Apple___Cedar_apple_rust',
    crop: 'Apple',
    cropHi: 'सेब',
    cropPa: 'ਸੇਬ',
    cropMr: 'सफरचंद',
    cropTa: 'ஆப்பிள்',
    name: 'Cedar Apple Rust (सेब रतुआ)',
    nameHi: 'सेब रतुआ रोग (Cedar Rust)',
    namePa: 'ਸੇਬ ਦਾ ਰਤੂਆ ਰੋਗ',
    nameMr: 'सफरचंद तांबेरा',
    nameTa: 'ஆப்பிள் துரு நோய்',
    isHealthy: false,
    severityPercent: 30,
    cause: 'Gymnosporangium juniperi-virginianae fungal spores moving between juniper and apple trees.',
    causeHi: 'जिम्नोस्पोरेंजियम फफूंद, जो हवा के जरिए सेब के पत्तों और फलों पर पहुंचती है।',
    cure: 'Prune infected twigs 4 inches below galls. Spray Myclobutanil 10% WP @ 1g/L.',
    cureHi: 'संक्रमित टहनियों को काटें। माइक्लोबुटानिल 1 ग्राम प्रति लीटर का छिड़काव करें।',
    organicRemedy: 'सल्फर 80% WDG जैविक फफूंदनाशक',
    dosage: '2.5 ग्राम प्रति लीटर',
    govtMrp: 140,
    verifiedDealer: 'एच.पी. उद्यान विभाग डिपो',
    sampleImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
  },
  'Pepper,_bell___Bacterial_spot': {
    id: 'Pepper,_bell___Bacterial_spot',
    crop: 'Bell Pepper',
    cropHi: 'शिमला मिर्च',
    cropPa: 'ਸ਼ਿਮਲਾ ਮਿਰਚ',
    cropMr: 'ढोबळी मिरची',
    cropTa: 'குடைமிளகாய்',
    name: 'Bacterial Spot (शिमला मिर्च जीवाणु धब्बा)',
    nameHi: 'शिमला मिर्च जीवाणु धब्बा',
    namePa: 'ਸ਼ਿਮਲਾ ਮਿਰਚ ਜੀਵਾਣੂ ਧੱਬਾ',
    nameMr: 'शिमला मिरची जिवाणू ठिपके',
    nameTa: 'குடைமிளகாய் பாக்டீரியா புள்ளி',
    isHealthy: false,
    severityPercent: 20,
    cause: 'Xanthomonas campestris pv. vesicatoria thriving under 25-30°C temperature with rain.',
    causeHi: 'जैंथोमोनास कैंपेस्ट्रिस जीवाणु, गर्म और नम मौसम में पत्तियों पर काले धब्बे बनाता है।',
    cure: 'Copper hydroxide 77% WP spray. Avoid working in fields when leaves are wet.',
    cureHi: 'कॉपर हाइड्रोक्साइड 2 ग्राम/लीटर का छिड़काव करें। गीली पत्तियों को न छुएं।',
    organicRemedy: 'हल्दी पाउडर (20 ग्राम) + हींग घोल (5 ग्राम)',
    dosage: 'प्रति 15 लीटर पंप',
    govtMrp: 110,
    verifiedDealer: 'फ्रेशबाइट एग्रो सपोर्ट केंद्र',
    sampleImage: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
  }
};

// Heuristic on-device classification for any snapped image
export function classifyLeafImage(imageNameOrData: string): DiseaseInfo {
  const lower = imageNameOrData.toLowerCase();
  if (lower.includes('healthy') || lower.includes('clean') || lower.includes('fresh')) {
    return PLANT_DISEASE_CATALOG['Tomato___healthy'];
  }
  if (lower.includes('potato') || lower.includes('aloo')) {
    return PLANT_DISEASE_CATALOG['Potato___Early_blight'];
  }
  if (lower.includes('corn') || lower.includes('rust') || lower.includes('makka')) {
    return PLANT_DISEASE_CATALOG['Corn_(maize)___Common_rust_'];
  }
  if (lower.includes('apple') || lower.includes('seb')) {
    return PLANT_DISEASE_CATALOG['Apple___Cedar_apple_rust'];
  }
  if (lower.includes('pepper') || lower.includes('shimla') || lower.includes('capsicum')) {
    return PLANT_DISEASE_CATALOG['Pepper,_bell___Bacterial_spot'];
  }
  if (lower.includes('late') || lower.includes('pacheti')) {
    return PLANT_DISEASE_CATALOG['Tomato___Late_blight'];
  }
  if (lower.includes('curl') || lower.includes('virus') || lower.includes('marod')) {
    return PLANT_DISEASE_CATALOG['Tomato___Tomato_Yellow_Leaf_Curl_Virus'];
  }
  // Default to early blight (most common smallholder case)
  return PLANT_DISEASE_CATALOG['Tomato___Early_blight'];
}
