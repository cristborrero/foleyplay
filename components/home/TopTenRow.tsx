'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Trophy } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import { useModal } from '@/lib/modal-context';

interface TopTenRowProps {
  title?: string;
  fetchUrl?: string;
}

export default function TopTenRow({
  title = 'Top 10 Más Visto Hoy',
  fetchUrl = '/api/tmdb/trending/all/day',
}: TopTenRowProps) {
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);
  const { openPlayer, openDetail } = useModal();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const top10 = (data.results || [])
          .filter((m: TMDBMedia) => m.poster_path)
          .slice(0, 10);
        setItems(top10);
      })
      .catch((err) => console.error('Error fetching Top 10:', err))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    rowRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75,
      behavior: 'smooth',
    });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="container-editorial my-12 sm:my-16" aria-label={title}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-fp-lime/10 border border-fp-lime/20 text-fp-lime">
            <Trophy size={18} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F4F6F4] tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-[#9CA39D]">Los títulos más populares de las últimas 24 horas</p>
          </div>
        </div>

        {/* Scroll Arrows */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-[#151815] hover:bg-[#1C201C] border border-white/10 text-[#F4F6F4] hover:text-white transition-colors cursor-pointer"
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-[#151815] hover:bg-[#1C201C] border border-white/10 text-[#F4F6F4] hover:text-white transition-colors cursor-pointer"
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Row with Oversized Numbers */}
      <div
        ref={rowRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none content-row-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-none w-[200px] sm:w-[240px] aspect-[16/10] bg-[#151815] rounded-xl skeleton-shimmer" />
            ))
          : items.map((item, index) => {
              const rank = index + 1;
              const mediaTitle = item.title || item.name || '';
              const resolvedType = item.media_type || 'movie';

              return (
                <div
                  key={item.id}
                  className="flex-none flex items-center group/top10 select-none cursor-pointer"
                  onClick={() => openDetail({ tmdbId: item.id, mediaType: resolvedType })}
                >
                  {/* Oversized Rank Number */}
                  <div
                    className="relative shrink-0 select-none -mr-4 sm:-mr-6 z-10"
                    aria-hidden="true"
                  >
                    <span
                      className="text-7xl sm:text-8xl lg:text-9xl font-black italic tracking-tighter"
                      style={{
                        WebkitTextStroke: '2px rgba(255, 255, 255, 0.4)',
                        color: 'transparent',
                        textShadow: '0 8px 24px rgba(0, 0, 0, 0.9)',
                      }}
                    >
                      {rank}
                    </span>
                  </div>

                  {/* Poster Card */}
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { y: -4, scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-[130px] sm:w-[155px] md:w-[170px] aspect-[2/3] rounded-xl overflow-hidden bg-[#101310] border border-white/10 group-hover/top10:border-fp-lime/50 group-hover/top10:shadow-[0_12px_36px_rgba(0,0,0,0.8)] transition-all shrink-0"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={mediaTitle}
                      fill
                      className="object-cover group-hover/top10:brightness-90 transition-all"
                      sizes="200px"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <p className="text-xs font-bold text-[#F4F6F4] line-clamp-1 group-hover/top10:text-fp-lime transition-colors">
                        {mediaTitle}
                      </p>
                      <span className="text-[10px] text-[#9CA39D] capitalize">
                        {resolvedType === 'tv' ? 'Serie' : 'Película'}
                      </span>
                    </div>

                    {/* Quick play hover button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-opacity bg-black/40">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPlayer({
                            tmdbId: item.id,
                            mediaType: resolvedType,
                            title: mediaTitle,
                            posterPath: item.poster_path || undefined,
                          });
                        }}
                        className="w-10 h-10 rounded-full bg-fp-lime text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer shadow-lg"
                        aria-label={`Reproducir ${mediaTitle}`}
                      >
                        <Play size={16} className="fill-black ml-0.5" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
