import { NextRequest, NextResponse } from 'next/server';
import { searchSubtitles } from '@/lib/subtitles';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tmdbId = Number(searchParams.get('tmdbId'));
  const mediaType = searchParams.get('mediaType') as 'movie' | 'tv';
  const season = searchParams.get('season') ? Number(searchParams.get('season')) : undefined;
  const episode = searchParams.get('episode') ? Number(searchParams.get('episode')) : undefined;
  const language = searchParams.get('language') || 'es';

  if (!tmdbId || !mediaType) {
    return NextResponse.json({ error: 'tmdbId and mediaType are required' }, { status: 400 });
  }

  const subtitles = await searchSubtitles(tmdbId, mediaType, season, episode, language);
  return NextResponse.json({ subtitles });
}
