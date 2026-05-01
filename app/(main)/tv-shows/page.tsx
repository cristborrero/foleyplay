import ContentRow from '@/components/home/ContentRow';
import UserContentRow from '@/components/home/UserContentRow';

export const metadata = { title: 'Series | FoleyPlay' };

export default function TVShowsPage() {
  return (
    <div className="w-full pt-24">
      <UserContentRow title="Mi Lista — Series" fetchUrl="/api/watchlist?type=tv" />

      <ContentRow title="Series Populares" fetchUrl="/api/tmdb/tv/popular" mediaType="tv" isLargeRow />
      <ContentRow title="Series Mejor Valoradas" fetchUrl="/api/tmdb/tv/top_rated" mediaType="tv" />
      <ContentRow title="En Emisión Ahora" fetchUrl="/api/tmdb/tv/on_the_air" mediaType="tv" />
      <ContentRow title="Próximos Estrenos" fetchUrl="/api/tmdb/tv/airing_today" mediaType="tv" />
      <ContentRow title="Acción y Aventura" fetchUrl="/api/tmdb/discover/tv?with_genres=10759" mediaType="tv" />
      <ContentRow title="Comedia" fetchUrl="/api/tmdb/discover/tv?with_genres=35" mediaType="tv" />
      <ContentRow title="Drama" fetchUrl="/api/tmdb/discover/tv?with_genres=18" mediaType="tv" />
      <ContentRow title="Crimen y Misterio" fetchUrl="/api/tmdb/discover/tv?with_genres=80" mediaType="tv" />
      <ContentRow title="Ciencia Ficción y Fantasía" fetchUrl="/api/tmdb/discover/tv?with_genres=10765" mediaType="tv" />
      <ContentRow title="Animación" fetchUrl="/api/tmdb/discover/tv?with_genres=16" mediaType="tv" />
    </div>
  );
}
