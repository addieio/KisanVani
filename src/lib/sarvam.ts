/**
 * Sarvam AI Hindi Text-to-Speech Utility
 * Uses the Bulbul v4-flash model for natural Hindi voice synthesis.
 * Returns base64-encoded MP3/WAV audio.
 */

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

if (!SARVAM_API_KEY) {
  console.warn('[Sarvam] Warning: SARVAM_API_KEY is not set in environment variables.');
}

export interface SarvamTTSOptions {
  text: string;
  language?: string;   // default: 'hi-IN'
  speaker?: string;    // default: 'aarti_hi_customer'
  model?: string;      // default: 'bulbul:v4-flash'
  sampleRate?: number; // default: 8000 (for Twilio compatibility)
  format?: string;     // default: 'wav' (Twilio plays wav natively)
}

export interface SarvamTTSResult {
  success: boolean;
  audioBase64?: string;
  error?: string;
}

// Global in-memory cache for generated audio buffers
const audioCache = new Map<string, Buffer>();

export function getCachedAudio(key: string): Buffer | undefined {
  return audioCache.get(key);
}

export function setCachedAudio(key: string, buffer: Buffer): void {
  audioCache.set(key, buffer);
}

/**
 * Generate Hindi speech audio from text using Sarvam AI Bulbul TTS.
 * Returns base64-encoded audio data.
 */
export async function generateHindiSpeech(options: SarvamTTSOptions): Promise<SarvamTTSResult> {
  const {
    text,
    language = 'hi-IN',
    speaker = 'aarti_hi_customer',
    model = 'bulbul:v4-flash',
    sampleRate = 8000,
    format = 'wav',
  } = options;

  if (!SARVAM_API_KEY) {
    return {
      success: false,
      error: 'SARVAM_API_KEY is not set in environment variables.',
    };
  }

  try {
    const response = await fetch(SARVAM_TTS_URL, {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: language,
        speaker,
        model,
        speech_sample_rate: sampleRate,
        audio_format: format,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[Sarvam TTS] API error:', response.status, errorBody);
      return { success: false, error: `Sarvam API error ${response.status}: ${errorBody}` };
    }

    const data = await response.json();
    const audioBase64 = data?.audios?.[0];
    if (!audioBase64) {
      return { success: false, error: 'No audio data returned from Sarvam' };
    }

    return { success: true, audioBase64 };
  } catch (err: any) {
    console.error('[Sarvam TTS] Request failed:', err);
    return { success: false, error: err.message || String(err) };
  }
}

export function buildOrderHindiMessage(
  cropName: string,
  quantity: string,
  totalPrice: string
): string {
  return `नमस्कार जी। आपके लिए एक नया ऑर्डर आया है। ${cropName}, ${quantity} किलो, कुल राशि ${totalPrice} रुपये। ऑर्डर स्वीकार करने के लिए कृपया एक दबाएं। या हाँ बोलें।`;
}

export function buildOrderAcceptedMessage(): string {
  return 'धन्यवाद। आपका ऑर्डर स्वीकार कर लिया गया है। भुगतान आपके बैंक खाते में जल्द आएगा। धन्यवाद।';
}

export function buildNoResponseMessage(): string {
  return 'आपने कोई जवाब नहीं दिया। कृपया बाद में कॉल करें।';
}

export function buildErrorMessage(): string {
  return 'क्षमा करें, तकनीकी समस्या के कारण कॉल बंद हो रही है।';
}

export function buildUnrecognizedMessage(): string {
  return 'क्षमा करें, समझ नहीं आया। अलविदा।';
}
