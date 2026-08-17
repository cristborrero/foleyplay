'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { useWatchlist, type WatchlistItem } from '@/hooks/useWatchlist';
import { useHistory, type HistoryItem } from '@/hooks/useHistory';
import MovieCard from '@/components/cards/MovieCard';
import { TMDBMedia } from '@/types/tmdb';

interface UserContentRowProps {
  title: string;
  type?: 'history' | 'watchlist';
  fetchUrl?: string; // backwards compatibility
  mediaType?: 'movie' | 'tv';
  showProgress?: boolean;
}

export default function UserContentRow({
  title,
  type,
  fetchUrl,
  mediaType,
}: UserContentRowProps) {
  const { watchlist } = useWatchlist();
  const { history } = useHistory();
  const rowRef = useRef<HTMLDivElement>(null);

  // Determine type from prop or fallback fetchUrl
  const resolvedType =
    type ||
    (fetchUrl?.includes('history')
      ? 'history'
      : 'watchlist');

  // Filter items based on type and mediaType
  const baseItems: (HistoryItem | WatchlistItem)[] =
    resolvedType === 'history' ? history : watchlist;
  let items = baseItems;
  if (mediaType) {
    items = items.filter((item) => item.mediaType === mediaType);
  } else if (fetchUrl?.includes('type=movie')) {
    items = items.filter((item) => item.mediaType === 'movie');
  } else if (fetchUrl?.includes('type=tv')) {
    items = items.filter((item) => item.mediaType === 'tv');
  }

  if (items.length === 0) return null;

  const isHistory = resolvedType === 'history';
  const Icon = isHistory ? Clock : Bookmark;
  const destinationHref = isHistory ? '/history' : '/watchlist';

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    rowRef.current.scrollTo({
      left:
        direction === 'left'
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  return (
    <section aria-label={title} className="container-editorial my-10 sm:my-14">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-fp-lime">
            <Icon size={16} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F4F6F4] tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-[#9CA39D]">
              {isHistory ? 'Continúa donde lo dejaste' : 'Tus títulos guardados'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={destinationHref}
            className="text-xs font-semibold text-[#9CA39D] hover:text-fp-lime flex items-center gap-1 transition-colors"
          >
            <span>Ver todo</span>
            <ArrowRight size={13} />
          </Link>

          <div className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Desplazar ${title} a la izquierda`}
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-full bg-[#151815] hover:bg-[#1C201C] border border-white/10 text-[#F4F6F4] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label={`Desplazar ${title} a la derecha`}
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-full bg-[#151815] hover:bg-[#1C201C] border border-white/10 text-[#F4F6F4] hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none content-row-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item) => {
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
            <div
              key={key}
              className="flex-none w-[140px] sm:w-[170px] md:w-[200px]"
            >
              <MovieCard media={media} mediaType={item.mediaType} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
