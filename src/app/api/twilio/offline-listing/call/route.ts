import { NextRequest, NextResponse } from 'next/server';
import { initiateOfflineListingCall } from '@/lib/twilio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = body.phone || '+919876543210';

    console.log('[Offline Listing Call API] Triggering call to:', phone);

    const result = await initiateOfflineListingCall(phone);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[Offline Listing Call API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
        message: 'Failed to initiate offline listing call.',
      },
      { status: 500 }
    );
  }
}
