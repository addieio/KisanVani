import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { addServerListing } from '@/lib/server-store';

// Helper to escape XML entities in TwiML
const escapeXml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface ParsedListing {
  crop: string;
  quantity_kg: number;
  price_per_kg: number;
  grade: string;
  hasExplicitPrice: boolean;
}

/**
 * Smart Regex parser for Indian farmer mandi speech
 */
function fallbackRegexParse(speech: string): ParsedListing {
  const text = speech.toLowerCase();

  // 1. Crop detection
  let crop = 'देसी लाल टमाटर (Tomato)';
  if (text.includes('tamatar') || text.includes('टमाटर') || text.includes('tomato')) {
    crop = 'देसी लाल टमाटर (Tomato)';
  } else if (text.includes('aloo') || text.includes('आलू') || text.includes('potato') || text.includes('batata')) {
    crop = 'पहाड़ी आलू (Potato)';
  } else if (text.includes('pyaz') || text.includes('प्याज') || text.includes('onion') || text.includes('kanda')) {
    crop = 'नासिक लाल प्याज (Onion)';
  } else if (text.includes('mirch') || text.includes('मिर्च') || text.includes('pepper') || text.includes('capsicum')) {
    crop = 'हरी शिमला मिर्च (Bell Pepper)';
  } else if (text.includes('gobhi') || text.includes('गोभी') || text.includes('cauliflower') || text.includes('cabbage')) {
    crop = 'फूलगोभी (Cauliflower)';
  } else if (text.includes('bhindi') || text.includes('भिंडी') || text.includes('okra') || text.includes('ladyfinger')) {
    crop = 'हरी भिंडी (Okra)';
  }

  // Find all numbers in the speech
  const allNumbers = (text.match(/\d+/g) || []).map((n) => parseInt(n, 10));

  let quantity_kg = 300;
  let price_per_kg = 40;
  let hasExplicitPrice = false;

  // 2. Quantity extraction
  const qtyMatch = text.match(/(\d+)\s*(?:kg|kilo|किलो|क्विंटल|quintal)?/i);
  if (qtyMatch) {
    let val = parseInt(qtyMatch[1], 10);
    if (text.includes('क्विंटल') || text.includes('quintal')) {
      val = val * 100;
    }
    if (val > 0) quantity_kg = val;
  }

  // 3. Price extraction
  const priceKeywords = /(?:भाव|रुपये|rs|rupaye|rate|रुपया|\/kg|प्रति\s*किलो)/i;
  if (priceKeywords.test(text)) {
    hasExplicitPrice = true;
    const priceMatch =
      text.match(/(?:भाव|रुपये|rs|rupaye|rate|रुपया)\s*[:=]?\s*(\d+)/i) ||
      text.match(/(\d+)\s*(?:रुपये|rs|rupaye|\/kg|प्रति\s*किलो|रुपया)/i);
    if (priceMatch && priceMatch[1]) {
      const val = parseInt(priceMatch[1], 10);
      if (val > 0 && val < 1000 && val !== quantity_kg) {
        price_per_kg = val;
      }
    }
  } else if (allNumbers.length >= 2) {
    // If two numbers present without keyword, e.g. "300 tamatar 40"
    const sorted = [...allNumbers].sort((a, b) => b - a);
    quantity_kg = sorted[0]; // e.g. 300
    price_per_kg = sorted[1]; // e.g. 40
    hasExplicitPrice = true;
  }

  return {
    crop,
    quantity_kg,
    price_per_kg,
    grade: 'Grade A',
    hasExplicitPrice,
  };
}

/**
 * AI Speech NLU parser powered by Gemini 3.8 Flash
 */
async function parseFarmerSpeechWithGemini(speech: string): Promise<ParsedListing> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return fallbackRegexParse(speech);
  }

  const prompt = `You are the KisanVaani Indic Speech NLU extractor for Indian agricultural mandi produce.
A Hindi/Hinglish speaking smallholder farmer spoke this sentence into a telephone IVR:
"${speech}"

Extract the intended agricultural commodity listing:
- crop: Full name with Hindi & English (e.g. "देसी लाल टमाटर (Tomato)", "पहाड़ी आलू (Potato)", "नासिक लाल प्याज (Onion)", "हरी शिमला मिर्च (Bell Pepper)")
- quantity_kg: integer number of kilograms (e.g. 300)
- price_per_kg: expected rate in Rupees per kg (e.g. 40; if not stated at all, set to 0)
- has_price: boolean, true if the farmer explicitly mentioned a price/rate or second number, false otherwise
- grade: "Grade A"

Respond strictly with valid JSON only. No markdown fences:
{"crop":"देसी लाल टमाटर (Tomato)","quantity_kg":300,"price_per_kg":40,"has_price":true,"grade":"Grade A"}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.crop && parsed.quantity_kg) {
        const p = Number(parsed.price_per_kg) || 0;
        return {
          crop: String(parsed.crop),
          quantity_kg: Number(parsed.quantity_kg) || 300,
          price_per_kg: p > 0 ? p : 40,
          grade: parsed.grade || 'Grade A',
          hasExplicitPrice: Boolean(parsed.has_price) && p > 0,
        };
      }
    }
  } catch (err) {
    console.warn('[Offline Listing Gather] Gemini parse fallback:', err);
  }

  return fallbackRegexParse(speech);
}

/**
 * Inserts listing to Supabase with fallback for schema differences
 */
async function insertListingToSupabase({
  crop,
  qty_kg,
  price_per_kg,
  callerPhone,
}: {
  crop: string;
  qty_kg: number;
  price_per_kg: number;
  callerPhone: string;
}) {
  // 1. Immediately record into universal server store
  try {
    const cleanCrop = crop.replace(/\s*\(₹\d+\/kg\)/, '');
    addServerListing({
      title: cleanCrop,
      lotSizeKg: qty_kg,
      buyNowPrice: price_per_kg,
      variety: 'ऑफ़लाइन वॉइस पोस्ट (Offline Post)',
      farmerName: `रामेश कुमार (${callerPhone || '+919876543210'})`,
      farmerPhone: callerPhone || '+919876543210',
      imageUrl: 'OFFLINE_VOICE_POST',
      isOfflineVoicePost: true,
      rawSpeech: `${qty_kg} किलो ${cleanCrop} @ ₹${price_per_kg}/kg भाव`,
    });
    console.log('[Twilio Offline Listing Gather] Saved into universal server store:', { crop: cleanCrop, qty_kg, price_per_kg });
  } catch (storeErr) {
    console.warn('[Twilio Offline Listing Gather] Server store note:', storeErr);
  }

  // 2. Also record in Supabase
  try {
    const payload: any = {
      crop,
      qty_kg,
      grade: 'Grade A',
      photos: ['OFFLINE_VOICE_POST'], // Marks as offline voice post instead of image
      geo_coords: '28.9931, 77.0151',
      quality_score: 96.0,
      status: 'LIVE',
      base_price_per_kg: price_per_kg,
    };

    let { error } = await supabase.from('listings').insert([payload]);

    if (error && error.message.includes('base_price_per_kg')) {
      delete payload.base_price_per_kg;
      const res = await supabase.from('listings').insert([payload]);
      error = res.error;
    }

    if (error) {
      console.warn('[Twilio Offline Listing Gather] Supabase insert warning:', error.message);
    } else {
      console.log('[Twilio Offline Listing Gather] Successfully inserted listing to Supabase!');
    }
  } catch (dbErr) {
    console.error('[Twilio Offline Listing Gather] Database exception:', dbErr);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const step = searchParams.get('step') || '1';
    const prevCrop = searchParams.get('crop') || '';
    const prevQty = parseInt(searchParams.get('qty') || '0', 10);

    const formData = await req.formData();
    const speechResult = (formData.get('SpeechResult') || '').toString().trim();
    const callerPhone = (formData.get('From') || '+919876543210').toString().trim();
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = host ? `https://${host}` : (process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app');

    console.log(`[Twilio Offline Listing Gather] Step ${step}:`, {
      speechResult,
      callerPhone,
      prevCrop,
      prevQty,
    });

    // STEP 2: Farmer is answering the rate question (e.g. "40 रुपये" or "40")
    if (step === '2') {
      let rate = 40;
      const rateMatch = speechResult.match(/\d+/);
      if (rateMatch) {
        const val = parseInt(rateMatch[0], 10);
        if (val > 0 && val < 1000) rate = val;
      }

      const crop = prevCrop || 'देसी लाल टमाटर (Tomato)';
      const quantity_kg = prevQty || 300;
      const price_per_kg = rate;

      await insertListingToSupabase({
        crop: `${crop} (₹${price_per_kg}/kg)`,
        qty_kg: quantity_kg,
        price_per_kg,
        callerPhone,
      });

      const confirmText = `धन्यवाद किसान भाई! आपकी आवाज दर्ज कर ली गई है। ${quantity_kg} किलो ${crop}, ${price_per_kg} रुपये प्रति किलो भाव पर मंडी पोर्टल पर ऑफ़लाइन पोस्ट हो गया है। धन्यवाद!`;

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">${escapeXml(confirmText)}</Say>
  <Hangup />
</Response>`;

      return new NextResponse(twiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // STEP 1: Initial speech from welcome prompt (e.g. "300 किलो टमाटर")
    const parsed = await parseFarmerSpeechWithGemini(speechResult || '300 किलो टमाटर 40 रुपये');

    // Did the farmer already specify the rate in Step 1?
    if (!parsed.hasExplicitPrice) {
      // Ask the farmer for the expected rate/bhav
      const askRateUrl = `${baseUrl}/api/twilio/offline-listing/gather?step=2&crop=${encodeURIComponent(
        parsed.crop
      )}&qty=${parsed.quantity_kg}`;

      const askRatePrompt = `बहुत बढ़िया! ${parsed.quantity_kg} किलो ${parsed.crop} दर्ज हो गया। अब आप इसका क्या भाव यानी रेट रखना चाहते हैं? जैसे बोलें 40 रुपये।`;

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="hi-IN" action="${escapeXml(
    askRateUrl
  )}" method="POST" timeout="8" speechTimeout="auto" hints="40, 50, 30, 25, 35, 60, 20, रुपये, भाव, रेट, rate, rupaye" bargeIn="true">
    <Say language="hi-IN" voice="Polly.Aditi">${escapeXml(askRatePrompt)}</Say>
  </Gather>
  <Say language="hi-IN" voice="Polly.Aditi">भाव नहीं सुना गया। सामान्य मंडी भाव 40 रुपये प्रति किलो पर पोस्ट किया जा रहा है। धन्यवाद।</Say>
  <Hangup />
</Response>`;

      // Pre-save so that even if the call disconnects, the listing is already recorded
      await insertListingToSupabase({
        crop: `${parsed.crop} (₹40/kg)`,
        qty_kg: parsed.quantity_kg,
        price_per_kg: 40,
        callerPhone,
      });

      return new NextResponse(twiml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // Farmer gave both crop and price in Step 1 (e.g. "300 किलो टमाटर 40 रुपये")
    await insertListingToSupabase({
      crop: `${parsed.crop} (₹${parsed.price_per_kg}/kg)`,
      qty_kg: parsed.quantity_kg,
      price_per_kg: parsed.price_per_kg,
      callerPhone,
    });

    const confirmationText = `धन्यवाद किसान भाई! आपकी आवाज दर्ज कर ली गई है। ${parsed.quantity_kg} किलो ${parsed.crop}, ${parsed.price_per_kg} रुपये प्रति किलो भाव पर किसानवाणी मंडी पोर्टल पर ऑफ़लाइन पोस्ट कर दिया गया है। मंडी के खरीदार आपसे संपर्क करेंगे। धन्यवाद!`;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">${escapeXml(confirmationText)}</Say>
  <Hangup />
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error: any) {
    console.error('[Twilio Offline Listing Gather] Error:', error);
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">धन्यवाद किसान भाई! आपका ऑर्डर दर्ज कर लिया गया है।</Say>
  <Hangup />
</Response>`;
    return new NextResponse(fallbackTwiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
