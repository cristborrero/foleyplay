'use client';
import TVCarousel from './TVCarousel';
import TVHero from './TVHero';

const ROWS = [
  { title: 'Populares',           fetchUrl: '/api/tmdb/tv/popular' },
  { title: 'Mejor valoradas',     fetchUrl: '/api/tmdb/tv/top_rated' },
  { title: 'Acción y Aventura',   fetchUrl: '/api/tmdb/discover/tv?with_genres=10759' },
  { title: 'Comedia',             fetchUrl: '/api/tmdb/discover/tv?with_genres=35' },
  { title: 'Drama',               fetchUrl: '/api/tmdb/discover/tv?with_genres=18' },
  { title: 'Crimen y Misterio',   fetchUrl: '/api/tmdb/discover/tv?with_genres=80' },
  { title: 'Sci-Fi y Fantasía',   fetchUrl: '/api/tmdb/discover/tv?with_genres=10765' },
  { title: 'Animación',           fetchUrl: '/api/tmdb/discover/tv?with_genres=16' },
  { title: 'Documental',          fetchUrl: '/api/tmdb/discover/tv?with_genres=99' },
  { title: 'Reality',             fetchUrl: '/api/tmdb/discover/tv?with_genres=10764' },
];

export default function TVShowBrowse() {
  return (
    <div className="flex-1 h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <TVHero />
      <div className="py-6">
        {ROWS.map(({ title, fetchUrl }) => (
          <TVCarousel key={fetchUrl} title={title} fetchUrl={fetchUrl} mediaType="tv" />
        ))}
      </div>
    </div>
  );
}
