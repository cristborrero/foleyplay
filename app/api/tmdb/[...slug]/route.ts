import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
  }

  try {
    const { slug } = await params;
    const endpoint = `/${slug.join('/')}`;
    const searchParams = request.nextUrl.searchParams;
    
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    
    // Default to Spanish unless specified otherwise
    if (!searchParams.has('language')) {
      url.searchParams.append('language', 'es-ES');
    }
    
    searchParams.forEach((value, key) => {
      if (key !== 'api_key') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 } // Proxy caches for 1 hour
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Inject media_type if it's a list response and missing
    if (data.results && Array.isArray(data.results)) {
      let inferredType: 'movie' | 'tv' | null = null;
      
      if (slug[0] === 'movie' || (slug[0] === 'discover' && slug[1] === 'movie') || (slug[0] === 'trending' && slug[1] === 'movie')) {
        inferredType = 'movie';
      } else if (slug[0] === 'tv' || (slug[0] === 'discover' && slug[1] === 'tv') || (slug[0] === 'trending' && slug[1] === 'tv')) {
        inferredType = 'tv';
      }

      if (inferredType) {
        data.results = data.results.map((item: { media_type?: string }) => ({
          ...item,
          media_type: item.media_type || inferredType
        }));
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}