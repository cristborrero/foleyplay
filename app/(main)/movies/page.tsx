import ContentRow from '@/components/home/ContentRow';

export default function MoviesPage() {
  return (
    <div className="w-full pt-20 sm:pt-24">
      <div className="px-3 sm:px-4 md:px-12 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Películas</h1>
      </div>

      <ContentRow title="Populares" fetchUrl="/api/tmdb/movie/popular" isLargeRow />
      <ContentRow title="Mejor Valoradas" fetchUrl="/api/tmdb/movie/top_rated" />
      <ContentRow title="Acción y Aventura" fetchUrl="/api/tmdb/discover/movie?with_genres=28" />
      <ContentRow title="Comedia" fetchUrl="/api/tmdb/discover/movie?with_genres=35" />
      <ContentRow title="Drama" fetchUrl="/api/tmdb/discover/movie?with_genres=18" />
      <ContentRow title="Ciencia Ficción" fetchUrl="/api/tmdb/discover/movie?with_genres=878" />
      <ContentRow title="Terror" fetchUrl="/api/tmdb/discover/movie?with_genres=27" />
      <ContentRow title="Animación" fetchUrl="/api/tmdb/discover/movie?with_genres=16" />
      <ContentRow title="Documentales" fetchUrl="/api/tmdb/discover/movie?with_genres=99" />
    </div>
  );
}
