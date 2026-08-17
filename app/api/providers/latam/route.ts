import { NextRequest, NextResponse } from 'next/server';
import { tmdb } from '@/lib/tmdb';

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tmdbId = searchParams.get('tmdbId');
  const queryTitle = searchParams.get('title');
  const mediaType = (searchParams.get('mediaType') || 'movie') as 'movie' | 'tv';

  let titlesToTry: string[] = [];

  if (tmdbId) {
    try {
      const detail = await tmdb.getDetail(mediaType, Number(tmdbId));
      if (detail) {
        if (detail.title) titlesToTry.push(detail.title);
        if (detail.name) titlesToTry.push(detail.name);
        if (detail.original_title) titlesToTry.push(detail.original_title);
        if (detail.original_name) titlesToTry.push(detail.original_name);
      }
    } catch (err) {
      console.error('Error fetching TMDB detail in latam provider:', err);
    }
  }

  if (queryTitle) {
    titlesToTry.unshift(queryTitle);
  }

  // Deduplicate slugs
  const slugs = Array.from(new Set(titlesToTry.map(t => slugify(t)).filter(Boolean)));

  if (slugs.length === 0) {
    return NextResponse.json({ status: 'error', message: 'No valid title provided' }, { status: 400 });
  }

  for (const slug of slugs) {
    try {
      const targetUrl = `https://zonaaps.com/movies/${slug}/`;
      const apiUrl = `https://apizonalatamsrc.xzod.cloud/extract?url=${encodeURIComponent(targetUrl)}`;
      
      const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.status === 'success' && data.streams && data.streams.length > 0) {
        const hlsStream = data.streams.find((s: any) => s.type === 'hls' && s.url) || data.streams[0];
        const trace = data.resolutionTrace?.[0];

        return NextResponse.json({
          status: 'success',
          provider: 'ZonaAPI Latam',
          title: data.title,
          streamUrl: hlsStream?.url || null,
          embedUrl: trace?.embedFinalUrl || trace?.embedUrl || null,
          poster: data.poster,
          rating: data.rating,
        });
      }
    } catch (err) {
      console.error(`Error attempting extract for slug ${slug}:`, err);
    }
  }

  return NextResponse.json(
    { status: 'not_found', message: 'No direct Latin stream found for this title' },
    { status: 404 }
  );
}
