import ContentRow from '@/components/home/ContentRow';
import UserContentRow from '@/components/home/UserContentRow';

export const metadata = { title: 'Películas | FoleyPlay' };

export default function MoviesPage() {
  return (
    <div className="w-full pt-24">
      <UserContentRow title="Mi Lista — Películas" fetchUrl="/api/watchlist?type=movie" />

      <ContentRow title="Películas Populares" fetchUrl="/api/tmdb/movie/popular" mediaType="movie" isLargeRow />
      <ContentRow title="Películas Mejor Valoradas" fetchUrl="/api/tmdb/movie/top_rated" mediaType="movie" />
      <ContentRow title="Novedades en Cines" fetchUrl="/api/tmdb/movie/now_playing" mediaType="movie" />
      <ContentRow title="Próximos Estrenos" fetchUrl="/api/tmdb/movie/upcoming" mediaType="movie" />
      <ContentRow title="Acción y Aventura" fetchUrl="/api/tmdb/discover/movie?with_genres=28" mediaType="movie" />
      <ContentRow title="Comedia" fetchUrl="/api/tmdb/discover/movie?with_genres=35" mediaType="movie" />
      <ContentRow title="Drama" fetchUrl="/api/tmdb/discover/movie?with_genres=18" mediaType="movie" />
      <ContentRow title="Ciencia Ficción" fetchUrl="/api/tmdb/discover/movie?with_genres=878" mediaType="movie" />
      <ContentRow title="Terror" fetchUrl="/api/tmdb/discover/movie?with_genres=27" mediaType="movie" />
      <ContentRow title="Animación" fetchUrl="/api/tmdb/discover/movie?with_genres=16" mediaType="movie" />
    </div>
  );
}
