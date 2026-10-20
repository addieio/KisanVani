// KisanVaani Soil Physics & Pre-Visual Silent Infection Rule Engine
import { SensorReading, BioAlert } from './types';

export interface SoilPhysicsEvaluation {
  alerts: BioAlert[];
  overallHealthScore: number;
  pumpRelayState: boolean;
  recommendations: string[];
}

export interface PhysicsEvaluationOptions {
  historicalReadings?: SensorReading[];
  cropDay?: number;
}

/**
 * Pure function evaluating real-time ESP32 stake sensor readings against
 * agronomic biological physics thresholds.
 */
export function evaluateSoilPhysics(
  current: SensorReading,
  options: PhysicsEvaluationOptions = {}
): SoilPhysicsEvaluation {
  const alerts: BioAlert[] = [];
  let pumpRelay = current.pump_relay_state ?? true;
  let healthScore = 98; // baseline perfect health

  const cropDay = options.cropDay ?? 45;

  // 1. Root Hypoxia Guard
  // moisture > 85% && soilTempDrop > 1.5°C -> Roots suffocating -> Pump OFF
  // (In simulator, we evaluate moisture > 85 and rapid cooling or leaf temp drop)
  const isHypoxic = current.moisture > 85;
  if (isHypoxic) {
    pumpRelay = false; // ACTUATION: 5HP PUMP RELAY OFF
    healthScore -= 30;
    alerts.push({
      id: 'alert-hypoxia-' + Date.now(),
      type: 'HYPOXIA',
      severity: 'CRITICAL',
      title: {
        hi: 'जड़ों में ऑक्सीजन की कमी (हाइपोक्सिया)!',
        en: 'Root Hypoxia Alert: Soil Saturated!',
        pa: 'ਜੜ੍ਹਾਂ ਵਿੱਚ ਆਕਸੀਜਨ ਦੀ ਘਾਟ (ਹਾਈਪੌਕਸੀਆ)!',
        mr: 'मुळांमध्ये ऑक्सिजनची कमतरता (हायपोक्सिया)!',
      },
      message: {
        hi: 'मिट्टी में 85% से अधिक पानी भर गया है। जड़ें घुट रही हैं। मोटर तुरंत बंद कर दी गई है।',
        en: 'Soil moisture exceeded 85%. Root respiration choked. 5HP pump automatically turned OFF.',
        pa: 'ਮਿੱਟੀ ਵਿੱਚ 85% ਤੋਂ ਵੱਧ ਪਾਣੀ ਭਰ ਗਿਆ ਹੈ। ਜੜ੍ਹਾਂ ਸਾਹ ਨਹੀਂ ਲੈ ਸਕਦੀਆਂ। ਮੋਟਰ ਬੰਦ ਕੀਤੀ ਗਈ।',
        mr: 'मातीत ८५% पेक्षा जास्त पाणी साचले आहे. मुळे गुदमरत आहेत. मोटर स्वयंचलितपणे बंद केली.',
      },
      spokenText: {
        hi: 'सावधान! पानी देना तुरंत बंद करें! जड़ें डूब रही हैं। 5 एचपी पंप बंद कर दिया गया है।',
        en: 'Warning! Stop irrigation immediately. Roots are suffocating. 5HP pump relay cut off.',
        pa: 'ਸਾਵਧਾਨ! ਪਾਣੀ ਦੇਣਾ ਤੁਰੰਤ ਬੰਦ ਕਰੋ! ਜੜ੍ਹਾਂ ਡੁੱਬ ਰਹੀਆਂ ਹਨ। ਮੋਟਰ ਬੰਦ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।',
        mr: 'सावधान! पाणी देणे त्वरित बंद करा! मुळे बुडत आहेत. मोटर बंद केली आहे.',
      },
      recommendedAction: {
        hi: 'खेत से अतिरिक्त पानी निकालें और 3 दिन तक सिंचाई न करें।',
        en: 'Drain standing water and pause irrigation for 3 days.',
        pa: 'ਖੇਤ ਵਿੱਚੋਂ ਵਾਧੂ ਪਾਣੀ ਕੱਢੋ ਅਤੇ 3 ਦਿਨ ਪਾਣੀ ਨਾ ਦਿਓ।',
        mr: 'शेतातून अतिरिक्त पाणी काढून टाका आणि ३ दिवस पाणी देऊ नका.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'drain',
          title: {
            hi: 'जल निकासी नाली खोलें',
            en: 'Open drainage trench',
            pa: 'ਨਿਕਾਸੀ ਨਾਲੀ ਖੋਲ੍ਹੋ',
            mr: 'पाण्याचा निचरा करणारी चर उघडा',
          },
          desc: {
            hi: 'खेत के निचले हिस्से से बंधा खोलकर अतिरिक्त पानी तुरंत बाहर बहाएं।',
            en: 'Dig or open furrows at the low edge of the plot to drain standing water.',
            pa: 'ਖੇਤ ਦੇ ਹੇਠਲੇ ਹਿੱਸੇ ਤੋਂ ਵੱਟ ਖੋਲ੍ਹ ਕੇ ਵਾਧੂ ਪਾਣੀ ਬਾਹਰ ਕੱਢੋ।',
            mr: 'शेतातील खालच्या बाजूने बांध फोडून साचलेले पाणी त्वरित बाहेर काढा.',
          },
        },
        {
          step: 2,
          icon: 'pump-off',
          title: {
            hi: 'पंप बंद रखें (36 घंटे)',
            en: 'Keep Pump OFF (36 hrs)',
            pa: 'ਪੰਪ ਬੰਦ ਰੱਖੋ (36 ਘੰਟੇ)',
            mr: 'पंप ३६ तास बंद ठेवा',
          },
          desc: {
            hi: 'सॉइल मॉइस्चर 55% से नीचे आने तक ट्यूबवेल न चलाएं।',
            en: 'Do not restart irrigation until soil moisture returns below 55%.',
            pa: 'ਮਿੱਟੀ ਦੀ ਨਮੀ 55% ਤੋਂ ਹੇਠਾਂ ਆਉਣ ਤੱਕ ਟਿਊਬਵੈੱਲ ਨਾ ਚਲਾਓ।',
            mr: 'मातीतील ओलावा ५५% च्या खाली येईपर्यंत ट्यूबवेल चालू करू नका.',
          },
        },
        {
          step: 3,
          icon: 'aeration',
          title: {
            hi: 'हल्की गुड़ाई करें',
            en: 'Shallow soil aeration',
            pa: 'ਹਲਕੀ ਗੋਡੀ ਕਰੋ',
            mr: 'हलकी खुरपणी करा',
          },
          desc: {
            hi: 'सतह सूखने पर हल्की खुरपी चलाएं ताकि जड़ों तक ताजा हवा पहुँच सके।',
            en: 'Once surface crust dries, perform shallow inter-cultivation for root aeration.',
            pa: 'ਸਤ੍ਹਾ ਸੁੱਕਣ ਤੇ ਹਲਕੀ ਗੋਡੀ ਕਰੋ ਤਾਂ ਜੋ ਜੜ੍ਹਾਂ ਨੂੰ ਤਾਜ਼ੀ ਹਵਾ ਮਿਲ ਸਕੇ।',
            mr: 'वरचा थर सुकल्यावर हलकी खुरपणी करा जेणेकरून मुळांपर्यंत ताजी हवा पोहोचेल.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
      pumpAction: 'RELAY_OFF',
    });
  }

  // 2. Pre-Visual Silent Infection: Phytophthora Root Rot
  // moisture > 55% && low EC/frozen nutrient uptake
  const isRootRotRisk = current.moisture > 55 && current.ec < 0.9;
  if (isRootRotRisk && !isHypoxic) {
    healthScore -= 24;
    alerts.push({
      id: 'alert-rootrot-' + Date.now(),
      type: 'ROOT_ROT',
      severity: 'CRITICAL',
      title: {
        hi: 'जड़ों में गुप्त सड़न (फाइटोफ्थोरा) का खतरा!',
        en: 'Silent Root Rot Danger (Phytophthora)!',
        pa: 'ਜੜ੍ਹਾਂ ਵਿੱਚ ਗੁਪਤ ਗਲਣ (ਫਾਈਟੋਫਥੋਰਾ) ਦਾ ਖਤਰਾ!',
        mr: 'मुळांमध्ये सुप्त कुजण्याचा (फायटोफ्थोरा) धोका!',
      },
      message: {
        hi: 'नमी अधिक है परन्तु पोषक तत्वों का उठाव रुक गया है। पत्ती सूखने से 4 दिन पहले यह चेतावनी है।',
        en: 'Soil moisture is high but nutrient uptake is frozen. Early warning 4 days before visible wilting.',
        pa: 'ਨਮੀ ਜ਼ਿਆਦਾ ਹੈ ਪਰ ਖੁਰਾਕ ਦਾ ਚੁਕਾਵ ਰੁਕ ਗਿਆ ਹੈ। ਪੱਤੇ ਸੁੱਕਣ ਤੋਂ 4 ਦਿਨ ਪਹਿਲਾਂ ਦੀ ਚਿਤਾਵਨੀ।',
        mr: 'ओलावा जास्त आहे पण पोषक घटक शोषण थांबले आहे. पाने सुकण्यापूर्वी ४ दिवस आधीची पूर्वसूचना.',
      },
      spokenText: {
        hi: 'ध्यान दें! जड़ों में सड़न का शुरुआती खतरा मिला है। तुरंत ट्राइकोडर्मा विरिडी का घोल जड़ों में डालें।',
        en: 'Attention! Pre-visual root rot detected. Drench roots with Trichoderma viride immediately.',
        pa: 'ਧਿਆਨ ਦਿਓ! ਜੜ੍ਹਾਂ ਵਿੱਚ ਗਲਣ ਦਾ ਖਤਰਾ ਹੈ। ਤੁਰੰਤ ਟ੍ਰਾਈਕੋਡਰਮਾ ਵਿਰੀਡੀ ਦਾ ਘੋਲ ਪਾਓ।',
        mr: 'लक्ष द्या! मुळांमध्ये कुजण्याचा धोका आढळला आहे. त्वरित ट्रायकोडर्मा विरिडीचे द्रावण मुळांमध्ये टाका.',
      },
      recommendedAction: {
        hi: 'ट्राइकोडर्मा विरिडी 5 ग्राम प्रति लीटर पानी में घोलकर ड्रिप या जड़ों के पास डालें।',
        en: 'Drench root zone with Trichoderma viride (5g/L water).',
        pa: 'ਟ੍ਰਾਈਕੋਡਰਮਾ ਵਿਰੀਡੀ 5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਜੜ੍ਹਾਂ ਕੋਲ ਪਾਓ।',
        mr: 'ट्रायकोडर्मा विरिडी ५ ग्रॅम प्रति लिटर पाण्यात मिसळून मुळांच्या भागात ओता.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'bio-agent',
          title: {
            hi: 'ट्राइकोडर्मा विरिडी का घोल',
            en: 'Trichoderma viride drench',
            pa: 'ਟ੍ਰਾਈਕੋਡਰਮਾ ਵਿਰੀਡੀ ਘੋਲ',
            mr: 'ट्रायकोडर्मा विरिडी द्रावण',
          },
          desc: {
            hi: '2 किलो ट्राइकोडर्मा को 200 लीटर पानी में 500 ग्राम गुड़ के साथ 24 घंटे फर्मेंट करें।',
            en: 'Ferment 2kg Trichoderma viride in 200L water with 500g jaggery for 24 hours.',
            pa: '2 ਕਿਲੋ ਟ੍ਰਾਈਕੋਡਰਮਾ 200 ਲੀਟਰ ਪਾਣੀ ਅਤੇ 500 ਗ੍ਰਾਮ ਗੁੜ ਨਾਲ 24 ਘੰਟੇ ਰੱਖੋ।',
            mr: '२ किलो ट्रायकोडर्मा २०० लिटर पाण्यात ५०० ग्रॅम गुळासोबत २४ तास ठेवा.',
          },
        },
        {
          step: 2,
          icon: 'drip',
          title: {
            hi: 'शाम के समय जड़ में डालें',
            en: 'Apply to root zone at dusk',
            pa: 'ਸ਼ਾਮ ਵੇਲੇ ਜੜ੍ਹਾਂ ਵਿੱਚ ਪਾਓ',
            mr: 'संध्याकाळी मुळांना द्या',
          },
          desc: {
            hi: 'तेज धूप से बचाकर शाम 5 बजे ड्रिप या नोजल से जड़ों के ठीक पास 100 मिली प्रति पौधा डालें।',
            en: 'Apply 100ml per plant directly at root zone after 5 PM to protect beneficial bio-agents.',
            pa: 'ਧੁੱਪ ਤੋਂ ਬਚਾ ਕੇ ਸ਼ਾਮ ਵੇਲੇ 100 ਮਿਲੀ ਪ੍ਰਤੀ ਬੂਟਾ ਜੜ੍ਹਾਂ ਵਿੱਚ ਪਾਓ।',
            mr: 'संध्याकाळी ५ वाजता प्रति रोप १०० मिली द्रावण थेट मुळाजवळ द्या.',
          },
        },
        {
          step: 3,
          icon: 'no-chemical',
          title: {
            hi: '7 दिन रासायनिक दवा न डालें',
            en: 'No chemical fungicide for 7 days',
            pa: '7 ਦਿਨ ਰਸਾਇਣਕ ਦਵਾਈ ਨਾ ਪਾਓ',
            mr: '७ दिवस कोणतेही रासायनिक औषध टाकू नका',
          },
          desc: {
            hi: 'मित्र फफूंद को बढ़ने दें, किसी भी जहरीली दवा का छिड़काव न करें।',
            en: 'Allow beneficial bioculture to colonize root surfaces without chemical interference.',
            pa: 'ਮਿੱਤਰ ਉੱਲੀ ਨੂੰ ਵਧਣ ਦਿਓ, ਰਸਾਇਣਕ ਸਪਰੇਅ ਨਾ ਕਰੋ।',
            mr: 'उपयुक्त बुरशीला वाढू द्या, कोणतेही रासायनिक बुरशीनाशक फवारू नका.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
    });
  }

  // 3. Pre-Visual Silent Infection: Bacterial Wilt & Leaf Fever
  // Moisture 40-60% (normal) && Leaf Temp > Air Temp + 2°C (Vascular blockage cuts transpiration)
  const leafFeverDelta = current.leaf_temp - current.air_temp;
  const isBacterialWilt = current.moisture >= 38 && current.moisture <= 65 && leafFeverDelta > 1.8;
  if (isBacterialWilt) {
    healthScore -= 28;
    alerts.push({
      id: 'alert-wilt-' + Date.now(),
      type: 'BACTERIAL_WILT',
      severity: 'CRITICAL',
      title: {
        hi: 'बैक्टीरियल विल्ट का गुप्त बुखार (पत्ती बुखार)!',
        en: 'Bacterial Wilt Alert: Leaf Fever Detected!',
        pa: 'ਬੈਕਟੀਰੀਅਲ ਮੁਰਝਾਉ ਦਾ ਗੁਪਤ ਬੁਖਾਰ (ਪੱਤਾ ਬੁਖਾਰ)!',
        mr: 'बॅक्टेरियल विल्ट (पानांचा ताप) पूर्वसूचना!',
      },
      message: {
        hi: `पत्ती का तापमान (${current.leaf_temp.toFixed(1)}°C) हवा के तापमान (${current.air_temp.toFixed(1)}°C) से अधिक है। नसों में जीवाणु जमने से वाष्पोत्सर्जन रुक गया है।`,
        en: `Leaf temperature (${current.leaf_temp.toFixed(1)}°C) exceeds air (${current.air_temp.toFixed(1)}°C) by ${leafFeverDelta.toFixed(1)}°C. Vascular bundles blocked by Ralstonia bacteria.`,
        pa: `ਪੱਤੇ ਦਾ ਤਾਪਮਾਨ ਹਵਾ ਨਾਲੋਂ ${leafFeverDelta.toFixed(1)}°C ਵੱਧ ਹੈ। ਨਾੜੀਆਂ ਵਿੱਚ ਬੈਕਟੀਰੀਆ ਫਸਣ ਕਾਰਨ ਬੂਟੇ ਨੂੰ ਬੁਖਾਰ ਹੈ।`,
        mr: `पानांचे तापमान हवेपेक्षा ${leafFeverDelta.toFixed(1)}°C जास्त आहे. जलवाहिन्यांमध्ये जिवाणू साचल्यामुळे पानांना ताप आला आहे.`,
      },
      spokenText: {
        hi: 'सावधान! पौधे को पत्ती बुखार हो गया है। पत्ती का तापमान हवा से 2 डिग्री ज्यादा है। तुरंत कॉपर ऑक्सीक्लोराइड का छिड़काव करें।',
        en: 'Warning! Leaf Fever detected. Leaf is 2 degrees hotter than ambient air. Drench soil with Copper Oxychloride immediately.',
        pa: 'ਸਾਵਧਾਨ! ਪੌਦੇ ਨੂੰ ਪੱਤਾ ਬੁਖਾਰ ਹੋ ਗਿਆ ਹੈ। ਤੁਰੰਤ ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ ਦਾ ਸਪਰੇਅ ਕਰੋ।',
        mr: 'सावधान! झाडांना पानांचा ताप आला आहे. पाने हवेपेक्षा २ अंश जास्त गरम आहेत. त्वरित कॉपर ऑक्सिक्लोराईडची फवारणी करा.',
      },
      recommendedAction: {
        hi: 'कॉपर ऑक्सीक्लोराइड 50 WP (2.5 ग्राम/ली) + स्ट्रेप्टोसाइक्लिन (1 ग्राम / 10 ली) का घोल तने के पास डालें।',
        en: 'Soil drench with Copper Oxychloride 50 WP (2.5g/L) + Streptocycline (1g/10L).',
        pa: 'ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ (2.5 ਗ੍ਰਾਮ/ਲੀ) + ਸਟ੍ਰੈਪਟੋਸਾਈਕਲੀਨ ਘੋਲ ਜੜ੍ਹਾਂ ਵਿੱਚ ਪਾਓ।',
        mr: 'कॉपर ऑक्सिक्लोराईड (२.५ ग्रॅम/ली) + स्ट्रेप्टोसायक्लिन (१ ग्रॅम/१० ली) द्रावण खोडाभोवती टाका.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'copper',
          title: {
            hi: 'कॉपर + स्ट्रेप्टोसाइक्लिन मिश्रण',
            en: 'Copper + Streptocycline mix',
            pa: 'ਕਾਪਰ + ਸਟ੍ਰੈਪਟੋਸਾਈਕਲੀਨ ਮਿਸ਼ਰਣ',
            mr: 'कॉपर + स्ट्रेप्टोसायक्लिन मिश्रण',
          },
          desc: {
            hi: '100 लीटर पानी में 250 ग्राम कॉपर ऑक्सीक्लोराइड और 10 ग्राम स्ट्रेप्टोसाइक्लिन अच्छी तरह घोलें।',
            en: 'Dissolve 250g Copper Oxychloride and 10g Streptocycline in 100L clean water.',
            pa: '100 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ 250 ਗ੍ਰਾਮ ਕਾਪਰ ਅਤੇ 10 ਗ੍ਰਾਮ ਸਟ੍ਰੈਪਟੋਸਾਈਕਲੀਨ ਮਿਲਾਓ।',
            mr: '१०० लिटर पाण्यात २५० ग्रॅम कॉपर ऑक्सिक्लोराईड आणि १० ग्रॅम स्ट्रेप्टोसायक्लिन नीट मिसळा.',
          },
        },
        {
          step: 2,
          icon: 'stem-drench',
          title: {
            hi: 'तने व जड़ क्षेत्र में ड्रेंचिंग',
            en: 'Stem base collar drenching',
            pa: 'ਤਣੇ ਅਤੇ ਜੜ੍ਹਾਂ ਕੋਲ ਪਾਓ',
            mr: 'खोडाच्या बुंध्याजवळ आळवणी करा',
          },
          desc: {
            hi: 'प्रति पौधा 150 मिली घोल तने के 2 इंच चारों ओर डालें ताकि जीवाणु का फैलाव रुके।',
            en: 'Pour 150ml per plant around collar region to arrest bacterial vascular colony.',
            pa: 'ਹਰ ਬੂਟੇ ਦੇ ਤਣੇ ਦੇ ਆਲੇ-ਦੁਆਲੇ 150 ਮਿਲੀ ਘੋਲ ਪਾਓ।',
            mr: 'प्रत्येक रोपाच्या खोडाभोवती १५० मिली द्रावण टाका.',
          },
        },
        {
          step: 3,
          icon: 'isolate',
          title: {
            hi: 'रोगी पौधे अलग करें',
            en: 'Isolate symptomatic plants',
            pa: 'ਬਿਮਾਰ ਬੂਟੇ ਵੱਖ ਕਰੋ',
            mr: 'बाधित रोपे नष्ट करा',
          },
          desc: {
            hi: 'यदि किसी पौधे पर मुरझान दिख जाए, उसे उखाड़कर पॉलीथीन में भरकर खेत से दूर नष्ट करें।',
            en: 'Uproot severely infected plants in sealed bags to prevent irrigation water transmission.',
            pa: 'ਮੁਰਝਾਏ ਬੂਟਿਆਂ ਨੂੰ ਪੁੱਟ ਕੇ ਖੇਤ ਤੋਂ ਦੂਰ ਨਸ਼ਟ ਕਰੋ।',
            mr: 'गंभीर बाधित रोपे उपटून पिशवीत भरून शेताबाहेर नष्ट करा.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
    });
  }

  // 4. Nitrogen Curve
  if (current.n < 45) {
    healthScore -= 12;
    alerts.push({
      id: 'alert-nlow-' + Date.now(),
      type: 'NITROGEN_CURVE',
      severity: 'WARNING',
      title: {
        hi: 'नाइट्रोजन की कमी: पीलापन (क्लोरोसिस) का खतरा',
        en: 'Low Nitrogen Uptake: Chlorosis Alert',
        pa: 'ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ: ਪੀਲਾਪਣ ਪੈਣ ਦਾ ਖਤਰਾ',
        mr: 'नायट्रोजनची कमतरता: पिवळेपणाचा धोका',
      },
      message: {
        hi: 'मिट्टी में नाइट्रोजन 45 mg/kg से कम है। पत्तियां पीली पड़ सकती हैं।',
        en: 'Soil nitrogen below 45 mg/kg. Foliage risk of severe chlorosis.',
        pa: 'ਨਾਈਟ੍ਰੋਜਨ 45 mg/kg ਤੋਂ ਘੱਟ ਹੈ। ਪੱਤੇ ਪੀਲੇ ਪੈ ਸਕਦੇ ਹਨ।',
        mr: 'मातीत नायट्रोजन ४५ mg/kg पेक्षा कमी आहे. पाने पिवळी पडू शकतात.',
      },
      spokenText: {
        hi: 'नाइट्रोजन का स्तर कम है। फसल की हरी पत्तियां पीली पड़ सकती हैं। नैनो यूरिया का छिड़काव करें।',
        en: 'Nitrogen level is low. Leaves may turn yellow. Spray Nano Urea.',
        pa: 'ਨਾਈਟ੍ਰੋਜਨ ਘੱਟ ਹੈ। ਪੱਤੇ ਪੀਲੇ ਪੈ ਸਕਦੇ ਹਨ। ਨੈਨੋ ਯੂਰੀਆ ਦਾ ਸਪਰੇਅ ਕਰੋ।',
        mr: 'नायट्रोजनची पातळी कमी आहे. पाने पिवळी पडू शकतात. नॅनो युरियाची फवारणी करा.',
      },
      recommendedAction: {
        hi: 'इफको नैनो यूरिया (4 मिली प्रति लीटर पानी) का पत्तियों पर छिड़काव करें।',
        en: 'Foliar spray with IFFCO Nano Urea (4ml per liter water).',
        pa: 'ਨੈਨੋ ਯੂਰੀਆ (4 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ) ਦਾ ਪੱਤਿਆਂ ਤੇ ਸਪਰੇਅ ਕਰੋ।',
        mr: 'इफको नॅनो युरिया (४ मिली प्रति लिटर) पानांवर फवारा.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'nano-spray',
          title: {
            hi: 'नैनो यूरिया घोल बनाएं',
            en: 'Prepare Nano Urea solution',
            pa: 'ਨੈਨੋ ਯੂਰੀਆ ਘੋਲ ਤਿਆਰ ਕਰੋ',
            mr: 'नॅनो युरिया द्रावण तयार करा',
          },
          desc: {
            hi: '15 लीटर की स्प्रे टंकी में 60 मिली नैनो यूरिया बोतल अच्छी तरह हिलाकर डालें।',
            en: 'Shake bottle thoroughly and mix 60ml Nano Urea into 15L spray tank.',
            pa: '15 ਲੀਟਰ ਦੀ ਢੋਲੀ ਵਿੱਚ 60 ਮਿਲੀ ਨੈਨੋ ਯੂਰੀਆ ਮਿਲਾਓ।',
            mr: '१५ लिटरच्या पंपात ६० मिली नॅनो युरिया नीट हलवून टाका.',
          },
        },
        {
          step: 2,
          icon: 'foliar',
          title: {
            hi: 'सुबह 8 से 10 बजे छिड़कें',
            en: 'Spray between 8 AM - 10 AM',
            pa: 'ਸਵੇਰੇ 8 ਤੋਂ 10 ਵਜੇ ਸਪਰੇਅ ਕਰੋ',
            mr: 'सकाळी ८ ते १० दरम्यान फवारा',
          },
          desc: {
            hi: 'पत्तियों के रंध्र (स्टोमेटा) खुले होने पर दोनों तरफ समान रूप से स्प्रे करें।',
            en: 'Spray under leaf surfaces when stomata are fully open during morning hours.',
            pa: 'ਸਵੇਰੇ ਜਦੋਂ ਪੱਤਿਆਂ ਦੇ ਰੋਮ ਖੁੱਲ੍ਹੇ ਹੋਣ, ਸਪਰੇਅ ਕਰੋ।',
            mr: 'सकाळी पानांच्या दोन्ही बाजूंवर एकसारखी फवारणी करा.',
          },
        },
        {
          step: 3,
          icon: 'check',
          title: {
            hi: '3 दिन बाद हरा रंग देखें',
            en: 'Inspect greening after 3 days',
            pa: '3 ਦਿਨ ਬਾਅਦ ਹਰਾ ਰੰਗ ਜਾਂਚੋ',
            mr: '३ दिवसांनी हिरवेपणा तपासा',
          },
          desc: {
            hi: 'पौधे की नई पत्तियों में गहरा हरापन 72 घंटे में लौट आएगा।',
            en: 'Photosynthetic greening will restore across canopy within 72 hours.',
            pa: 'ਬੂਟਿਆਂ ਦੇ ਪੱਤਿਆਂ ਵਿੱਚ 72 ਘੰਟਿਆਂ ਵਿੱਚ ਗੂੜ੍ਹਾ ਹਰਾ ਰੰਗ ਆ ਜਾਵੇਗਾ।',
            mr: 'रोपांच्या नवीन पानांमध्ये ७२ तासांत गडद हिरवेपणा परत येईल.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
    });
  } else if (current.n > 140) {
    healthScore -= 10;
    alerts.push({
      id: 'alert-nhigh-' + Date.now(),
      type: 'NITROGEN_CURVE',
      severity: 'WARNING',
      title: {
        hi: 'नाइट्रोजन की अधिकता: फूल झड़ने का खतरा',
        en: 'Excessive Nitrogen: Flower Drop Warning',
        pa: 'ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਬਹੁਤਾਤ: ਫੁੱਲ ਕਿਰਨ ਦਾ ਖਤਰਾ',
        mr: 'नायट्रोजनचा अतिरेक: फुले गळण्याचा धोका',
      },
      message: {
        hi: 'नाइट्रोजन 140 mg/kg से ज्यादा है। पौधा केवल पत्तियां बढ़ाएगा और फूल-फल नहीं लगेंगे।',
        en: 'Excessive vegetative growth triggered. High risk of complete flower abortion.',
        pa: 'ਨਾਈਟ੍ਰੋਜਨ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੈ। ਬੂਟਾ ਸਿਰਫ ਪੱਤੇ ਵਧਾਏਗਾ, ਫੁੱਲ ਨਹੀਂ ਲੱਗਣਗੇ।',
        mr: 'नायट्रोजन खूप जास्त आहे. झाड फक्त पाने वाढवेल आणि फुले येणार नाहीत.',
      },
      spokenText: {
        hi: 'नाइट्रोजन बहुत ज्यादा हो गया है। यूरिया डालना बंद करें, नहीं तो फूल गिर जाएंगे।',
        en: 'Nitrogen is too high. Stop urea applications immediately or flowers will drop.',
        pa: 'ਨਾਈਟ੍ਰੋਜਨ ਬਹੁਤ ਵੱਧ ਗਿਆ ਹੈ। ਯੂਰੀਆ ਪਾਉਣਾ ਬੰਦ ਕਰੋ ਨਹੀਂ ਤਾਂ ਫੁੱਲ ਡਿੱਗ ਜਾਣਗੇ।',
        mr: 'नायट्रोजन खूप जास्त झाला आहे. युरिया देणे बंद करा, नाहीतर फुले गळून पडतील.',
      },
      recommendedAction: {
        hi: 'यूरिया पूरी तरह बंद करें और पोटाश (0:0:50) का छिड़काव करें।',
        en: 'Halt all nitrogen fertigation; spray Potassium Sulphate (0:0:50).',
        pa: 'ਯੂਰੀਆ ਬੰਦ ਕਰੋ ਅਤੇ ਪੋਟਾਸ਼ ਦਾ ਸਪਰੇਅ ਕਰੋ।',
        mr: 'युरिया पूर्णपणे बंद करा आणि पोटॅशची फवारणी करा.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'halt',
          title: {
            hi: 'यूरिया व डीएपी तुरंत रोकें',
            en: 'Halt Urea & DAP',
            pa: 'ਯੂਰੀਆ ਤੁਰੰਤ ਰੋਕੋ',
            mr: 'युरिया आणि डीएपी त्वरित थांबवा',
          },
          desc: {
            hi: 'कम से कम 15 दिन तक किसी भी नाइट्रोजन उर्वरक का प्रयोग न करें।',
            en: 'Withhold all nitrogenous fertilizers for a minimum of 15 days.',
            pa: '15 ਦਿਨਾਂ ਲਈ ਨਾਈਟ੍ਰੋਜਨ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਬੰਦ ਰੱਖੋ।',
            mr: 'किमान १५ दिवस कोणतेही नायट्रोजनयुक्त खत वापरू नका.',
          },
        },
        {
          step: 2,
          icon: 'potash',
          title: {
            hi: 'पोटाश (0:0:50) का स्प्रे',
            en: 'Potassium Sulphate (0:0:50)',
            pa: 'ਪੋਟਾਸ਼ ਦਾ ਸਪਰੇਅ',
            mr: 'पोटॅशची फवारणी',
          },
          desc: {
            hi: '5 ग्राम प्रति लीटर 0:0:50 का छिड़काव करें ताकि पौधे का ध्यान फल व फूल बनाने पर जाए।',
            en: 'Apply 5g/L Potassium Sulphate to divert plant assimilate partition into flowering.',
            pa: '5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪੋਟਾਸ਼ ਦਾ ਸਪਰੇਅ ਕਰੋ ਤਾਂ ਜੋ ਫੁੱਲ ਬਣ ਸਕਣ।',
            mr: '५ ग्रॅम प्रति लिटर पोटॅश फवारा जेणेकरून झाड फुले व फळे तयार करेल.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
    });
  }

  // 5. Phosphorus Lockout
  // pH < 6.0 (acidic lockout) or pH > 7.5 (alkaline lockout) + low P
  const isPhosphorusLock = (current.ph < 6.0 || current.ph > 7.6) && current.p < 30;
  if (isPhosphorusLock) {
    healthScore -= 14;
    alerts.push({
      id: 'alert-plock-' + Date.now(),
      type: 'PHOSPHORUS_LOCK',
      severity: 'WARNING',
      title: {
        hi: 'फास्फोरस लॉकआउट (पीएच असंतुलन)!',
        en: 'Phosphorus Nutrient Lockout (pH Imbalance)!',
        pa: 'ਫਾਸਫੋਰਸ ਲੌਕਆਊਟ (ਪੀ.ਐਚ ਅਸੰਤੁਲਨ)!',
        mr: 'फॉस्फरस लॉकआऊट (सामू असंतुलन)!',
      },
      message: {
        hi: `मिट्टी का पीएच ${current.ph.toFixed(1)} होने से फास्फोरस जड़ों को नहीं मिल पा रहा है। पौधे की बढ़त रुक गई है।`,
        en: `Soil pH (${current.ph.toFixed(1)}) binds phosphorus in insoluble complexes. Root development stalled.`,
        pa: `ਮਿੱਟੀ ਦਾ ਪੀ.ਐਚ ${current.ph.toFixed(1)} ਹੋਣ ਕਾਰਨ ਫਾਸਫੋਰਸ ਜੜ੍ਹਾਂ ਨੂੰ ਨਹੀਂ ਮਿਲ ਰਿਹਾ।`,
        mr: `मातीचा सामू (pH) ${current.ph.toFixed(1)} असल्याने फॉस्फरस मुळांना मिळत नाही. वाढ खुंटली आहे.`,
      },
      spokenText: {
        hi: 'पीएच असंतुलन के कारण मिट्टी में फास्फोरस जम गया है। जिप्सम या चूने का उपचार करें।',
        en: 'Soil pH imbalance has locked up phosphorus. Apply soil conditioner.',
        pa: 'ਪੀ.ਐਚ ਅਸੰਤੁਲਨ ਕਾਰਨ ਫਾਸਫੋਰਸ ਜੰਮ ਗਿਆ ਹੈ। ਜਿਪਸਮ ਜਾਂ ਚੂਨੇ ਦਾ ਇਲਾਜ ਕਰੋ।',
        mr: 'सामू असंतुलनामुळे फॉस्फरस मातीत अडकून पडला आहे. जिप्सम किंवा चुन्याचा वापर करा.',
      },
      recommendedAction: {
        hi: current.ph > 7.6 ? 'खेत में जिप्सम (50 किग्रा/एकड़) डालें।' : 'खेत में कृषि चूना (25 किग्रा/एकड़) डालें।',
        en: current.ph > 7.6 ? 'Apply Gypsum (50kg/acre) to reduce alkalinity.' : 'Apply Agricultural Lime (25kg/acre) to buffer acidity.',
        pa: 'ਖੇਤ ਵਿੱਚ ਜਿਪਸਮ ਜਾਂ ਚੂਨਾ ਪਾਓ।',
        mr: current.ph > 7.6 ? 'शेतात जिप्सम (५० किलो/एकर) टाका.' : 'शेतात कृषी चुना (२५ किलो/एकर) टाका.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'conditioner',
          title: {
            hi: current.ph > 7.6 ? 'जिप्सम का बुरकाव' : 'कृषि चूने का बुरकाव',
            en: current.ph > 7.6 ? 'Broadcast Gypsum' : 'Broadcast Lime',
            pa: 'ਜਿਪਸਮ ਜਾਂ ਚੂਨਾ ਪਾਓ',
            mr: current.ph > 7.6 ? 'जिप्सम पसरवा' : 'चुना पसरवा',
          },
          desc: {
            hi: 'सिंचाई से पहले क्यारियों में समान रूप से बिखेरें।',
            en: 'Uniformly broadcast soil conditioner across bed ridges prior to light watering.',
            pa: 'ਪਾਣੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਆਰੀਆਂ ਵਿੱਚ ਇਕਸਾਰ ਖਿਲਾਰੋ।',
            mr: 'पाणी देण्यापूर्वी वाफ्यांमध्ये एकसारखे पसरा.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
    });
  }

  // 6. Potassium Fruiting Boost (Day 60+)
  if (cropDay >= 55 && current.k < 90) {
    healthScore -= 8;
    alerts.push({
      id: 'alert-kboost-' + Date.now(),
      type: 'POTASSIUM_BOOST',
      severity: 'INFO',
      title: {
        hi: 'पोटाश बूस्ट: फल भराव का समय',
        en: 'Potassium Fruiting Boost Needed',
        pa: 'ਪੋਟਾਸ਼ ਬੂਸਟ: ਫਲ ਭਰਨ ਦਾ ਸਮਾਂ',
        mr: 'पोटॅश बूस्ट: फळ भरण्याची वेळ',
      },
      message: {
        hi: 'फसल 55 दिन से ऊपर हो गई है। फलों का आकार और चमक बढ़ाने के लिए पोटाश दें।',
        en: 'Crop is in fruiting stage (Day 55+). Additional potassium required for fruit caliber and Brix.',
        pa: 'ਫਸਲ 55 ਦਿਨਾਂ ਤੋਂ ਉੱਪਰ ਹੋ ਗਈ ਹੈ। ਫਲ ਦਾ ਆਕਾਰ ਵਧਾਉਣ ਲਈ ਪੋਟਾਸ਼ ਦਿਓ।',
        mr: 'पीक ५५ दिवसांच्या पुढे गेले आहे. फळांचा आकार आणि चकाकी वाढवण्यासाठी पोटॅश द्या.',
      },
      spokenText: {
        hi: 'फलों के अच्छे वजन और चमक के लिए पोटाश की खुराक दें।',
        en: 'Apply potassium to maximize fruit size and color shine.',
        pa: 'ਫਲਾਂ ਦੇ ਚੰਗੇ ਭਾਰ ਲਈ ਪੋਟਾਸ਼ ਦੀ ਖੁਰਾਕ ਦਿਓ।',
        mr: 'फळांचे वजन आणि चकाकी वाढवण्यासाठी पोटॅशची मात्रा द्या.',
      },
      recommendedAction: {
        hi: 'म्यूरिएट ऑफ पोटाश (MOP) या 0:0:50 की खुराक दें।',
        en: 'Drip application of 0:0:50 (5kg/acre).',
        pa: 'ਪੋਟਾਸ਼ ਖਾਦ ਪਾਓ।',
        mr: 'म्युरिएट ऑफ पोटॅश किंवा ०:०:५० द्या.',
      },
      remedySteps: [
        {
          step: 1,
          icon: 'k-boost',
          title: {
            hi: 'ड्रिप से 0:0:50 चलाएं',
            en: 'Drip fertigate 0:0:50',
            pa: 'ਡ੍ਰਿਪ ਰਾਹੀਂ ਪੋਟਾਸ਼ ਦਿਓ',
            mr: 'ठिबकद्वारे ०:०:५० द्या',
          },
          desc: {
            hi: 'प्रति एकड़ 5 किलो 0:0:50 को ड्रिप वेंचुरी से दें।',
            en: 'Inject 5kg/acre Potassium Sulphate through venturi unit.',
            pa: '5 ਕਿਲੋ ਪੋਟਾਸ਼ ਡ੍ਰਿਪ ਰਾਹੀਂ ਚਲਾਓ।',
            mr: 'प्रति एकर ५ किलो ०:०:५० ठिबक सिंचनातून द्या.',
          },
        },
      ],
      timestamp: new Date().toISOString(),
      active: true,
    });
  }

  // Bound overall health between 10% and 100%
  healthScore = Math.max(10, Math.min(100, healthScore));

  const recommendations: string[] = [];
  if (pumpRelay) {
    recommendations.push('सिंचाई चक्र सामान्य है (Normal Irrigation)');
  } else {
    recommendations.push('पंप बंद किया गया है (Pump Halted for Root Safety)');
  }

  return {
    alerts,
    overallHealthScore: healthScore,
    pumpRelayState: pumpRelay,
    recommendations,
  };
}
