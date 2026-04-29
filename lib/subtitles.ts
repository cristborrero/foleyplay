const OPENSUBTITLES_API_KEY = process.env.OPENSUBTITLES_API_KEY;
const OPENSUBTITLES_USER_AGENT = process.env.OPENSUBTITLES_USER_AGENT || 'NetflixCloneApp v1.0';

export interface SubtitleResponse {
  id: string;
  language: string;
  url: string;
}

export async function searchSubtitles(tmdbId: number, mediaType: 'movie' | 'tv', season?: number, episode?: number, language: string = 'es'): Promise<SubtitleResponse[]> {
  if (!OPENSUBTITLES_API_KEY) {
    console.warn('OpenSubtitles API key is not configured. Subtitle search is disabled.');
    return [];
  }

  try {
    let query = `tmdb_id=${tmdbId}&languages=${language}`;
    
    if (mediaType === 'tv' && season && episode) {
      query += `&season_number=${season}&episode_number=${episode}`;
    }

    const response = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?${query}`, {
      headers: {
        'Api-Key': OPENSUBTITLES_API_KEY,
        'User-Agent': OPENSUBTITLES_USER_AGENT,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subtitles');
    }

    const data = await response.json();
    
    // Process and return top results
    // NOTE: This usually returns file references. A download request must be made to get the actual .srt/.vtt file URL.
    return data.data.map((sub: any) => ({
      id: sub.id,
      language: sub.attributes.language,
      url: `/api/subtitles/download?file_id=${sub.attributes.files[0].file_id}` // Proxy route to download and convert to VTT if necessary
    }));
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    return [];
  }
}