import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = host ? `https://${host}` : (process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app');
    const gatherActionUrl = `${baseUrl}/api/twilio/offline-listing/gather`;

    console.log('[Twilio Offline Listing Voice] Farmer connected to IVR call.');

    // Escape XML entities
    const escapeXml = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    const welcomePrompt =
      'नमस्ते किसान भाई! किसानवाणी में आपका स्वागत है। आप कौन सी सब्जी या फसल का आर्डर पोस्ट करना चाहते हैं और कितनी मात्रा? जैसे बोलिए: 300 किलो टमाटर। बीप के बाद अपनी आवाज में बोलें।';

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="hi-IN" action="${escapeXml(gatherActionUrl)}?step=1" method="POST" timeout="8" speechTimeout="auto" hints="टमाटर, tamatar, tomato, आलू, aloo, potato, प्याज, pyaz, onion, मिर्च, mirch, गोभी, gobhi, भिंडी, bhindi, किलो, kg, kilo, क्विंटल, quintal, 300, 500, 200, 1000, 40, 25, 30, 50, 60, भाव, रेट, rate, bhav, रुपये, rs, rupaye" bargeIn="true">
    <Say language="hi-IN" voice="Polly.Aditi">${escapeXml(welcomePrompt)}</Say>
  </Gather>
  <Say language="hi-IN" voice="Polly.Aditi">क्षमा करें, आपकी आवाज नहीं सुनी गई। कृपया दोबारा कोशिश करें। धन्यवाद।</Say>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error: any) {
    console.error('[Twilio Offline Listing Voice] Error:', error);
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">क्षमा करें, तकनीकी समस्या के कारण कॉल समाप्त की जा रही है।</Say>
</Response>`;
    return new NextResponse(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
