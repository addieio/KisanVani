import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { prompt, disease, lang = 'hi' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemInstruction = 
      "आप 'किसान मित्र' (KisanVaani) के एआई कृषि डॉक्टर हैं। " +
      "भारतीय छोटे किसान के साथ सीधे हिंदी में बातचीत कर रहे हैं। " +
      "नियम: " +
      "1. उत्तर केवल 2 से 3 संक्षिप्त, सरल वाक्यों में दें ताकि इसे तुरंत बोलकर सुनाया जा सके (TTS)। " +
      "2. वैज्ञानिक शब्दों के बजाय सरल व्यावहारिक नाम और उपाय बताएं। " +
      "3. दवा की मात्रा (प्रति 15 लीटर पंप) या घरेलू जैविक उपाय साफ बताएं। " +
      "4. हमेशा किसान भाई का हौसला बढ़ाएं।";

    const fullPrompt = 
      `${systemInstruction}\n\n` +
      `वर्तमान में पहचानी गई बीमारी: ${disease || 'अगेती झुलसा'}\n` +
      `किसान का सवाल: ${prompt}\n\n` +
      `डॉक्टर का संक्षिप्त हिंदी उत्तर:`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const speechText = text.replace(/[*#_]/g, '').trim();
      return NextResponse.json({
        success: true,
        text,
        speech_text: speechText
      });
    }

    // Graceful fallback
    const fallbackText = `किसान भाई, ${disease || 'इस समस्या'} के लिए ट्राइकोडर्मा विरिडी या नीम तेल 5 मि.ली. प्रति लीटर पानी में मिलाकर सुबह या शाम छिड़कें। खेत में जलभराव न होने दें।`;
    return NextResponse.json({
      success: true,
      text: fallbackText,
      speech_text: fallbackText
    });
  } catch (err) {
    console.error('Gemini Chat Route Error:', err);
    return NextResponse.json({
      success: true,
      text: 'किसान भाई, दवा का छिड़काव सुबह 9 बजे से पहले या शाम 4 बजे के बाद करें। 15 लीटर पंप में 30 ग्राम जैविक दवा पर्याप्त रहेगी।',
      speech_text: 'किसान भाई, दवा का छिड़काव सुबह 9 बजे से पहले या शाम 4 बजे के बाद करें। 15 लीटर पंप में 30 ग्राम जैविक दवा पर्याप्त रहेगी।'
    });
  }
}
