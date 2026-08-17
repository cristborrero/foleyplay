export interface SubtitleResponse {
  id: string;
  language: string;
  url: string;
}

interface OpenSubtitlesResult {
  id: string;
  attributes: {
    language: string;
    files: { file_id: number }[];
  };
}

interface OpenSubtitlesAPIResponse {
  data: OpenSubtitlesResult[];
}

export async function searchSubtitles(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number,
  language: string = 'es',
): Promise<SubtitleResponse[]> {
  const apiKey = process.env.OPENSUBTITLES_API_KEY;
  if (!apiKey) {
    console.warn('OpenSubtitles API key is not configured. Subtitle search is disabled.');
    return [];
  }

  const userAgent = process.env.OPENSUBTITLES_USER_AGENT || 'FoleyPlayApp v1.0';

  try {
    let query = `tmdb_id=${tmdbId}&languages=${language}`;
    
    if (mediaType === 'tv' && season && episode) {
      query += `&season_number=${season}&episode_number=${episode}`;
    }

    const response = await fetch(`https://api.opensubtitles.com/api/v1/subtitles?${query}`, {
      headers: {
        'Api-Key': apiKey,
        'User-Agent': userAgent,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenSubtitles API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenSubtitlesAPIResponse = await response.json();
    
    return data.data
      .filter((sub) => sub.attributes?.files?.[0]?.file_id)
      .map((sub) => ({
        id: sub.id,
        language: sub.attributes.language,
        url: `/api/subtitles/download?file_id=${sub.attributes.files[0].file_id}`
      }));
  } catch (error) {
    console.error('Error fetching subtitles:', error);
    return [];
  }
}