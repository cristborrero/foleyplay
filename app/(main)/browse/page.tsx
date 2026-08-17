import HeroBanner from '@/components/home/HeroBanner';
import DiscoverySection from '@/components/home/DiscoverySection';
import ContentRow from '@/components/home/ContentRow';
import UserContentRow from '@/components/home/UserContentRow';
import TopTenRow from '@/components/home/TopTenRow';
import EditorialSpotlight from '@/components/home/EditorialSpotlight';

export const metadata = {
  title: 'FoleyPlay — Descubre y reproduce películas, series y TV',
  description: 'Plataforma premium de descubrimiento de entretenimiento. Películas, series aclamadas y canales en vivo sin límites.',
};

export default function BrowsePage() {
  return (
    <div className="w-full pb-16">
      {/* 1. Cinematic Hero */}
      <HeroBanner />

      {/* 2. Interactive Discovery Section (Strip + Dynamic Feed or Full Catalog) */}
      <DiscoverySection>
        {/* 3. User Library (History & Watchlist if active) */}
        <UserContentRow title="Continuar viendo" type="history" showProgress />
        <UserContentRow title="Mi Lista" type="watchlist" />

        {/* 4. Trending Rail */}
        <ContentRow
          title="Tendencias Ahora"
          subtitle="Lo más comentado y reproducido de la semana"
          fetchUrl="/api/tmdb/trending/all/day"
          seeAllHref="/movies"
          isLargeRow
        />

        {/* 5. Top 10 Numbered Pattern */}
        <TopTenRow
          title="Top 10 en FoleyPlay"
          fetchUrl="/api/tmdb/trending/all/day"
        />

        {/* 6. Popular Movies */}
        <ContentRow
          title="Películas Populares"
          subtitle="Los éxitos de taquilla del momento"
          fetchUrl="/api/tmdb/movie/popular"
          mediaType="movie"
          seeAllHref="/movies"
        />

        {/* 7. Editorial Spotlight: Best of Cinema */}
        <EditorialSpotlight
          title="Joya Cinematográfica"
          subtitle="Grandes obras maestras reconocidas internacionalmente"
          fetchUrl="/api/tmdb/movie/top_rated"
          mediaType="movie"
        />

        {/* 8. Popular Series */}
        <ContentRow
          title="Series del Momento"
          subtitle="Historias adictivas para maratonear hoy mismo"
          fetchUrl="/api/tmdb/tv/popular"
          mediaType="tv"
          seeAllHref="/tv"
        />

        {/* 9. Action & Adventure */}
        <ContentRow
          title="Pura Adrenalina y Acción"
          subtitle="Mundo abierto, persecuciones y combates épicos"
          fetchUrl="/api/tmdb/discover/movie?with_genres=28"
          mediaType="movie"
          seeAllHref="/movies?genre=28"
        />

        {/* 10. Editorial Spotlight: Series Masterpieces */}
        <EditorialSpotlight
          title="Serie Imperdible"
          subtitle="Narrativas complejas y personajes inolvidables"
          fetchUrl="/api/tmdb/tv/top_rated"
          mediaType="tv"
        />

        {/* 11. Sci-Fi & Fantasy */}
        <ContentRow
          title="Ciencia Ficción y Fantasía"
          subtitle="Viajes en el tiempo, tecnología y nuevos mundos"
          fetchUrl="/api/tmdb/discover/movie?with_genres=878"
          mediaType="movie"
          seeAllHref="/movies?genre=878"
        />

        {/* 12. Comedy & Fun */}
        <ContentRow
          title="Comedia para Desconectar"
          subtitle="Risas garantizadas para cualquier momento del día"
          fetchUrl="/api/tmdb/discover/movie?with_genres=35"
          mediaType="movie"
          seeAllHref="/movies?genre=35"
        />

        {/* 13. Suspense & Crime */}
        <ContentRow
          title="Misterio, Crimen y Suspenso"
          subtitle="Giros inesperados e investigaciones que te atraparán"
          fetchUrl="/api/tmdb/discover/tv?with_genres=80"
          mediaType="tv"
          seeAllHref="/tv?genre=80"
        />

        {/* 14. Animation for Everyone */}
        <ContentRow
          title="Animación Extraordinaria"
          subtitle="Historias visuales de primer nivel para toda la familia"
          fetchUrl="/api/tmdb/discover/movie?with_genres=16"
          mediaType="movie"
          seeAllHref="/movies?genre=16"
        />
      </DiscoverySection>
    </div>
  );
}
