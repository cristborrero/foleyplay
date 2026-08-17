'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, Plus, Check, Info } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import { useModal } from '@/lib/modal-context';
import { useWatchlist } from '@/hooks/useWatchlist';
import MediaRating from './MediaRating';

interface MovieCardProps {
  media: TMDBMedia;
  isLargeRow?: boolean;
  mediaType?: 'movie' | 'tv';
}

export default function MovieCard({ media, mediaType }: MovieCardProps) {
  const { openPlayer, openDetail } = useModal();
  const { isInWatchlist, toggle } = useWatchlist();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const resolvedMediaType = mediaType || media.media_type || 'movie';
  const inWatchlist = isInWatchlist(media.id, resolvedMediaType);
  const imagePath = media.poster_path || media.posterPath;
  const title = media.title || media.name || '';
  const year = (media.release_date || media.first_air_date || '').slice(0, 4);
  const score = media.vote_average ? Math.round(media.vote_average * 10) : null;
  const typeLabel = resolvedMediaType === 'tv' ? 'Serie' : 'Película';

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openPlayer({
      tmdbId: media.id,
      mediaType: resolvedMediaType,
      title,
      posterPath: imagePath ?? undefined,
    });
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openDetail({ tmdbId: media.id, mediaType: resolvedMediaType });
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      tmdbId: media.id,
      mediaType: resolvedMediaType,
      title,
      posterPath: imagePath || '',
    });
  };

  return (
    <article className="relative group/card select-none">
      <motion.div
        whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.03 }}
        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={handleInfo}
        className="relative block w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#101310] border border-white/[0.08] group-hover/card:border-white/20 group-hover/card:shadow-[0_12px_36px_rgba(0,0,0,0.7)] transition-colors duration-200 cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Ver detalles de ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail({ tmdbId: media.id, mediaType: resolvedMediaType });
          }
        }}
      >
        {/* Poster Image */}
        {imagePath && !imageError ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${imagePath}`}
            alt={title}
            fill
            className={`object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover/card:brightness-90`}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-[#151815]">
            <span className="text-xs text-[#9CA39D] font-medium line-clamp-3">
              {title}
            </span>
          </div>
        )}

        {/* Skeleton Shimmer while loading */}
        {imagePath && !imageError && !imageLoaded && (
          <div aria-hidden="true" className="absolute inset-0 skeleton-shimmer bg-[#151815]" />
        )}

        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A09]/95 via-[#080A09]/20 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/60 backdrop-blur-md text-[#9CA39D] border border-white/10">
            {typeLabel}
          </span>
          {score !== null && score > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/60 backdrop-blur-md text-fp-lime border border-white/10 flex items-center gap-1">
              ★ {score}%
            </span>
          )}
        </div>

        {/* Bottom Info & Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end">
          <p className="text-sm font-semibold text-[#F4F6F4] line-clamp-1 group-hover/card:text-fp-lime transition-colors">
            {title}
          </p>

          <div className="flex items-center gap-2 text-xs text-[#9CA39D] mt-1">
            <MediaRating id={media.id} mediaType={resolvedMediaType} />
            {year && <span>{year}</span>}
          </div>

          {/* Quick Action Buttons (Visible on hover/focus) */}
          <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/[0.08] opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100 transition-opacity duration-200">
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-fp-lime text-black hover:bg-fp-lime-hover transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              aria-label={`Reproducir ${title}`}
            >
              <Play size={14} className="fill-black ml-0.5" />
            </button>

            <button
              onClick={handleToggleWatchlist}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F4F6F4] backdrop-blur-md border border-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={inWatchlist ? `Quitar de Mi Lista` : `Añadir a Mi Lista`}
            >
              {inWatchlist ? <Check size={14} className="text-fp-lime" /> : <Plus size={14} />}
            </button>

            <button
              onClick={handleInfo}
              className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F4F6F4] backdrop-blur-md border border-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={`Más información sobre ${title}`}
            >
              <Info size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
