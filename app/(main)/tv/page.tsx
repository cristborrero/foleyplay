import { Suspense } from 'react';
import ContentRow from '@/components/home/ContentRow';
import UserContentRow from '@/components/home/UserContentRow';
import EditorialSpotlight from '@/components/home/EditorialSpotlight';
import GenreCatalog from '@/components/catalog/GenreCatalog';
import { Tv } from 'lucide-react';

export const metadata = {
  title: 'Series de TV — FoleyPlay',
  description: 'Descubre series aclamadas, miniseries de culto y temporadas completas listas para maratonear.',
};

export default function TVPage() {
  return (
    <div className="w-full pt-24 pb-16">
      {/* Category Header */}
      <div className="container-editorial mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 text-fp-lime text-xs font-semibold uppercase tracking-wider mb-2">
          <Tv size={16} />
          <span>Producciones de Televisión</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F6F4] tracking-tight">
          Series
        </h1>
        <p className="text-sm sm:text-base text-[#9CA39D] mt-1 max-w-2xl">
          Temporadas completas, tramas envolventes y episodios para ver sin pausa.
        </p>
      </div>

      <Suspense fallback={<div className="container-editorial py-8 text-[#9CA39D]">Cargando catálogo...</div>}>
        <GenreCatalog
          mediaType="tv"
          defaultRows={
            <>
              <UserContentRow title="Mi Lista — Series" type="watchlist" mediaType="tv" />

              <ContentRow
                title="Series del Momento"
                subtitle="Las series más vistas y recomendadas globalmente"
                fetchUrl="/api/tmdb/tv/popular"
                mediaType="tv"
                isLargeRow
              />

              <ContentRow
                title="En Emisión y Nuevos Episodios"
                subtitle="Transmisiones activas en cadenas internacionales"
                fetchUrl="/api/tmdb/tv/on_the_air"
                mediaType="tv"
              />

              <EditorialSpotlight
                title="Obra Maestra Televisiva"
                subtitle="Aclamada por el público y los festivales de todo el mundo"
                fetchUrl="/api/tmdb/tv/top_rated"
                mediaType="tv"
              />

              <ContentRow
                title="Drama y Tramas Psicológicas"
                subtitle="Historias intensas y complejas"
                fetchUrl="/api/tmdb/discover/tv?with_genres=18"
                mediaType="tv"
              />

              <ContentRow
                title="Acción, Aventura y Supervivencia"
                subtitle="Viajes peligrosos y momentos de alta tensión"
                fetchUrl="/api/tmdb/discover/tv?with_genres=10759"
                mediaType="tv"
              />

              <ContentRow
                title="Crimen, Mafia y Policiales"
                subtitle="Investigaciones detectivescas y bajos fondos"
                fetchUrl="/api/tmdb/discover/tv?with_genres=80"
                mediaType="tv"
              />

              <ContentRow
                title="Comedias y Sitcoms"
                subtitle="Episodios ligeros para disfrutar a cualquier hora"
                fetchUrl="/api/tmdb/discover/tv?with_genres=35"
                mediaType="tv"
              />

              <ContentRow
                title="Ciencia Ficción y Fantasía Épica"
                subtitle="Universos imaginarios, magia y distopías"
                fetchUrl="/api/tmdb/discover/tv?with_genres=10765"
                mediaType="tv"
              />
            </>
          }
        />
      </Suspense>
    </div>
  );
}
