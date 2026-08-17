'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import MovieCard from '@/components/cards/MovieCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  fetchUrl: string;
  mediaType?: 'movie' | 'tv';
  seeAllHref?: string;
  isLargeRow?: boolean;
}

const SKELETON_COUNT = 6;

export default function ContentRow({
  title,
  subtitle,
  fetchUrl,
  mediaType,
  seeAllHref,
  isLargeRow = false,
}: ContentRowProps) {
  const [movies, setMovies] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy load via IntersectionObserver — only fetch when row enters viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fetched) {
          setFetched(true);
          setLoading(true);
          fetch(fetchUrl)
            .then((r) => r.json())
            .then((d) =>
              setMovies((d.results || []).filter((m: TMDBMedia) => m.poster_path))
            )
            .catch((err) => console.error(`Error loading row "${title}":`, err))
            .finally(() => setLoading(false));
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchUrl, fetched, title]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      rowRef.current.scrollTo({
        left:
          direction === 'left'
            ? scrollLeft - clientWidth * 0.75
            : scrollLeft + clientWidth * 0.75,
        behavior: 'smooth',
      });
    }
  };

  if (!loading && !fetched) {
    return (
      <div
        ref={containerRef}
        className="container-editorial my-8 h-[240px]"
      />
    );
  }
  if (!loading && movies.length === 0) return null;

  return (
    <section
      ref={containerRef}
      aria-label={title}
      className="container-editorial my-10 sm:my-14"
    >
      {/* Header with Title, Subtitle and Actions */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#F4F6F4] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#9CA39D] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-xs font-semibold text-[#9CA39D] hover:text-fp-lime flex items-center gap-1 transition-colors"
            >
              <span>Ver todos</span>
              <ArrowRight size={13} />
            </Link>
          )}

          {/* Carousel Arrows */}
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

      {/* Content Rail */}
      <div
        ref={rowRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none content-row-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex-none w-[140px] sm:w-[170px] md:w-[200px]"
              >
                <SkeletonCard isLargeRow={isLargeRow} />
              </div>
            ))
          : movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-none w-[140px] sm:w-[170px] md:w-[200px]"
              >
                <MovieCard
                  media={movie}
                  isLargeRow={isLargeRow}
                  mediaType={mediaType}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
