import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, addServerOrder, updateServerOrderStatus } from '@/lib/server-store';
import { sendOrderPlacedSms } from '@/lib/twilio';

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({
    success: true,
    count: orders.length,
    orders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API /api/orders] Received new order:', body);

    const orderId = body.id || `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const cropName = body.cropName || body.crop_name || 'देसी लाल टमाटर (Grade A)';
    const quantityKg = Number(body.quantityKg || body.quantity_kg || 400);
    const totalValue = Number(body.totalValue || body.total_price || 24000);
    const passcode = body.passcode || '4829';
    const farmerPhone = body.farmerPhone || body.farmer_phone || '+919876543210';

    const newOrder = addServerOrder({
      id: orderId,
      cropName,
      quantityKg,
      farmerName: body.farmerName || 'रामेश कुमार (+919876543210)',
      farmerLocation: body.farmerLocation || 'Sonipat Cluster, Haryana',
      totalValue,
      escrowStatus: 'ACCEPTED',
      escrowStatusLabel: 'Accepted by Farmer',
      orderedAt: 'Just Now',
      eta: 'Reefer Dispatch in Progress (ETA: 4h)',
      passcode,
      temperatureC: 12,
    });

    // Trigger Twilio SMS alert to the farmer's mobile number
    try {
      sendOrderPlacedSms(
        orderId,
        cropName,
        String(quantityKg),
        String(totalValue),
        farmerPhone,
        passcode
      ).catch((err) => console.warn('[API /api/orders] Twilio SMS note:', err));
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} registered. SMS dispatched to ${farmerPhone}.`,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('[API /api/orders] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Missing orderId or status' }, { status: 400 });
    }

    const updated = updateServerOrderStatus(orderId, status);
    return NextResponse.json({
      success: true,
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
