import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const API_KEY = process.env.OPENSUBTITLES_API_KEY;
const USER_AGENT = process.env.OPENSUBTITLES_USER_AGENT || 'FoleyPlayApp v1.0';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('file_id');

  if (!fileId) return NextResponse.json({ error: 'file_id required' }, { status: 400 });
  if (!API_KEY) return NextResponse.json({ error: 'Subtitles not configured' }, { status: 503 });

  // Request download link from OpenSubtitles
  const linkRes = await fetch('https://api.opensubtitles.com/api/v1/download', {
    method: 'POST',
    headers: {
      'Api-Key': API_KEY,
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ file_id: Number(fileId), sub_format: 'webvtt' }),
  });

  if (!linkRes.ok) {
    return NextResponse.json({ error: 'Failed to get download link' }, { status: linkRes.status });
  }

  const { link } = await linkRes.json();
  const vttRes = await fetch(link);
  if (!vttRes.ok) {
    return NextResponse.json({ error: 'Failed to download subtitle file' }, { status: 502 });
  }

  const vttText = await vttRes.text();
  return new NextResponse(vttText, {
    headers: {
      'Content-Type': 'text/vtt; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
