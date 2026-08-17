export interface StreamProvider {
  id: string;
  name: string;
  needsImdbId?: boolean;
  isLatam?: boolean;
  getMovieUrl: (tmdbId: number, imdbId?: string) => string;
  getTvUrl: (tmdbId: number, season: number, episode: number, imdbId?: string) => string;
}

export const streamProviders: StreamProvider[] = [
  // ── 1. DEFAULT (Multi-audio & broad catalog) ─────────────────────────────
  {
    id: 'unlimplay',
    name: 'UnlimPlay',
    getMovieUrl: (tmdbId) => `https://unlimplay.com/play/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://unlimplay.com/play/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  // ── 2. LATINO DIRECTO HLS ────────────────────────────────────────────────
  {
    id: 'latam-direct',
    name: 'Latino Directo (HLS)',
    isLatam: true,
    getMovieUrl: (tmdbId) => `/api/providers/latam/player?tmdbId=${tmdbId}&mediaType=movie`,
    getTvUrl: (tmdbId, season, episode) => `/api/providers/latam/player?tmdbId=${tmdbId}&mediaType=tv`,
  },
  // ── 3. DIRECT (VidLink & VidSrc) ─────────────────────────────────────────
  {
    id: 'vidlink',
    name: 'VidLink',
    getMovieUrl: (tmdbId) => `https://vidlink.pro/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidsrc',
    name: 'VidSrc',
    getMovieUrl: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    getMovieUrl: (tmdbId) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId, season, episode) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  },
  // ── DIRECT fallbacks ─────────────────────────────────────────────────────
  {
    id: 'vidsrcsu',
    name: 'VidSrc.su',
    needsImdbId: true,
    getMovieUrl: (tmdbId, imdbId) => imdbId ? `https://vidsrc.su/embed/movie/${imdbId}` : `https://vidsrc.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode, imdbId) => imdbId ? `https://vidsrc.su/embed/tv/${imdbId}/${season}/${episode}` : `https://vidsrc.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
];

export function getDefaultProvider(): StreamProvider {
  return streamProviders[0];
}
