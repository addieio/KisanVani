import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to escape XML entities in TwiML
const escapeXml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Checks if farmer accepted the order via DTMF keypad digit or spoken voice response.
 * Handles both Hindi Devanagari script (with Anusvara or Chandrabindu) and English transliterations.
 */
function checkFarmerAcceptance(digits: string, speech: string): { isAccepted: boolean; reason: string } {
  // 1. DTMF Keypad check: pressed '1'
  if (digits && (digits.includes('1') || digits === '1')) {
    return { isAccepted: true, reason: `DTMF key '1' pressed (digits="${digits}")` };
  }

  // 2. Clean and normalize speech
  const cleaned = speech
    .toLowerCase()
    .replace(/[!.,?।\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return { isAccepted: false, reason: 'Empty speech and no DTMF digits' };
  }

  // Explicit rejection check
  const REJECT_WORDS = ['नहीं', 'ना', 'nahi', 'nahin', 'no', 'nope', 'cancel', 'radd', 'रद्द', 'मना', '2'];
  for (const rw of REJECT_WORDS) {
    if (cleaned.split(' ').includes(rw) || cleaned === rw) {
      return { isAccepted: false, reason: `Explicit rejection detected: "${rw}"` };
    }
  }

  // Comprehensive affirmative / acceptance tokens in Hindi & English
  const ACCEPT_TOKENS = [
    'हां',      // Devanagari with Anusvara (\u0902)
    'हाँ',      // Devanagari with Chandrabindu (\u0901)
    'हा',
    'हं',
    'haan',
    'han',
    'ha',
    'yes',
    'yep',
    'yeah',
    'one',
    'ek',
    'एक',
    '1',
    'स्वीकार',
    'मंजूर',
    'manzoor',
    'sweekar',
    'theek',
    'ठीक',
    'sahi',
    'सही',
    'bilkul',
    'बिल्कुल',
    'accept',
    'done',
    'ok',
    'okay',
    'ji haan',
    'ji ha',
  ];

  for (const token of ACCEPT_TOKENS) {
    if (cleaned.includes(token)) {
      return { isAccepted: true, reason: `Matched affirmative token "${token}" in speech "${speech}"` };
    }
  }

  return { isAccepted: false, reason: `Speech "${speech}" did not match acceptance tokens` };
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get('orderId') || '';
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const baseUrl = host ? `https://${host}` : (process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app');

    // Twilio sends payload as application/x-www-form-urlencoded
    const formData = await req.formData();
    const digits = (formData.get('Digits') || '').toString().trim();
    const speechResult = (formData.get('SpeechResult') || '').toString().trim();
    const callSid = formData.get('CallSid') || '';

    console.log('[Twilio Gather Webhook] Response received from farmer:', {
      orderId,
      callSid,
      digits,
      speechResult,
    });

    const { isAccepted, reason } = checkFarmerAcceptance(digits, speechResult);
    console.log('[Twilio Gather Webhook] Decision:', { isAccepted, reason });

    if (isAccepted) {
      console.log(`[Twilio Gather Webhook] Order ${orderId} ACCEPTED by farmer!`);

      // Update Supabase orders table: set status = 'ACCEPTED' where id = orderId
      if (orderId) {
        try {
          const { data, error } = await supabase
            .from('orders')
            .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
            .eq('id', orderId);

          if (error) {
            console.error('[Twilio Gather Webhook] Supabase update error:', error);
          } else {
            console.log('[Twilio Gather Webhook] Supabase orders table successfully updated for order:', orderId);
          }
        } catch (dbErr) {
          console.error('[Twilio Gather Webhook] Database exception during order update:', dbErr);
        }
      }

      // Play Sarvam Hindi "Order Accepted" audio
      const acceptedAudioUrl = `${baseUrl}/api/sarvam/audio?type=accepted`;
      const successTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${escapeXml(acceptedAudioUrl)}</Play>
</Response>`;

      return new NextResponse(successTwiml, {
        status: 200,
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    } else {
      console.log(`[Twilio Gather Webhook] Input not recognized or rejected. Digits: "${digits}", Speech: "${speechResult}"`);

      // Play Sarvam Hindi "Unrecognized" audio
      const unrecognizedAudioUrl = `${baseUrl}/api/sarvam/audio?type=unrecognized`;
      const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${escapeXml(unrecognizedAudioUrl)}</Play>
</Response>`;

      return new NextResponse(fallbackTwiml, {
        status: 200,
        headers: {
          'Content-Type': 'text/xml',
        },
      });
    }
  } catch (error: any) {
    console.error('[Twilio Gather Webhook] Error processing gather webhook:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app';
    const errorAudioUrl = `${baseUrl}/api/sarvam/audio?type=unrecognized`;
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Play>${escapeXml(errorAudioUrl)}</Play>
</Response>`;
    return new NextResponse(errorTwiml, {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}
