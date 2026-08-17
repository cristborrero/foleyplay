import { Suspense } from 'react';
import ContentRow from '@/components/home/ContentRow';
import UserContentRow from '@/components/home/UserContentRow';
import EditorialSpotlight from '@/components/home/EditorialSpotlight';
import GenreCatalog from '@/components/catalog/GenreCatalog';
import { Film } from 'lucide-react';

export const metadata = {
  title: 'Películas — FoleyPlay',
  description: 'Explora el catálogo completo de películas: estrenos, clásicos galardonados y grandes producciones de cine.',
};

export default function MoviesPage() {
  return (
    <div className="w-full pt-24 pb-16">
      {/* Category Header */}
      <div className="container-editorial mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 text-fp-lime text-xs font-semibold uppercase tracking-wider mb-2">
          <Film size={16} />
          <span>Catálogo de Cine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F6F4] tracking-tight">
          Películas
        </h1>
        <p className="text-sm sm:text-base text-[#9CA39D] mt-1 max-w-2xl">
          Historias que despiertan emociones: desde éxitos taquilleros hasta obras maestras independientes.
        </p>
      </div>

      <Suspense fallback={<div className="container-editorial py-8 text-[#9CA39D]">Cargando catálogo...</div>}>
        <GenreCatalog
          mediaType="movie"
          defaultRows={
            <>
              <UserContentRow title="Mi Lista — Películas" type="watchlist" mediaType="movie" />

              <ContentRow
                title="Novedades en Cartelera y Streaming"
                subtitle="Las películas más comentadas de la temporada"
                fetchUrl="/api/tmdb/movie/now_playing"
                mediaType="movie"
                isLargeRow
              />

              <ContentRow
                title="Películas Populares"
                subtitle="Las favoritas de la comunidad"
                fetchUrl="/api/tmdb/movie/popular"
                mediaType="movie"
              />

              <EditorialSpotlight
                title="Aclamada por la Crítica"
                subtitle="Una experiencia cinematográfica imprescindible"
                fetchUrl="/api/tmdb/movie/top_rated"
                mediaType="movie"
              />

              <ContentRow
                title="Acción y Blockbusters"
                subtitle="Emoción pura, superhéroes y persecuciones"
                fetchUrl="/api/tmdb/discover/movie?with_genres=28"
                mediaType="movie"
              />

              <ContentRow
                title="Ciencia Ficción y Mundos Paralelos"
                subtitle="Futurismo, inteligencia artificial y el cosmos"
                fetchUrl="/api/tmdb/discover/movie?with_genres=878"
                mediaType="movie"
              />

              <ContentRow
                title="Cine de Terror y Suspenso"
                subtitle="Tensión psicológica y relatos sobrenaturales"
                fetchUrl="/api/tmdb/discover/movie?with_genres=27"
                mediaType="movie"
              />

              <ContentRow
                title="Comedias Destacadas"
                subtitle="Diversión asegurada para compartir"
                fetchUrl="/api/tmdb/discover/movie?with_genres=35"
                mediaType="movie"
              />

              <ContentRow
                title="Grandes Obras de Animación"
                subtitle="Creatividad visual sin límites"
                fetchUrl="/api/tmdb/discover/movie?with_genres=16"
                mediaType="movie"
              />
            </>
          }
        />
      </Suspense>
    </div>
  );
}
