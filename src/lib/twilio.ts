import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.warn(
    '[Twilio] Warning: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER is not set in environment variables.'
  );
}

// Initialize Twilio REST client
export const twilioClient = twilio(accountSid || 'AC_placeholder', authToken || 'token_placeholder');

/**
 * Initiates an automated Voice IVR call to the farmer for order confirmation in Hindi/Punjabi.
 *
 * @param farmerPhoneNumber - The farmer's recipient phone number (E.164 format, e.g. +919812477102)
 * @param orderId - The unique ID of the placed order (e.g. #ORD-8821)
 * @param cropName - Name of the crop (e.g. "Hybrid Red Bell Peppers")
 * @param quantity - Quantity in kilograms (e.g. "400")
 * @param totalPrice - Total payable order amount in rupees (e.g. "11200")
 */
export async function sendOrderConfirmationCall(
  farmerPhoneNumber: string,
  orderId: string,
  cropName: string,
  quantity: string,
  totalPrice: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app';

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.warn('[Twilio Voice] Missing credentials in environment, returning simulated voice call response.');
    return {
      success: true,
      simulated: true,
      callSid: `SIM_CALL_${Date.now()}`,
      message: 'Simulated voice call (Twilio credentials pending in environment variables)',
    };
  }

  // Attach order parameters so the voice TwiML webhook can pronounce the specific details
  const params = new URLSearchParams({
    orderId,
    cropName,
    quantity,
    totalPrice,
  });

  const webhookUrl = `${baseUrl}/api/twilio/voice?${params.toString()}`;

  console.log('[Twilio] Initiating voice order confirmation call:', {
    to: farmerPhoneNumber,
    from: twilioPhoneNumber,
    orderId,
    webhookUrl,
  });

  try {
    const call = await twilioClient.calls.create({
      to: farmerPhoneNumber,
      from: twilioPhoneNumber,
      url: webhookUrl,
      method: 'POST',
    });

    console.log('[Twilio] Call initiated successfully. Call SID:', call.sid);
    return { success: true, callSid: call.sid };
  } catch (error: any) {
    console.error('[Twilio] Error dispatching voice call:', error);
    throw new Error(`Twilio Call Failed: ${error.message || error}`);
  }
}

/**
 * Dispatches an automated SMS alert to the farmer/admin when sensor thresholds breach.
 * Default target phone number: +919876543210
 *
 * @param title - Alert headline (e.g. "🚨 खेत में अत्यधिक नमी (हाइपोक्सिया)")
 * @param description - Alert details & actionable remediation
 * @param targetPhone - Phone number to notify (default: +919876543210)
 */
export async function sendSensorAlertSms(
  title: string,
  description: string,
  targetPhone: string = '+919876543210'
) {
  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.warn('[Twilio SMS] Missing credentials in environment, returning simulated SMS dispatch.');
    return {
      success: true,
      simulated: true,
      sid: `SIM_SMS_${Date.now()}`,
      phone: targetPhone,
      message: `[Simulated SMS to ${targetPhone}]: ${title} - ${description}`,
    };
  }

  // Twilio Trial Accounts strictly reject long multi-segment messages with Error 30044.
  // Using concise Hindi text under 60-70 Unicode chars delivers cleanly within 2 segments.
  const lower = (title + ' ' + description).toLowerCase();
  let hindiAlert = '';

  if (lower.includes('hypoxia') || lower.includes('जलभराव') || lower.includes('सड़न') || lower.includes('नमी अधिक')) {
    hindiAlert = 'किसानवाणी अलर्ट: जलभराव! खेत में नमी अधिक है, मोटर तुरंत बंद करें।';
  } else if (lower.includes('drought') || lower.includes('सूखा') || lower.includes('कम नमी') || lower.includes('पानी')) {
    hindiAlert = 'किसानवाणी अलर्ट: सूखा तनाव! खेत में नमी कम है, तुरंत सिंचाई करें।';
  } else if (lower.includes('nitrogen') || lower.includes('नाइट्रोजन') || lower.includes('यूरिया')) {
    if (lower.includes('excess') || lower.includes('विषाक्तता') || lower.includes('अधिक')) {
      hindiAlert = 'किसानवाणी अलर्ट: अत्यधिक नाइट्रोजन! रासायनिक खाद तुरंत रोक दें।';
    } else {
      hindiAlert = 'किसानवाणी अलर्ट: नाइट्रोजन कमी! यूरिया या जीवामृत का छिड़काव करें।';
    }
  } else if (lower.includes('phosphorus') || lower.includes('फास्फोरस')) {
    hindiAlert = 'किसानवाणी अलर्ट: फास्फोरस कमी! जड़ विकास हेतु डीएपी या SSP खाद दें।';
  } else if (lower.includes('potassium') || lower.includes('पोटाश')) {
    hindiAlert = 'किसानवाणी अलर्ट: पोटाश कमी! फल चमक व मिठास हेतु 00:00:50 छिड़कें।';
  } else {
    // Concise fallback in Hindi
    const cleanTitle = title.replace(/[\u{1F600}-\u{1F6FF}|[\u{2600}-\u{26FF}]/gu, '').trim();
    hindiAlert = `किसानवाणी अलर्ट: ${cleanTitle.slice(0, 25)} - खेत की तुरंत जांच करें।`;
  }

  try {
    const message = await twilioClient.messages.create({
      body: hindiAlert,
      to: targetPhone,
      from: twilioPhoneNumber,
    });

    console.log('[Twilio SMS] Hindi alert dispatched successfully to', targetPhone, 'SID:', message.sid);
    return {
      success: true,
      sid: message.sid,
      phone: targetPhone,
      message: hindiAlert,
    };
  } catch (error: any) {
    console.error('[Twilio SMS] Error dispatching SMS:', error);
    return {
      success: false,
      error: error.message || String(error),
      phone: targetPhone,
      message: `Twilio SMS dispatch failed: ${error.message || error}`,
    };
  }
}

/**
 * Initiates an automated Voice IVR call to the farmer so they can list their vegetable/crop
 * verbally in Hindi/regional language without internet.
 *
 * @param farmerPhoneNumber - The farmer's recipient phone number (E.164 format, default: +919876543210)
 */
export async function initiateOfflineListingCall(
  farmerPhoneNumber: string = '+919876543210'
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kisanvaani-eight.vercel.app';

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.warn('[Twilio Offline Call] Missing credentials, returning simulated call.');
    return {
      success: true,
      simulated: true,
      callSid: `SIM_IVR_${Date.now()}`,
      phone: farmerPhoneNumber,
      message: `Simulated offline listing IVR call initiated to ${farmerPhoneNumber}`,
    };
  }

  const webhookUrl = `${baseUrl}/api/twilio/offline-listing/voice`;

  console.log('[Twilio Offline Call] Initiating outbound voice call for verbal listing:', {
    to: farmerPhoneNumber,
    from: twilioPhoneNumber,
    webhookUrl,
  });

  try {
    const call = await twilioClient.calls.create({
      to: farmerPhoneNumber,
      from: twilioPhoneNumber,
      url: webhookUrl,
      method: 'POST',
    });

    console.log('[Twilio Offline Call] Call successfully dispatched. SID:', call.sid);
    return { success: true, callSid: call.sid, phone: farmerPhoneNumber };
  } catch (error: any) {
    console.error('[Twilio Offline Call] Error initiating voice call:', error);
    return {
      success: false,
      error: error.message || String(error),
      phone: farmerPhoneNumber,
      message: `Twilio Call Failed: ${error.message || error}`,
    };
  }
}

/**
 * Dispatches an automated SMS alert to the farmer when an order is placed on the Mandi portal.
 * Default target phone number: +919876543210
 *
 * @param orderId - Order identifier (e.g. #ORD-4921)
 * @param cropName - Name of the commodity
 * @param quantityKg - Order quantity in kg
 * @param totalPrice - Total payable amount in rupees
 * @param targetPhone - Farmer mobile number (default: +919876543210)
 * @param passcode - Digital gate handover passcode (default: 4829)
 */
export async function sendOrderPlacedSms(
  orderId: string,
  cropName: string,
  quantityKg: number | string,
  totalPrice: number | string,
  targetPhone: string = '+919876543210',
  passcode: string = '4829'
) {
  const timestamp = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.warn('[Twilio SMS] Missing credentials in environment, returning simulated order SMS.');
    return {
      success: true,
      simulated: true,
      sid: `SIM_SMS_${Date.now()}`,
      phone: targetPhone,
      message: `[Simulated Order SMS to ${targetPhone}]: Order ${orderId} placed for ${cropName}`,
    };
  }

  // Concise Hindi order confirmation SMS under 70 Unicode chars for reliable Twilio trial delivery
  const cleanCrop = cropName.replace(/[\u{1F600}-\u{1F6FF}|[\u{2600}-\u{26FF}]/gu, '').trim();
  const messageBody = `किसानवाणी आर्डर: ${cleanCrop} ${quantityKg}किग्रा (₹${totalPrice}) बुक हुआ। गेट पास पिन: ${passcode}`;

  try {
    const message = await twilioClient.messages.create({
      body: messageBody,
      to: targetPhone,
      from: twilioPhoneNumber,
    });

    console.log('[Twilio SMS] Order alert SMS dispatched successfully to', targetPhone, 'SID:', message.sid);
    return {
      success: true,
      sid: message.sid,
      phone: targetPhone,
      message: messageBody,
    };
  } catch (error: any) {
    console.error('[Twilio SMS] Error dispatching order SMS:', error);
    return {
      success: false,
      error: error.message || String(error),
      phone: targetPhone,
      message: `Twilio Order SMS failed: ${error.message || error}`,
    };
  }
}

