'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Info, Sparkles } from 'lucide-react';
import { TMDBMedia } from '@/types/tmdb';
import { useModal } from '@/lib/modal-context';

interface EditorialSpotlightProps {
  title?: string;
  subtitle?: string;
  fetchUrl?: string;
  mediaType?: 'movie' | 'tv';
}

export default function EditorialSpotlight({
  title = 'Colección Destacada',
  subtitle = 'Historias aclamadas por la crítica que no podrás dejar a medias',
  fetchUrl = '/api/tmdb/movie/top_rated',
  mediaType = 'movie',
}: EditorialSpotlightProps) {
  const [item, setItem] = useState<TMDBMedia | null>(null);
  const { openPlayer, openDetail } = useModal();

  useEffect(() => {
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        const withBackdrop = (data.results || []).filter((m: TMDBMedia) => m.backdrop_path && m.overview);
        if (withBackdrop.length > 0) {
          // Pick the highest rated or a prominent one
          setItem(withBackdrop[0]);
        }
      })
      .catch((err) => console.error('Error fetching spotlight:', err));
  }, [fetchUrl]);

  if (!item || !item.backdrop_path) return null;

  const itemTitle = item.title || item.name || '';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  return (
    <section className="container-editorial my-14 sm:my-20" aria-label={title}>
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#101310] border border-white/[0.08] min-h-[360px] sm:min-h-[440px] flex items-center shadow-2xl">
        {/* Background Image */}
        <Image
          src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
          alt={itemTitle}
          fill
          className="object-cover object-center brightness-75"
          sizes="(max-width: 1560px) 100vw, 1560px"
          loading="lazy"
        />

        {/* Cinematic Dual Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/95 via-[#080A09]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A09] via-transparent to-black/30" />

        {/* Content Box */}
        <div className="relative z-10 p-6 sm:p-10 md:p-14 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fp-lime/10 border border-fp-lime/20 text-fp-lime text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <span>{title}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#F4F6F4] tracking-tight mb-3 leading-tight">
            {itemTitle}
          </h2>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#9CA39D] font-medium mb-4">
            {year && <span>{year}</span>}
            <span>•</span>
            <span className="capitalize">{mediaType === 'tv' ? 'Serie de TV' : 'Película'}</span>
            {item.vote_average > 0 && (
              <>
                <span>•</span>
                <span className="text-fp-lime font-bold">★ {Math.round(item.vote_average * 10)}% Recomendado</span>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base text-[#9CA39D] leading-relaxed line-clamp-3 mb-6 font-normal">
            {item.overview}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() =>
                openPlayer({
                  tmdbId: item.id,
                  mediaType: mediaType,
                  title: itemTitle,
                  posterPath: item.poster_path || undefined,
                })
              }
              className="flex items-center gap-2 bg-fp-lime text-black font-bold px-6 py-3 rounded-xl text-sm sm:text-base hover:bg-fp-lime-hover transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
              aria-label={`Ver ahora ${itemTitle}`}
            >
              <Play size={17} className="fill-black" />
              <span>Ver ahora</span>
            </button>

            <button
              onClick={() => openDetail({ tmdbId: item.id, mediaType: mediaType })}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#F4F6F4] font-medium px-5 py-3 rounded-xl text-sm sm:text-base backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
              aria-label={`Detalles de ${itemTitle}`}
            >
              <Info size={17} />
              <span>Más detalles</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
