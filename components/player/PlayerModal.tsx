'use client';

import { useEffect, useRef, useState } from 'react';
import { useModal } from '@/lib/modal-context';
import ServerSelector from './ServerSelector';
import SubtitleInjector from './SubtitleInjector';
import { AnimatePresence, motion } from 'framer-motion';
import { useHistory } from '@/hooks/useHistory';
import MediaRating from '@/components/cards/MediaRating';

export default function PlayerModal() {
  const { player, closePlayer } = useModal();
  const { logView } = useHistory();
  const [showSlowHint, setShowSlowHint] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Register in history on open
  useEffect(() => {
    if (!player) return;
    logView({
      tmdbId: player.tmdbId,
      mediaType: player.mediaType,
      title: player.title,
      posterPath: player.posterPath || '',
      season: player.season,
      episode: player.episode,
      progress: 5,
    });
  }, [player, logView]);

  // 30-second slow hint
  useEffect(() => {
    setShowSlowHint(false);
    if (!player) return;
    timeoutRef.current = setTimeout(() => setShowSlowHint(true), 30000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [player]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closePlayer(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closePlayer]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = player ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [player]);

  return (
    <AnimatePresence>
      {player && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-8 py-2 sm:py-3 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight">{player.title}</p>
                <MediaRating id={player.tmdbId} mediaType={player.mediaType} className="text-[10px] text-gray-300 border border-gray-600 px-1 py-0.5 rounded-sm font-medium" />
              </div>
              {player.mediaType === 'tv' && player.season && (
                <p className="text-gray-400 text-sm mt-0.5">
                  Temporada {player.season} — Episodio {player.episode}
                </p>
              )}
            </div>
            <button
              onClick={closePlayer}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Player */}
          <div className="flex-1 px-2 sm:px-4 md:px-8 pb-2 min-h-0 relative flex flex-col">
            <ServerSelector
              mediaType={player.mediaType}
              tmdbId={player.tmdbId}
              imdbId={player.imdbId}
              season={player.season}
              episode={player.episode}
              fullscreen
            />
            <SubtitleInjector
              tmdbId={player.tmdbId}
              mediaType={player.mediaType}
              season={player.season}
              episode={player.episode}
            />
          </div>

          {/* Slow hint */}
          <AnimatePresence>
            {showSlowHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-2 sm:mx-4 md:mx-8 mb-3 px-3 sm:px-4 py-2 sm:py-3 bg-fp-elevated rounded-lg text-xs sm:text-sm text-gray-300 flex items-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                ¿El video no carga? Probá otro servidor en los botones de arriba.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
