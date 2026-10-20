import { NextRequest, NextResponse } from 'next/server';
import { sendSensorAlertSms } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body.title || '🚨 सेंसर थ्रेशोल्ड अलर्ट';
    const description = body.description || 'खेत में सेंसर विसंगति दर्ज की गई है।';
    const phone = body.phone || '+919876543210';

    console.log('[SMS Alert API] Dispatching alert to:', phone, { title, description });

    const result = await sendSensorAlertSms(title, description, phone);

    return NextResponse.json({
      success: result.success,
      sid: result.sid,
      phone: result.phone || phone,
      simulated: result.simulated || false,
      message: result.message,
    });
  } catch (error: any) {
    console.error('[SMS Alert API] Exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
        message: 'Failed to process sensor alert SMS.',
      },
      { status: 500 }
    );
  }
}
