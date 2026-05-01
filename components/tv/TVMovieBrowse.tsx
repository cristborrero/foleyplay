'use client';
import TVCarousel from './TVCarousel';
import TVHero from './TVHero';

const DISCOVER = 'sort_by=popularity.desc&vote_count.gte=50&include_image_language=es,en,null';

const ROWS = [
  { title: 'Populares',       fetchUrl: '/api/tmdb/movie/popular' },
  { title: 'Mejor valoradas', fetchUrl: '/api/tmdb/movie/top_rated' },
  { title: 'Estrenos',        fetchUrl: '/api/tmdb/movie/now_playing' },
  { title: 'Acción',          fetchUrl: `/api/tmdb/discover/movie?with_genres=28&${DISCOVER}` },
  { title: 'Comedia',         fetchUrl: `/api/tmdb/discover/movie?with_genres=35&${DISCOVER}` },
  { title: 'Terror',          fetchUrl: `/api/tmdb/discover/movie?with_genres=27&${DISCOVER}` },
  { title: 'Drama',           fetchUrl: `/api/tmdb/discover/movie?with_genres=18&${DISCOVER}` },
  { title: 'Ciencia Ficción', fetchUrl: `/api/tmdb/discover/movie?with_genres=878&${DISCOVER}` },
  { title: 'Animación',       fetchUrl: `/api/tmdb/discover/movie?with_genres=16&${DISCOVER}` },
  { title: 'Romance',         fetchUrl: `/api/tmdb/discover/movie?with_genres=10749&${DISCOVER}` },
  { title: 'Thriller',        fetchUrl: `/api/tmdb/discover/movie?with_genres=53&${DISCOVER}` },
];

export default function TVMovieBrowse() {
  return (
    <div className="flex-1 h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      <TVHero />
      <div className="py-6">
        {ROWS.map(({ title, fetchUrl }) => (
          <TVCarousel key={fetchUrl} title={title} fetchUrl={fetchUrl} mediaType="movie" />
        ))}
      </div>
    </div>
  );
}
