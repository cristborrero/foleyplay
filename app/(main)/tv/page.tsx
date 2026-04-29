import ContentRow from '@/components/home/ContentRow';

export default function TVPage() {
  return (
    <div className="w-full pt-24">
      <div className="px-4 md:px-12 mb-6">
        <h1 className="text-3xl font-bold text-white">Series</h1>
      </div>

      <ContentRow title="Populares" fetchUrl="/api/tmdb/tv/popular" isLargeRow />
      <ContentRow title="Mejor Valoradas" fetchUrl="/api/tmdb/tv/top_rated" />
      <ContentRow title="En Emisión" fetchUrl="/api/tmdb/tv/on_the_air" />
      <ContentRow title="Drama" fetchUrl="/api/tmdb/discover/tv?with_genres=18" />
      <ContentRow title="Comedia" fetchUrl="/api/tmdb/discover/tv?with_genres=35" />
      <ContentRow title="Acción y Aventura" fetchUrl="/api/tmdb/discover/tv?with_genres=10759" />
      <ContentRow title="Crimen" fetchUrl="/api/tmdb/discover/tv?with_genres=80" />
      <ContentRow title="Animación" fetchUrl="/api/tmdb/discover/tv?with_genres=16" />
      <ContentRow title="Documentales" fetchUrl="/api/tmdb/discover/tv?with_genres=99" />
    </div>
  );
}
