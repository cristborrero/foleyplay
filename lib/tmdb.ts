import { TMDBResponse, TMDBDetail, TMDBEpisode } from '@/types/tmdb';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is not configured');
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  url.searchParams.append('language', 'es-ES');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 } // Cache for 1 hour by default
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }

  return response.json();
}

export const tmdb = {
  getTrending: (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week') => 
    fetchTMDB<TMDBResponse>(`/trending/${mediaType}/${timeWindow}`),
  
  getPopular: (mediaType: 'movie' | 'tv' = 'movie', page: number = 1) => 
    fetchTMDB<TMDBResponse>(`/${mediaType}/popular`, { page: page.toString() }),
  
  getTopRated: (mediaType: 'movie' | 'tv' = 'movie', page: number = 1) => 
    fetchTMDB<TMDBResponse>(`/${mediaType}/top_rated`, { page: page.toString() }),
  
  getDetail: (mediaType: 'movie' | 'tv', id: number) =>
    fetchTMDB<TMDBDetail>(`/${mediaType}/${id}`, { append_to_response: 'credits,videos,similar,external_ids,release_dates,content_ratings' }),
    
  getSeason: (tvId: number, seasonNumber: number) => 
    fetchTMDB<{ episodes: TMDBEpisode[] }>(`/tv/${tvId}/season/${seasonNumber}`),
    
  search: (query: string, page: number = 1) => 
    fetchTMDB<TMDBResponse>('/search/multi', { query, page: page.toString() }),
    
  getDiscover: (mediaType: 'movie' | 'tv', params: Record<string, string> = {}) => 
    fetchTMDB<TMDBResponse>(`/discover/${mediaType}`, params)
};

export function extractRating(detail: TMDBDetail): string {
  if (detail.media_type === 'tv' || detail.name) {
    if (detail.content_ratings?.results) {
      const usRating = detail.content_ratings.results.find((r) => r.iso_3166_1 === 'US' && r.rating !== '');
      if (usRating) return usRating.rating;
    }
  } else {
    if (detail.release_dates?.results) {
      const usRelease = detail.release_dates.results.find((r) => r.iso_3166_1 === 'US');
      if (usRelease && usRelease.release_dates.length > 0) {
        const rated = usRelease.release_dates.find((d) => d.certification !== '');
        if (rated) return rated.certification;
      }
    }
  }
  return 'NR';
}