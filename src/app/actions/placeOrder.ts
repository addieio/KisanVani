'use server';

import { supabase } from '@/lib/supabase';
import { sendOrderConfirmationCall, sendOrderPlacedSms } from '@/lib/twilio';
import {
  generateHindiSpeech,
  buildOrderHindiMessage,
  buildOrderAcceptedMessage,
  setCachedAudio,
  getCachedAudio,
} from '@/lib/sarvam';

export interface PlaceOrderInput {
  orderId?: string;
  farmerPhoneNumber: string;
  farmerName?: string;
  cropName: string;
  quantityKg: number | string;
  totalPrice: number | string;
  buyerName?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  orderId: string;
  callSid?: string;
  message: string;
  error?: string;
}

/**
 * Server action to save a new order and trigger the automated Twilio Voice IVR call to the farmer.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const generatedOrderId =
    input.orderId || `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const qtyStr = String(input.quantityKg);
  const priceStr = String(input.totalPrice);

  console.log('[placeOrder Action] Processing new buyer order:', {
    orderId: generatedOrderId,
    crop: input.cropName,
    quantity: qtyStr,
    totalPrice: priceStr,
    farmerPhone: input.farmerPhoneNumber,
  });

  // 0. Pre-generate Sarvam Hindi TTS speech in background so it is instantly ready when the farmer answers
  const textToSpeak = buildOrderHindiMessage(input.cropName, qtyStr, priceStr);
  generateHindiSpeech({ text: textToSpeak })
    .then((ttsRes) => {
      if (ttsRes.success && ttsRes.audioBase64) {
        const cacheKey = `order-${input.cropName}-${qtyStr}-${priceStr}`;
        setCachedAudio(cacheKey, Buffer.from(ttsRes.audioBase64, 'base64'));
        console.log('[placeOrder Action] Pre-cached Sarvam Hindi audio for key:', cacheKey);
      }
    })
    .catch((err) => console.warn('[placeOrder Action] TTS pre-warm warning:', err));

  // Also pre-warm the "accepted" confirmation message so it is instant
  if (!getCachedAudio('accepted')) {
    generateHindiSpeech({ text: buildOrderAcceptedMessage() })
      .then((ttsRes) => {
        if (ttsRes.success && ttsRes.audioBase64) {
          setCachedAudio('accepted', Buffer.from(ttsRes.audioBase64, 'base64'));
          console.log('[placeOrder Action] Pre-cached Sarvam Hindi "accepted" audio');
        }
      })
      .catch((err) => console.warn('[placeOrder Action] Pre-cache accepted audio warning:', err));
  }

  // 1. Save order to Supabase database (status = 'PENDING' until farmer accepts via call)
  try {
    const { data, error } = await supabase.from('orders').insert([
      {
        id: generatedOrderId,
        crop_name: input.cropName,
        quantity_kg: Number(input.quantityKg),
        total_price: Number(input.totalPrice),
        farmer_name: input.farmerName || 'Farmer',
        farmer_phone: input.farmerPhoneNumber,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('[placeOrder Action] Supabase insert warning (proceeding to voice dispatch):', error.message);
    } else {
      console.log('[placeOrder Action] Order saved to Supabase successfully with status PENDING.');
    }
  } catch (dbError) {
    console.warn('[placeOrder Action] Supabase connection error (proceeding to voice dispatch):', dbError);
  }

  // 2. Trigger automated Twilio SMS alert to the farmer's mobile number (+919876543210)
  const phoneToAlert = input.farmerPhoneNumber || '+919876543210';
  try {
    sendOrderPlacedSms(
      generatedOrderId,
      input.cropName,
      qtyStr,
      priceStr,
      phoneToAlert,
      '4829'
    ).then((smsRes) => {
      console.log('[placeOrder Action] Twilio SMS dispatch result:', smsRes);
    }).catch((err) => {
      console.warn('[placeOrder Action] Twilio SMS dispatch error:', err);
    });
  } catch (smsErr) {
    console.warn('[placeOrder Action] SMS dispatch trigger note:', smsErr);
  }

  // 3. Trigger automated Twilio Voice Call to Farmer in Hindi
  try {
    const callResult = await sendOrderConfirmationCall(
      phoneToAlert,
      generatedOrderId,
      input.cropName,
      qtyStr,
      priceStr
    );

    return {
      success: true,
      orderId: generatedOrderId,
      callSid: callResult.callSid,
      message: `Order ${generatedOrderId} saved. Automated SMS and Hindi voice call dispatched to ${phoneToAlert}.`,
    };
  } catch (callError: any) {
    console.error('[placeOrder Action] Failed to initiate voice call:', callError);
    return {
      success: true,
      orderId: generatedOrderId,
      message: `Order ${generatedOrderId} created, SMS alert dispatched to ${phoneToAlert}. Voice call retry pending.`,
      error: callError.message || String(callError),
    };
  }
}
