export interface StreamProvider {
  id: string;
  name: string;
  needsImdbId?: boolean;
  getMovieUrl: (tmdbId: number, imdbId?: string) => string;
  getTvUrl: (tmdbId: number, season: number, episode: number, imdbId?: string) => string;
}

function proxy(url: string) {
  return `/api/proxy/player?url=${encodeURIComponent(url)}`;
}

// proxy()  — HTML fetched server-side, ad-blocking script injected (only for domains that resolve server-side)
// direct   — iframe URL served straight to the browser (DNS resolves in browser but not server-side)

export const streamProviders: StreamProvider[] = [
  // ── DIRECT (browser resolves DNS) ───────────────────────────────────────
  {
    id: 'unlimplay',
    name: 'UnlimPlay',
    getMovieUrl: (tmdbId) => `https://unlimplay.com/play/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://unlimplay.com/play/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'vidlink',
    name: 'VidLink',
    getMovieUrl: (tmdbId) => `https://vidlink.pro/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
  },
  // ── PROXIED (ad-blocking active) ────────────────────────────────────────
  {
    id: '2embed',
    name: '2Embed',
    getMovieUrl: (tmdbId) => proxy(`https://www.2embed.cc/embed/${tmdbId}`),
    getTvUrl: (tmdbId, season, episode) => proxy(`https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`),
  },
  {
    id: 'streamimdb',
    name: 'StreamIMDb',
    needsImdbId: true,
    getMovieUrl: (tmdbId, imdbId) => proxy(imdbId ? `https://streamimdb.me/embed/${imdbId}` : `https://www.2embed.cc/embed/${tmdbId}`),
    getTvUrl: (tmdbId, season, episode, imdbId) => proxy(imdbId ? `https://streamimdb.me/embed/${imdbId}?s=${season}&e=${episode}` : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`),
  },
  // ── DIRECT fallbacks ─────────────────────────────────────────────────────
  {
    id: 'embedsu',
    name: 'Embed.su',
    getMovieUrl: (tmdbId) => `https://embed.su/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, season, episode) => `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
  },
];

export function getDefaultProvider(): StreamProvider {
  return streamProviders[0];
}
