'use client';

import Link from 'next/link';
import { Clock, Play, Loader2 } from 'lucide-react';
import MovieCard from '@/components/cards/MovieCard';
import { useHistory } from '@/hooks/useHistory';
import { TMDBMedia } from '@/types/tmdb';

export default function HistoryPage() {
  const { history, isLoading } = useHistory();

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-[#080A09] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="animate-spin text-fp-lime" />
        <span className="text-xs text-[#9CA39D]">Cargando tu historial...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#080A09]">
      <div className="container-editorial">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-fp-lime text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock size={15} />
            <span>Historial de Reproducción</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F4F6F4] tracking-tight">
            Continuar Viendo
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA39D] mt-1">
            {history.length === 1
              ? '1 título en curso'
              : `${history.length} títulos en curso`}
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-24 px-4 bg-[#101310] rounded-2xl border border-white/[0.08] max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-fp-lime/10 border border-fp-lime/20 text-fp-lime flex items-center justify-center mx-auto mb-4">
              <Clock size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#F4F6F4] mb-2">
              No has visto nada aún
            </h2>
            <p className="text-xs text-[#9CA39D] leading-relaxed mb-6">
              Cuando empieces a ver una película o serie, tu progreso se guardará automáticamente aquí para que puedas retomar en cualquier momento.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-fp-lime text-black font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-fp-lime-hover transition-transform hover:scale-105 active:scale-95"
            >
              <Play size={14} className="fill-black ml-0.5" />
              <span>Empezar a ver</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {history.map((item) => {
              const media: TMDBMedia = {
                id: item.tmdbId,
                media_type: item.mediaType,
                title: item.mediaType === 'movie' ? item.title : undefined,
                name: item.mediaType === 'tv' ? item.title : undefined,
                poster_path: item.posterPath || item.poster_path || null,
                backdrop_path: '',
                overview: '',
                vote_average: 0,
                release_date: '',
                first_air_date: '',
              };

              const key = item._id || `${item.mediaType}-${item.tmdbId}`;

              return (
                <div key={key} className="w-full relative group">
                  <MovieCard media={media} />
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden z-10 pointer-events-none">
                    <div
                      className="h-full bg-fp-lime"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(10, item.progress || 35)
                        )}%`,
                      }}
                    />
                  </div>
                  {/* Season/Episode Badge */}
                  {item.mediaType === 'tv' && item.season && item.episode && (
                    <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold text-white border border-white/10 z-10 pointer-events-none">
                      T{item.season} E{item.episode}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}