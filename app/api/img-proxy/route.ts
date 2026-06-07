import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('missing url', { status: 400 });

  try {
    new URL(url); // validate
  } catch {
    return new NextResponse('invalid url', { status: 400 });
  }

  try {
    const upstream = await fetch(url, { headers: { 'User-Agent': 'nolimit-vitrine/1.0' } });
    if (!upstream.ok) return new NextResponse('upstream error', { status: 502 });

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new NextResponse('proxy error', { status: 502 });
  }
}
