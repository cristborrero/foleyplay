'use client';

import TVCarousel from './TVCarousel';
import TVUserCarousel from './TVUserCarousel';
import TVFocusManager from './TVFocusManager';

const ROWS = [
  { title: 'Tendencias',             fetchUrl: '/api/tmdb/trending/all/day' },
  { title: 'Películas Populares',    fetchUrl: '/api/tmdb/movie/popular' },
  { title: 'Series Populares',       fetchUrl: '/api/tmdb/tv/popular',          mediaType: 'tv' as const },
  { title: 'Mejor Valoradas',        fetchUrl: '/api/tmdb/movie/top_rated' },
  { title: 'Series Mejor Valoradas', fetchUrl: '/api/tmdb/tv/top_rated',         mediaType: 'tv' as const },
  { title: 'Acción y Aventura',      fetchUrl: '/api/tmdb/movie/28' },
  { title: 'Comedia',                fetchUrl: '/api/tmdb/movie/35' },
  { title: 'Drama',                  fetchUrl: '/api/tmdb/movie/18' },
  { title: 'Ciencia Ficción',        fetchUrl: '/api/tmdb/movie/878' },
  { title: 'Series de Acción',       fetchUrl: '/api/tmdb/tv/10759',             mediaType: 'tv' as const },
  { title: 'Series de Drama',        fetchUrl: '/api/tmdb/tv/18',                mediaType: 'tv' as const },
  { title: 'Crimen y Misterio',      fetchUrl: '/api/tmdb/tv/80',                mediaType: 'tv' as const },
];

export default function TVBrowse() {
  return (
    <div className="flex-1 h-full overflow-y-auto py-6" style={{ scrollbarWidth: 'none' }}>
      <TVFocusManager />
      <TVUserCarousel title="Continuar viendo" fetchUrl="/api/history" />
      <TVUserCarousel title="Mi lista"          fetchUrl="/api/watchlist" />
      {ROWS.map(({ title, fetchUrl, mediaType }) => (
        <TVCarousel key={fetchUrl} title={title} fetchUrl={fetchUrl} mediaType={mediaType} />
      ))}
    </div>
  );
}
