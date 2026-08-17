'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Play, Plus, Check, Info, Sparkles } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import { useModal } from '@/lib/modal-context';
import { useWatchlist } from '@/hooks/useWatchlist';
import MediaRating from '@/components/cards/MediaRating';

const ROTATION_INTERVAL = 9000;

export default function HeroBanner() {
  const { openPlayer, openDetail } = useModal();
  const { isInWatchlist, toggle } = useWatchlist();
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/tmdb/trending/all/day');
        const data = await res.json();
        const results: TMDBMedia[] = (data.results || [])
          .filter((m: TMDBMedia) => m.backdrop_path && m.overview)
          .slice(0, 5);
        setItems(results);
      } catch (e) {
        console.error('HeroBanner fetch error:', e);
      }
    }
    fetchTrending();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [items.length]);

  const movie = items[currentIndex];

  if (!movie) {
    return (
      <div className="h-[400px] sm:h-[480px] lg:h-[580px] w-full bg-[#101310] relative flex items-end">
        <div className="container-editorial pb-12 sm:pb-16 space-y-4">
          <div className="h-6 w-32 rounded bg-white/10 skeleton-shimmer" />
          <div className="h-10 sm:h-12 w-72 sm:w-[480px] rounded bg-white/10 skeleton-shimmer" />
          <div className="h-4 w-60 rounded bg-white/5 skeleton-shimmer" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-32 rounded-xl bg-white/10 skeleton-shimmer" />
            <div className="h-11 w-32 rounded-xl bg-white/5 skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const title = movie.title || movie.name || movie.original_name || '';
  const resolvedMediaType = movie.media_type || 'movie';
  const inWatchlist = isInWatchlist(movie.id, resolvedMediaType);
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const score = movie.vote_average ? Math.round(movie.vote_average * 10) : null;
  const overview =
    movie.overview && movie.overview.length > 180
      ? `${movie.overview.substring(0, 180)}...`
      : movie.overview;

  const handlePlay = () => {
    openPlayer({
      tmdbId: movie.id,
      mediaType: resolvedMediaType,
      title,
      posterPath: movie.poster_path || undefined,
    });
  };

  const handleToggleWatchlist = () => {
    toggle({
      tmdbId: movie.id,
      mediaType: resolvedMediaType,
      title,
      posterPath: movie.poster_path || '',
    });
  };

  return (
    <section
      className="relative h-[420px] sm:h-[500px] lg:h-[580px] w-full overflow-hidden flex items-end select-none"
      aria-label="Destacado principal"
    >
      {/* Background Cross-fade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={title}
            fill
            className="object-cover object-top brightness-[0.75]"
            priority
            sizes="100vw"
          />
          {/* Subtle cinematic left and bottom gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A09] via-[#080A09]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/95 via-[#080A09]/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="container-editorial relative z-20 pb-10 sm:pb-14 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: 'easeOut',
            }}
          >
            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-fp-lime/15 border border-fp-lime/25 text-fp-lime text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
              <Sparkles size={12} />
              <span>Estreno Destacado</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#F4F6F4] tracking-tight leading-[1.05] mb-2.5 drop-shadow-xl">
              {title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-[#9CA39D] font-medium mb-3 flex-wrap">
              <MediaRating id={movie.id} mediaType={resolvedMediaType} />
              {score !== null && score > 0 && (
                <span className="text-fp-lime font-bold">
                  ★ {score}% de coincidencia
                </span>
              )}
              {year && <span>{year}</span>}
              <span className="capitalize px-2 py-0.5 rounded bg-white/10 text-white text-[10px] sm:text-[11px]">
                {resolvedMediaType === 'tv' ? 'Serie' : 'Película'}
              </span>
            </div>

            {/* Overview */}
            {overview && (
              <p className="text-xs sm:text-sm text-[#9CA39D] leading-relaxed line-clamp-2 mb-5 max-w-2xl">
                {overview}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 bg-fp-lime text-black font-bold px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm hover:bg-fp-lime-hover transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
                aria-label={`Reproducir ${title}`}
              >
                <Play size={16} className="fill-black ml-0.5" />
                <span>Ver ahora</span>
              </button>

              <button
                onClick={handleToggleWatchlist}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#F4F6F4] font-medium px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                aria-label={inWatchlist ? `Quitar de Mi Lista` : `Añadir a Mi Lista`}
              >
                {inWatchlist ? (
                  <Check size={16} className="text-fp-lime" />
                ) : (
                  <Plus size={16} />
                )}
                <span>{inWatchlist ? 'En mi lista' : 'Mi lista'}</span>
              </button>

              <button
                onClick={() =>
                  openDetail({ tmdbId: movie.id, mediaType: resolvedMediaType })
                }
                className="flex items-center gap-2 bg-white/5 hover:bg-white/15 text-[#9CA39D] hover:text-white font-medium px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                aria-label={`Detalles de ${title}`}
              >
                <Info size={16} />
                <span className="hidden sm:inline">Detalles</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      {items.length > 1 && (
        <div className="container-editorial absolute bottom-4 left-0 right-0 z-20 flex justify-end">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Ir a destacado ${i + 1}`}
                aria-current={i === currentIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? 'w-6 bg-fp-lime'
                    : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
