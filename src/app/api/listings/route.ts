import { NextRequest, NextResponse } from 'next/server';
import { getAllListings, addServerListing } from '@/lib/server-store';

export async function GET() {
  const listings = getAllListings();
  return NextResponse.json({
    success: true,
    count: listings.length,
    listings,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API /api/listings] Received new listing:', body);

    const title = body.title || body.crop || 'देसी लाल टमाटर (Tomato)';
    const lotSizeKg = Number(body.lotSizeKg || body.quantity_kg || body.qty_kg || 400);
    const buyNowPrice = Number(body.buyNowPrice || body.price_per_kg || body.expected_price_per_kg || body.base_price_per_kg || 60);
    const imageUrl = body.imageUrl || body.photo || (Array.isArray(body.photos) && body.photos[0]) || (Array.isArray(body.coin_photos) && body.coin_photos[0]) || undefined;

    const newListing = addServerListing({
      ...body,
      title,
      lotSizeKg,
      buyNowPrice,
      ...(imageUrl ? { imageUrl } : {}),
    });

    return NextResponse.json({
      success: true,
      message: 'Listing successfully recorded on KisanVaani dashboard.',
      listing: newListing,
    });
  } catch (error: any) {
    console.error('[API /api/listings] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}
