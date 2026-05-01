'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Plus, Check, ThumbsUp, ThumbsDown, Share2, X,
  ChevronDown, ChevronUp, Flame, Trophy, Star, Clock,
  Volume2, VolumeX,
} from 'lucide-react';
import { useModal } from '@/lib/modal-context';
import { useSession } from 'next-auth/react';
import { TMDBDetail } from '@/types/tmdb';

type UserRating = 'like' | 'dislike' | null;

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

// ─── sub-components ──────────────────────────────────────────────────────────

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
        active ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function DetailModal() {
  const { detail, closeDetail, openPlayer } = useModal();
  const { data: session } = useSession();
  const router = useRouter();

  const [data, setData] = useState<TMDBDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'trailers'>('trailers');
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState<UserRating>(null);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // ── fetch detail ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!detail) { setData(null); return; }
    setLoading(true);
    setSynopsisExpanded(false);
    setIsMuted(true);

    const append = 'credits,videos,release_dates,content_ratings';
    fetch(`/api/tmdb/${detail.mediaType}/${detail.tmdbId}?append_to_response=${append}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [detail?.tmdbId, detail?.mediaType]);

  // ── watchlist ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!detail || !session?.user) return;
    fetch('/api/watchlist')
      .then(r => r.json())
      .then(wl => setInWatchlist(wl.some((i: { tmdbId: number; mediaType: string }) =>
        i.tmdbId === detail.tmdbId && i.mediaType === detail.mediaType)))
      .catch(() => {});
  }, [detail, session]);

  // ── rating ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!detail || !session?.user) { setUserRating(null); return; }
    fetch(`/api/ratings?tmdbId=${detail.tmdbId}&mediaType=${detail.mediaType}`)
      .then(r => r.json())
      .then(d => {
        if (d.score === 5) setUserRating('like');
        else if (d.score === 1) setUserRating('dislike');
        else setUserRating(null);
      })
      .catch(() => setUserRating(null));
  }, [detail?.tmdbId, detail?.mediaType, session?.user]);

  const toggleWatchlist = async () => {
    if (!data || !session?.user) return;
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tmdbId: data.id, mediaType: detail!.mediaType, title: data.title || data.name || '', posterPath: data.poster_path }),
    }).then(r => r.json()).catch(() => null);
    if (res) setInWatchlist(res.added);
  };

  const handleRating = async (newRating: UserRating) => {
    if (!session?.user || !data) return;
    const next = userRating === newRating ? null : newRating;
    const prev = userRating;
    setUserRating(next);
    if (next === null) {
      fetch(`/api/ratings?tmdbId=${data.id}&mediaType=${detail!.mediaType}`, { method: 'DELETE' })
        .then(r => { if (!r.ok) setUserRating(prev); })
        .catch(() => setUserRating(prev));
    } else {
      fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId: data.id, mediaType: detail!.mediaType, score: next === 'like' ? 5 : 1 }),
      })
        .then(r => { if (!r.ok) setUserRating(prev); })
        .catch(() => setUserRating(prev));
    }
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

  // ── derived ─────────────────────────────────────────────────────────────
  const title = data?.title || data?.name || '';
  const year = data?.release_date
    ? new Date(data.release_date).getFullYear()
    : data?.first_air_date ? new Date(data.first_air_date).getFullYear() : null;
  const certification = data ? getCertification(data, detail?.mediaType || 'movie') : '';
  const score = data ? Math.round(data.vote_average * 10) : 0;
  const trailer = data?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const extraVideos = data?.videos?.results?.filter(v => v.site === 'YouTube') || [];
  const director = data?.credits?.crew?.find(c => c.job === 'Director')?.name || '';
  const creators = data?.created_by?.map(c => c.name).join(', ') || '';
  const isTopRated = (data?.vote_average ?? 0) >= 7.5 && (data?.vote_count ?? 0) >= 500;

  const scoreColor = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-fp-lime';

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] bg-black/85 flex items-start justify-center overflow-y-auto py-4 sm:py-6 px-2 sm:px-3 md:px-6"
          onClick={e => { if (e.target === e.currentTarget) closeDetail(); }}
        >
          <motion.div
            initial={{ y: 32, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-4xl bg-[#141414] rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.9)] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* ── close ── */}
            <button
              onClick={closeDetail}
              className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full p-2 text-white hover:bg-black/80 transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            {/* ══════════════════════════════════════════════════════════
                HERO
            ══════════════════════════════════════════════════════════ */}
            {loading || !data ? (
              <div className="min-h-[40vh] sm:min-h-[52vh] flex items-center justify-center bg-[#1a1a1a]">
                <div className="w-10 h-10 border-2 border-fp-lime border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <div className="relative w-full min-h-[40vh] sm:min-h-[52vh] bg-black overflow-hidden">
                  {/* backdrop or trailer */}
                  {trailer ? (
                    <iframe
                      key={isMuted ? 'trailer-muted' : 'trailer-unmuted'}
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${trailer.key}`}
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
                  <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/50 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-transparent" />

                  {/* mute/unmute button */}
                  {trailer && (
                    <button
                      onClick={() => setIsMuted(v => !v)}
                      aria-label={isMuted ? 'Activar audio' : 'Silenciar'}
                      className="absolute bottom-6 right-6 z-10 w-9 h-9 rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:border-white hover:bg-black/70 transition-all"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  )}

                  {/* hero content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                    <motion.h2
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                      className="text-white text-xl sm:text-3xl md:text-5xl font-black mb-2 sm:mb-4 drop-shadow-lg max-w-2xl leading-tight"
                    >
                      {title}
                    </motion.h2>

                    {/* action buttons */}
                    <motion.div
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.18, duration: 0.3 }}
                      className="flex items-center gap-2 sm:gap-3 flex-wrap"
                    >
                      {/* Play */}
                      <button
                        onClick={handlePlay}
                        className="flex items-center gap-1.5 sm:gap-2 bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm hover:bg-white/90 transition-all hover:[box-shadow:0_0_20px_rgba(255,255,255,0.25)] active:scale-[0.97]"
                      >
                        <Play size={16} className="fill-black" />
                        Reproducir
                      </button>

                      {/* My list */}
                      <button
                        onClick={toggleWatchlist}
                        className="flex items-center gap-1.5 sm:gap-2 bg-white/15 border border-white/40 text-white font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded text-sm hover:bg-white/25 transition-all active:scale-[0.97] backdrop-blur-sm"
                      >
                        {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                        {inWatchlist ? 'En mi lista' : 'Mi lista'}
                      </button>

                      {/* More info */}
                      <Link
                        href={`/${detail?.mediaType}/${data.id}`}
                        onClick={closeDetail}
                        className="hidden sm:flex items-center gap-2 bg-white/15 border border-white/40 text-white font-semibold px-5 py-2 sm:py-2.5 rounded text-sm hover:bg-white/25 transition-all active:scale-[0.97] backdrop-blur-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        Más información
                      </Link>

                      {/* icon buttons */}
                      <button
                        onClick={() => handleRating('like')}
                        title="Me gusta"
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                          userRating === 'like'
                            ? 'border-white bg-white text-black'
                            : 'border-white/40 text-white hover:border-white bg-white/10 backdrop-blur-sm'
                        }`}
                      >
                        <ThumbsUp size={16} />
                      </button>

                      <button
                        onClick={() => handleRating('dislike')}
                        title="No me gusta"
                        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                          userRating === 'dislike'
                            ? 'border-white bg-white text-black'
                            : 'border-white/40 text-white hover:border-white bg-white/10 backdrop-blur-sm'
                        }`}
                      >
                        <ThumbsDown size={16} />
                      </button>

                      <button
                        onClick={handleShare}
                        title="Compartir"
                        className="w-10 h-10 rounded-full border border-white/40 text-white hover:border-white bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all relative"
                      >
                        <Share2 size={16} />
                        <AnimatePresence>
                          {copied && (
                            <motion.span
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap border border-white/10"
                            >
                              ¡Copiado!
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* ══════════════════════════════════════════════════════════
                    METADATA BAR
                ══════════════════════════════════════════════════════════ */}
                <div className="px-4 sm:px-6 md:px-8 pt-5 pb-4 flex items-center gap-3 flex-wrap">
                  {certification && (
                    <span className="border border-gray-500 text-gray-300 text-xs px-1.5 py-0.5 rounded font-semibold">
                      {certification}
                    </span>
                  )}

                  <span className={`font-bold text-sm ${scoreColor}`}>★ {score}%</span>

                  {year && <span className="text-gray-300 text-sm">{year}</span>}

                  {data.runtime && (
                    <span className="text-gray-300 text-sm flex items-center gap-1">
                      <Clock size={13} className="text-gray-500" />
                      {formatRuntime(data.runtime)}
                    </span>
                  )}

                  {data.number_of_seasons && (
                    <span className="text-gray-300 text-sm">
                      {data.number_of_seasons} {data.number_of_seasons === 1 ? 'temporada' : 'temporadas'}
                    </span>
                  )}

                  {/* contextual badges */}
                  {isTopRated && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-400/10 border border-orange-400/30 px-2 py-0.5 rounded-full">
                      <Flame size={11} className="fill-orange-400" />
                      Top 10 esta semana
                    </span>
                  )}

                  {data.vote_average >= 8 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full">
                      <Trophy size={11} />
                      Muy valorada
                    </span>
                  )}

                  {data.vote_average >= 8.5 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/30 px-2 py-0.5 rounded-full">
                      <Star size={11} className="fill-blue-400" />
                      Elección de la crítica
                    </span>
                  )}
                </div>

                {/* ══════════════════════════════════════════════════════════
                    SYNOPSIS + DETAILS
                ══════════════════════════════════════════════════════════ */}
                <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 grid md:grid-cols-[1fr_auto] gap-4 sm:gap-6">
                  {/* left: synopsis */}
                  <div>
                    <div className="relative">
                      <p className={`text-gray-200 text-sm leading-relaxed ${synopsisExpanded ? '' : 'line-clamp-3'}`}>
                        {data.overview || 'Sin descripción disponible.'}
                      </p>
                      {data.overview && data.overview.length > 200 && (
                        <button
                          onClick={() => setSynopsisExpanded(v => !v)}
                          className="mt-1.5 flex items-center gap-1 text-gray-400 hover:text-white text-xs transition-colors"
                        >
                          {synopsisExpanded ? (<><ChevronUp size={14} /> Menos</>) : (<><ChevronDown size={14} /> Más</>)}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* right: extra info */}
                  <div className="text-sm space-y-1.5 w-full md:min-w-[180px]">
                    {(director || creators) && (
                      <p className="text-gray-400">
                        <span className="text-gray-600">{detail?.mediaType === 'tv' ? 'Creador: ' : 'Director: '}</span>
                        <span className="text-gray-200">{director || creators}</span>
                      </p>
                    )}
                    {data.genres && data.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {data.genres.slice(0, 4).map(g => (
                          <span key={g.id} className="text-xs border border-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cast row inline */}
                {(data.credits?.cast?.length ?? 0) > 0 && (
                  <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
                    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                      {data.credits!.cast.slice(0, 12).map(person => (
                        <div key={person.id} className="flex-none text-center w-20">
                          <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#2a2a2a] mb-1.5">
                            {person.profile_path ? (
                              <Image src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} fill className="object-cover" sizes="64px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-white text-[10px] font-medium leading-tight truncate">{person.name}</p>
                          <p className="text-gray-500 text-[9px] truncate">{person.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════════════════════════════════
                    TABS
                ══════════════════════════════════════════════════════════ */}
                <div className="border-t border-white/8">
                  {/* tab header */}
                  {extraVideos.length > 0 && (
                    <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 flex gap-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                      <TabButton label="Trailers y extras" active={activeTab === 'trailers'} onClick={() => setActiveTab('trailers')} />
                    </div>
                  )}

                  {/* tab content */}
                  <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5">

                    {/* ── TRAILERS ── */}
                    {activeTab === 'trailers' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {extraVideos.slice(0, 8).map(video => (
                          <a
                            key={video.id}
                            href={`https://www.youtube.com/watch?v=${video.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                          >
                            <div className="relative aspect-video rounded-md overflow-hidden bg-[#2a2a2a] mb-2">
                              <Image
                                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                alt={video.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="300px"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play size={20} className="fill-black ml-0.5" />
                                </div>
                              </div>
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                                {video.type}
                              </div>
                            </div>
                            <p className="text-gray-200 text-xs font-medium line-clamp-2 group-hover:text-white transition-colors">{video.name}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
