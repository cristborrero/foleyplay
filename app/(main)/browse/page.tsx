import HeroBanner from '@/components/home/HeroBanner';
import ContentRow from '@/components/home/ContentRow';
import UserContentRow from '@/components/home/UserContentRow';

export default function BrowsePage() {
  return (
    <div className="w-full">
      <HeroBanner />

      <div className="-mt-32 relative z-20 md:-mt-40">
        {/* Filas del usuario — se ocultan automáticamente si están vacías */}
        <UserContentRow
          title="Continuar viendo"
          fetchUrl="/api/history"
          showProgress
        />
        <UserContentRow
          title="Mi Lista"
          fetchUrl="/api/watchlist"
        />

        {/* Tendencias y populares */}
        <ContentRow
          title="Tendencias Actuales"
          fetchUrl="/api/tmdb/trending/all/day"
          isLargeRow
        />
        <ContentRow
          title="Películas Populares"
          fetchUrl="/api/tmdb/movie/popular"
          mediaType="movie"
        />
        <ContentRow
          title="Series Populares"
          fetchUrl="/api/tmdb/tv/popular"
          mediaType="tv"
        />
        <ContentRow
          title="Películas Mejor Valoradas"
          fetchUrl="/api/tmdb/movie/top_rated"
          mediaType="movie"
        />
        <ContentRow
          title="Series Mejor Valoradas"
          fetchUrl="/api/tmdb/tv/top_rated"
          mediaType="tv"
        />

        {/* Películas por género */}
        <ContentRow
          title="Acción y Aventura"
          fetchUrl="/api/tmdb/discover/movie?with_genres=28"
          mediaType="movie"
        />
        <ContentRow
          title="Comedia"
          fetchUrl="/api/tmdb/discover/movie?with_genres=35"
          mediaType="movie"
        />
        <ContentRow
          title="Drama"
          fetchUrl="/api/tmdb/discover/movie?with_genres=18"
          mediaType="movie"
        />
        <ContentRow
          title="Ciencia Ficción"
          fetchUrl="/api/tmdb/discover/movie?with_genres=878"
          mediaType="movie"
        />

        {/* Series por género */}
        <ContentRow
          title="Series de Acción y Aventura"
          fetchUrl="/api/tmdb/discover/tv?with_genres=10759"
          mediaType="tv"
        />
        <ContentRow
          title="Series de Comedia"
          fetchUrl="/api/tmdb/discover/tv?with_genres=35"
          mediaType="tv"
        />
        <ContentRow
          title="Series de Drama"
          fetchUrl="/api/tmdb/discover/tv?with_genres=18"
          mediaType="tv"
        />
        <ContentRow
          title="Crimen y Misterio"
          fetchUrl="/api/tmdb/discover/tv?with_genres=80"
          mediaType="tv"
        />
        <ContentRow
          title="Ciencia Ficción y Fantasía"
          fetchUrl="/api/tmdb/discover/tv?with_genres=10765"
          mediaType="tv"
        />
        <ContentRow
          title="Animación"
          fetchUrl="/api/tmdb/discover/tv?with_genres=16"
          mediaType="tv"
        />
      </div>
    </div>
  );
}
