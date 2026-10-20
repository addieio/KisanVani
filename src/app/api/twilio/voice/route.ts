import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId') || 'अज्ञात';
    const cropName = url.searchParams.get('cropName') || 'फसल';
    const quantity = url.searchParams.get('quantity') || '0';
    const totalPrice = url.searchParams.get('totalPrice') || '0';

    console.log('[Twilio Voice Webhook] Farmer answered call. Payload:', {
      orderId,
      cropName,
      quantity,
      totalPrice,
      caller: req.headers.get('x-forwarded-for') || 'Twilio Voice',
    });

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = host ? `https://${host}` : (process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app');
    const gatherActionUrl = `${baseUrl}/api/twilio/gather?orderId=${encodeURIComponent(orderId)}`;

    // Build Sarvam Hindi TTS audio URL for the order message
    const audioParams = new URLSearchParams({ type: 'order', cropName, quantity, totalPrice });
    const sarvamAudioUrl = `${baseUrl}/api/sarvam/audio?${audioParams.toString()}`;

    // Build fallback audio URL (no response message)
    const noResponseAudioUrl = `${baseUrl}/api/sarvam/audio?type=no_response`;

    console.log('[Twilio Voice Webhook] Using Sarvam Hindi TTS audio:', sarvamAudioUrl);

    // Escape XML entities so Twilio's XML parser doesn't crash on unescaped '&'
    const escapeXml = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // TwiML: Play Sarvam-generated Hindi audio inside a Gather block
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech dtmf" language="hi-IN" numDigits="1" action="${escapeXml(gatherActionUrl)}" method="POST" timeout="10" speechTimeout="auto" finishOnKey="" hints="1, एक, ek, हां, हाँ, yes, haan, मंजूर, स्वीकार, ठीक" bargeIn="true">
    <Play>${escapeXml(sarvamAudioUrl)}</Play>
  </Gather>
  <Play>${escapeXml(noResponseAudioUrl)}</Play>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error: any) {
    console.error('[Twilio Voice Webhook] Error generating TwiML:', error);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app';
    const errorAudioUrl = `${baseUrl}/api/sarvam/audio?type=error`;

    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${errorAudioUrl}</Play>
</Response>`;
    return new NextResponse(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

// Allow GET for easy manual testing in browser
export async function GET(req: NextRequest) {
  return POST(req);
}
