'use client';

import { useEffect, useState, useCallback, useRef, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Play, Plus, Check, ThumbsUp, ThumbsDown, Share2, X,
  ChevronDown, ChevronUp, Flame, Trophy, Star, Clock,
  Volume2, VolumeX,
} from 'lucide-react';
import { useModal } from '@/lib/modal-context';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useRating } from '@/hooks/useRatings';
import { TMDBDetail, TMDBVideo } from '@/types/tmdb';
import CastRow from './CastRow';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatRuntime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`;
}

function getCertification(data: TMDBDetail, mediaType: 'movie' | 'tv'): string {
  let r = '';
  if (mediaType === 'movie') {
    const us = data.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
    r = us?.release_dates?.find(rd => rd.certification)?.certification || '';
  } else {
    const us = data.content_ratings?.results?.find(r => r.iso_3166_1 === 'US');
    r = us?.rating || '';
  }

  if (!r) return '';

  const rating = r.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  const mappings: Record<string, string> = {
    'TV-Y': 'G', 'TV-Y7': 'PG', 'TV-G': 'G', 'TV-PG': 'PG', 'TV-14': 'PG-13', 'TV-MA': 'R',
    '12': 'PG-13', '15': 'R', '18': 'NC-17', '7': 'G', '10': 'PG', '13': 'PG-13', '16': 'R'
  };

  if (mappings[rating]) return mappings[rating];
  if (rating.includes('PG13')) return 'PG-13';
  if (rating.includes('NC17')) return 'NC-17';
  if (rating === 'APPROVED' || rating === 'PASSED') return 'G';
  
  return rating;
}

function getTrailerScore(video: TMDBVideo): number {
  if (video.site !== 'YouTube') return 0;

  const isTrailer = video.type === 'Trailer';
  const name = video.name.toLowerCase();
  const lang = video.iso_639_1;
  const region = video.iso_3166_1;

  // Idioma de España
  const isSpain = region === 'ES' || name.includes('españa') || name.includes('castellano') || name.includes('es-es');
  
  // Idioma Latino
  const isLatino = name.includes('latino') || name.includes('latin') || name.includes('mex') || name.includes('mx') || name.includes('la') || name.includes('doblado') || (lang === 'es' && region && ['MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'UY', 'US'].includes(region));

  if (lang === 'es') {
    if (isLatino) {
      return isTrailer ? 100 : 70;
    }
    if (isSpain) {
      return isTrailer ? 40 : 10;
    }
    return isTrailer ? 80 : 50;
  }

  if (lang === 'en') {
    return isTrailer ? 30 : 5;
  }

  return isTrailer ? 20 : 2;
}

// ─── sub-components ──────────────────────────────────────────────────────────

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
        active ? 'border-fp-lime text-fp-lime' : 'border-transparent text-[#9CA39D] hover:text-[#F4F6F4]'
      }`}
    >
      {label}
    </button>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function DetailModal() {
  const { detail, closeDetail, openPlayer } = useModal();
  const { isInWatchlist, toggle: toggleWatchlistHook } = useWatchlist();
  const { rating: userRating, setRating } = useRating(detail?.tmdbId, detail?.mediaType);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [data, setData] = useState<TMDBDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'trailers'>('trailers');
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const inWatchlist = detail ? isInWatchlist(detail.tmdbId, detail.mediaType) : false;

  // ── fetch detail ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!detail) return;
    startTransition(() => {
      setLoading(true);
      setSynopsisExpanded(false);
      setIsMuted(true);
    });

    const append = 'credits,videos,release_dates,content_ratings';
    fetch(`/api/tmdb/${detail.mediaType}/${detail.tmdbId}?append_to_response=${append}&include_video_language=es-MX,es,es-ES,en,null`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [detail]);

  const toggleWatchlist = () => {
    if (!data || !detail) return;
    toggleWatchlistHook({
      tmdbId: data.id,
      mediaType: detail.mediaType,
      title: data.title || data.name || '',
      posterPath: data.poster_path || '',
    });
  };

  const handleRating = (newRating: 'like' | 'dislike') => {
    if (!data) return;
    const next = userRating === newRating ? null : newRating;
    setRating(next);
  };

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/${detail?.mediaType}/${detail?.tmdbId}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }, [detail]);

  const handlePlay = useCallback(() => {
    if (!data || !detail) return;
    closeDetail();
    if (detail.mediaType === 'tv') {
      router.push(`/tv/${data.id}`);
    } else {
      openPlayer({
        tmdbId: data.id,
        mediaType: 'movie',
        title: data.title || '',
        imdbId: data.external_ids?.imdb_id || data.imdb_id,
      });
    }
  }, [data, detail, closeDetail, openPlayer, router]);

  // ── keyboard + scroll lock ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDetail(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeDetail]);

  useEffect(() => {
    document.body.style.overflow = detail ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [detail]);

  useEffect(() => {
    if (!detail) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      previouslyFocusedRef.current?.focus();
    };
  }, [detail]);

  // ── derived ─────────────────────────────────────────────────────────────
  const title = data?.title || data?.name || '';
  const year = data?.release_date
    ? new Date(data.release_date).getFullYear()
    : data?.first_air_date ? new Date(data.first_air_date).getFullYear() : null;
  const certification = data ? getCertification(data, detail?.mediaType || 'movie') : '';
  const score = data ? Math.round(data.vote_average * 10) : 0;
  const sortedVideos = [...(data?.videos?.results || [])]
    .filter(v => v.site === 'YouTube')
    .sort((a, b) => getTrailerScore(b) - getTrailerScore(a));
  const trailer = sortedVideos[0];
  const extraVideos = sortedVideos;
  const director = data?.credits?.crew?.find(c => c.job === 'Director')?.name || '';
  const creators = data?.created_by?.map(c => c.name).join(', ') || '';
  const isTopRated = (data?.vote_average ?? 0) >= 7.5 && (data?.vote_count ?? 0) >= 500;

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-[90] bg-black/85 flex items-start justify-center overflow-y-auto py-4 sm:py-6 px-2 sm:px-3 md:px-6"
          onClick={e => { if (e.target === e.currentTarget) closeDetail(); }}
        >
          <motion.div
            initial={shouldReduceMotion ? false : { y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'detail-modal-title' : undefined}
            aria-label={title ? undefined : 'Detalle del título'}
            className="w-full max-w-4xl bg-[#101310] border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.9)] relative my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* ── close ── */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDetail}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-10 h-10 bg-black/60 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-[#F4F6F4] hover:bg-black/80 hover:border-white/40 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            {/* HERO */}
            {loading || !data ? (
              <div className="min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center bg-[#151815]">
                <div className="w-10 h-10 border-2 border-fp-lime border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <section className="relative w-full min-h-[44vh] sm:min-h-[52vh] bg-black overflow-hidden" aria-labelledby="detail-modal-title">
                  {/* backdrop or trailer */}
                  {trailer ? (
                    <iframe
                      key={isMuted ? 'trailer-muted' : 'trailer-unmuted'}
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=${shouldReduceMotion ? 0 : 1}&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}`}
                      title={`Tráiler de ${title}`}
                      className="absolute inset-0 w-full h-full scale-100 md:scale-105"
                      allow="autoplay"
                    />
                  ) : data.backdrop_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : null}

                  {/* gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101310] via-[#101310]/70 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#101310]/95 via-[#101310]/50 to-transparent" />

                  {/* hero content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <motion.h2
                      initial={shouldReduceMotion ? false : { y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
                      id="detail-modal-title"
                      className="text-[#F4F6F4] text-2xl sm:text-4xl md:text-5xl font-black mb-3 drop-shadow-xl max-w-2xl leading-[1.05] tracking-tight"
                    >
                      {title}
                    </motion.h2>

                    {/* action buttons */}
                    <motion.div
                      initial={shouldReduceMotion ? false : { y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.15, duration: shouldReduceMotion ? 0 : 0.3 }}
                      className="flex items-center gap-2.5 sm:gap-3 flex-wrap"
                    >
                      {/* Play */}
                      <button
                        type="button"
                        onClick={handlePlay}
                        className="flex items-center gap-2 bg-fp-lime text-black font-bold px-6 py-2.5 sm:py-3 rounded-xl text-sm hover:bg-fp-lime-hover transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                        aria-label={`Reproducir ${title}`}
                      >
                        <Play size={16} className="fill-black ml-0.5" />
                        <span>Ver ahora</span>
                      </button>

                      {/* My list */}
                      <button
                        type="button"
                        onClick={toggleWatchlist}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-[#F4F6F4] font-medium px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm transition-colors backdrop-blur-md cursor-pointer"
                        aria-label={inWatchlist ? 'Quitar de Mi lista' : 'Añadir a Mi lista'}
                      >
                        {inWatchlist ? <Check size={16} className="text-fp-lime" /> : <Plus size={16} />}
                        <span>{inWatchlist ? 'En mi lista' : 'Mi lista'}</span>
                      </button>

                      {/* More info */}
                      <Link
                        href={`/${detail?.mediaType}/${data.id}`}
                        onClick={closeDetail}
                        className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/15 border border-white/10 text-[#9CA39D] hover:text-white font-medium px-4 py-2.5 sm:py-3 rounded-xl text-sm transition-colors"
                      >
                        <span>Página completa</span>
                      </Link>

                      {/* icon buttons */}
                      <div className="flex items-center gap-2 ml-auto">
                        {trailer && (
                          <button
                            type="button"
                            onClick={() => setIsMuted(v => !v)}
                            aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                              !isMuted
                                ? 'border-fp-lime bg-fp-lime/20 text-fp-lime'
                                : 'border-white/20 text-[#9CA39D] hover:text-white bg-white/5 backdrop-blur-sm'
                            }`}
                          >
                            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRating('like')}
                          aria-label="Me gusta"
                          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                            userRating === 'like'
                              ? 'border-fp-lime bg-fp-lime/10 text-fp-lime'
                              : 'border-white/20 text-[#9CA39D] hover:text-white bg-white/5 backdrop-blur-sm'
                          }`}
                        >
                          <ThumbsUp size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRating('dislike')}
                          aria-label="No me gusta"
                          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                            userRating === 'dislike'
                              ? 'border-red-400 bg-red-400/10 text-red-400'
                              : 'border-white/20 text-[#9CA39D] hover:text-white bg-white/5 backdrop-blur-sm'
                          }`}
                        >
                          <ThumbsDown size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={handleShare}
                          aria-label="Compartir"
                          className="w-9 h-9 rounded-full border border-white/20 text-[#9CA39D] hover:text-white bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all relative cursor-pointer"
                        >
                          <Share2 size={15} />
                          <AnimatePresence>
                            {copied && (
                              <motion.span
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap border border-white/10"
                              >
                                ¡Copiado!
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </section>

                {/* METADATA BAR */}
                <section aria-label="Información del título" className="px-5 sm:px-8 py-4 flex items-center gap-x-4 gap-y-2 flex-wrap border-b border-white/[0.08] text-xs sm:text-sm text-[#9CA39D] font-medium">
                  {certification && (
                    <span className="border border-white/20 text-[#F4F6F4] text-xs px-2 py-0.5 rounded bg-white/5 font-semibold">
                      {certification}
                    </span>
                  )}

                  {score > 0 && (
                    <span className="font-bold text-fp-lime">★ {score}% de coincidencia</span>
                  )}

                  {year && <span>{year}</span>}

                  {data.runtime ? (
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-[#9CA39D]" />
                      {formatRuntime(data.runtime)}
                    </span>
                  ) : null}

                  {data.number_of_seasons ? (
                    <span>
                      {data.number_of_seasons} {data.number_of_seasons === 1 ? 'temporada' : 'temporadas'}
                    </span>
                  ) : null}

                  {/* Contextual Badges */}
                  {isTopRated && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2.5 py-0.5 rounded-full">
                      <Flame size={12} className="fill-orange-400" />
                      Top 10 Hoy
                    </span>
                  )}

                  {data.vote_average >= 8 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded-full">
                      <Trophy size={12} />
                      Aclamada
                    </span>
                  )}
                </section>

                {/* SYNOPSIS + DETAILS */}
                <section aria-labelledby="synopsis-heading" className="px-5 sm:px-8 py-6 grid md:grid-cols-[minmax(0,1fr)_minmax(200px,0.38fr)] gap-6 sm:gap-8">
                  <div>
                    <h3 id="synopsis-heading" className="text-xs uppercase tracking-wider text-fp-lime font-bold mb-2">
                      Sinopsis
                    </h3>
                    <div className="relative">
                      <p className={`text-[#9CA39D] text-xs sm:text-sm leading-relaxed ${synopsisExpanded ? '' : 'line-clamp-3'}`}>
                        {data.overview || 'Sin descripción disponible.'}
                      </p>
                      {data.overview && data.overview.length > 200 && (
                        <button
                          onClick={() => setSynopsisExpanded(v => !v)}
                          className="mt-1.5 flex items-center gap-1 text-fp-lime hover:underline text-xs transition-colors cursor-pointer font-medium"
                        >
                          {synopsisExpanded ? (<><ChevronUp size={14} /> Mostrar menos</>) : (<><ChevronDown size={14} /> Leer más</>)}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm space-y-2">
                    {(director || creators) && (
                      <p className="text-[#9CA39D]">
                        <span className="text-[#636B64]">{detail?.mediaType === 'tv' ? 'Creador: ' : 'Dirección: '}</span>
                        <span className="text-[#F4F6F4] font-medium">{director || creators}</span>
                      </p>
                    )}
                    {data.genres && data.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {data.genres.slice(0, 4).map(g => (
                          <span key={g.id} className="text-xs bg-[#151815] border border-white/[0.08] text-[#9CA39D] px-2.5 py-0.5 rounded-full">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {/* Cast row */}
                <div className="px-5 sm:px-8 pb-4">
                  <CastRow cast={data.credits?.cast || []} />
                </div>

                {/* TRAILERS & EXTRAS */}
                {extraVideos.length > 0 && (
                  <div className="border-t border-white/[0.08] px-5 sm:px-8 py-6">
                    <div className="flex gap-6 mb-4">
                      <TabButton label="Tráilers y Contenido Adicional" active={activeTab === 'trailers'} onClick={() => setActiveTab('trailers')} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {extraVideos.slice(0, 4).map(video => (
                        <a
                          key={video.id}
                          href={`https://www.youtube.com/watch?v=${video.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#151815] mb-2 border border-white/[0.08] group-hover:border-white/20 transition-colors">
                            <Image
                              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                              alt={video.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="300px"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-fp-lime flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                <Play size={16} className="fill-black ml-0.5 text-black" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
                              {video.type}
                            </div>
                          </div>
                          <p className="text-[#F4F6F4] text-xs font-medium line-clamp-1 group-hover:text-fp-lime transition-colors">
                            {video.name}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
