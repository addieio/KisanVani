import { NextRequest, NextResponse } from 'next/server';
import {
  generateHindiSpeech,
  buildOrderHindiMessage,
  buildOrderAcceptedMessage,
  buildNoResponseMessage,
  buildErrorMessage,
  buildUnrecognizedMessage,
  getCachedAudio,
  setCachedAudio,
} from '@/lib/sarvam';

/**
 * API route that generates Hindi TTS audio via Sarvam AI and returns it as a wav file.
 * Twilio's <Play> tag calls this URL to stream the audio to the farmer's phone.
 *
 * Query params:
 *   type: 'order' | 'accepted' | 'no_response' | 'error' | 'unrecognized'
 *   cropName, quantity, totalPrice (for type=order)
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'order';
  const cropName = url.searchParams.get('cropName') || 'फसल';
  const quantity = url.searchParams.get('quantity') || '0';
  const totalPrice = url.searchParams.get('totalPrice') || '0';

  const cacheKey = type === 'order' ? `order-${cropName}-${quantity}-${totalPrice}` : type;
  const cached = getCachedAudio(cacheKey);
  if (cached) {
    console.log('[Sarvam Audio API] Serving instantly from memory cache. Key:', cacheKey, 'Size:', cached.length);
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(cached.length),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  let text: string;
  switch (type) {
    case 'accepted':
      text = buildOrderAcceptedMessage();
      break;
    case 'no_response':
      text = buildNoResponseMessage();
      break;
    case 'error':
      text = buildErrorMessage();
      break;
    case 'unrecognized':
      text = buildUnrecognizedMessage();
      break;
    case 'order':
    default:
      text = buildOrderHindiMessage(cropName, quantity, totalPrice);
      break;
  }

  console.log('[Sarvam Audio API] Generating audio for type:', type, '| Text:', text.substring(0, 80) + '...');

  const result = await generateHindiSpeech({ text });

  if (!result.success || !result.audioBase64) {
    console.error('[Sarvam Audio API] TTS generation failed:', result.error);
    return new NextResponse('TTS generation failed or SARVAM_API_KEY missing', { status: 500 });
  }

  // Decode base64 to binary wav
  const audioBuffer = Buffer.from(result.audioBase64, 'base64');
  setCachedAudio(cacheKey, audioBuffer);

  console.log('[Sarvam Audio API] Serving wav audio. Size:', audioBuffer.length, 'bytes');

  return new NextResponse(new Uint8Array(audioBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'audio/wav',
      'Content-Length': String(audioBuffer.length),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
