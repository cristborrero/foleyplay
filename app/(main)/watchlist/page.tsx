'use client';

import Link from 'next/link';
import { Bookmark, Sparkles, Loader2 } from 'lucide-react';
import MovieCard from '@/components/cards/MovieCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import { TMDBMedia } from '@/types/tmdb';

export default function WatchlistPage() {
  const { watchlist, isLoading } = useWatchlist();

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-[#080A09] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="animate-spin text-fp-lime" />
        <span className="text-xs text-[#9CA39D]">Cargando tu lista...</span>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#080A09]">
      <div className="container-editorial">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-fp-lime text-xs font-semibold uppercase tracking-wider mb-2">
            <Bookmark size={15} />
            <span>Colección Personal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F4F6F4] tracking-tight">
            Mi Lista
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA39D] mt-1">
            {watchlist.length === 1
              ? '1 título guardado'
              : `${watchlist.length} títulos guardados`}
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-24 px-4 bg-[#101310] rounded-2xl border border-white/[0.08] max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-fp-lime/10 border border-fp-lime/20 text-fp-lime flex items-center justify-center mx-auto mb-4">
              <Bookmark size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#F4F6F4] mb-2">
              Tu lista está vacía
            </h2>
            <p className="text-xs text-[#9CA39D] leading-relaxed mb-6">
              Explora nuestro catálogo y guarda las películas o series que quieras ver más tarde haciendo clic en el botón (+).
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-fp-lime text-black font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-fp-lime-hover transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles size={14} />
              <span>Explorar catálogo</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {watchlist.map((item) => {
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
                <div key={key} className="w-full">
                  <MovieCard media={media} mediaType={item.mediaType} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}