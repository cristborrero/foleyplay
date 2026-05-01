'use client';
import TVCarousel from './TVCarousel';
import TVHero from './TVHero';

const DISCOVER = 'sort_by=popularity.desc&vote_count.gte=50&include_image_language=es,en,null';

const ROWS = [
  { title: 'Populares',           fetchUrl: '/api/tmdb/tv/popular' },
  { title: 'Mejor valoradas',     fetchUrl: '/api/tmdb/tv/top_rated' },
  { title: 'En emisión',          fetchUrl: '/api/tmdb/tv/on_the_air' },
  { title: 'Acción y Aventura',   fetchUrl: `/api/tmdb/discover/tv?with_genres=10759&${DISCOVER}` },
  { title: 'Comedia',             fetchUrl: `/api/tmdb/discover/tv?with_genres=35&${DISCOVER}` },
  { title: 'Drama',               fetchUrl: `/api/tmdb/discover/tv?with_genres=18&${DISCOVER}` },
  { title: 'Crimen y Misterio',   fetchUrl: `/api/tmdb/discover/tv?with_genres=80&${DISCOVER}` },
  { title: 'Sci-Fi y Fantasía',   fetchUrl: `/api/tmdb/discover/tv?with_genres=10765&${DISCOVER}` },
  { title: 'Animación',           fetchUrl: `/api/tmdb/discover/tv?with_genres=16&${DISCOVER}` },
  { title: 'Documental',          fetchUrl: `/api/tmdb/discover/tv?with_genres=99&${DISCOVER}` },
  { title: 'Reality',             fetchUrl: `/api/tmdb/discover/tv?with_genres=10764&${DISCOVER}` },
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
