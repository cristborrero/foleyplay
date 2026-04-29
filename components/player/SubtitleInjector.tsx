'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Cue {
  start: number;
  end: number;
  text: string;
}

interface SubtitleTrack {
  id: string;
  language: string;
  url: string;
}

interface SubtitleInjectorProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

function parseVTT(vttText: string): Cue[] {
  const cues: Cue[] = [];
  const blocks = vttText.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const timeLine = lines.find(l => l.includes('-->'));
    if (!timeLine) continue;

    const [startStr, endStr] = timeLine.split('-->').map(s => s.trim().split(' ')[0]);
    const toSeconds = (t: string) => {
      const parts = t.split(':').map(Number);
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
      return parts[0] * 60 + parts[1];
    };

    const textLines = lines.filter(l => !l.includes('-->') && !/^\d+$/.test(l.trim()) && l !== 'WEBVTT');
    const text = textLines.join('\n').trim().replace(/<[^>]+>/g, '');
    if (text) cues.push({ start: toSeconds(startStr), end: toSeconds(endStr), text });
  }

  return cues;
}

export default function SubtitleInjector({ tmdbId, mediaType, season, episode }: SubtitleInjectorProps) {
  const [tracks, setTracks] = useState<SubtitleTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SubtitleTrack | null>(null);
  const [cues, setCues] = useState<Cue[]>([]);
  const [currentCue, setCurrentCue] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const elapsedAtPauseRef = useRef(0);

  // Fetch available tracks once
  useEffect(() => {
    setLoadingTracks(true);
    const params = new URLSearchParams({ tmdbId: String(tmdbId), mediaType, language: 'es' });
    if (season) params.set('season', String(season));
    if (episode) params.set('episode', String(episode));

    fetch(`/api/subtitles?${params}`)
      .then(r => r.json())
      .then(d => setTracks(d.subtitles || []))
      .catch(() => {})
      .finally(() => setLoadingTracks(false));
  }, [tmdbId, mediaType, season, episode]);

  // Load VTT when track selected
  useEffect(() => {
    if (!selectedTrack) { setCues([]); return; }
    fetch(selectedTrack.url)
      .then(r => r.text())
      .then(text => setCues(parseVTT(text)))
      .catch(() => setCues([]));
  }, [selectedTrack]);

  // Timer tick
  const tick = useCallback(() => {
    const now = performance.now();
    setElapsed(elapsedAtPauseRef.current + (now - startedAtRef.current) / 1000);
  }, []);

  const startTimer = useCallback(() => {
    startedAtRef.current = performance.now();
    intervalRef.current = setInterval(tick, 250);
    setRunning(true);
  }, [tick]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    elapsedAtPauseRef.current = elapsed;
    setRunning(false);
  }, [elapsed]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    elapsedAtPauseRef.current = 0;
    setElapsed(0);
    setRunning(false);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // Find current cue
  useEffect(() => {
    const t = elapsed + offset;
    const cue = cues.find(c => t >= c.start && t <= c.end);
    setCurrentCue(cue?.text ?? null);
  }, [elapsed, offset, cues]);

  if (!tracks.length && !loadingTracks) return null;

  return (
    <>
      {/* Subtitle overlay */}
      <AnimatePresence>
        {currentCue && (
          <motion.div
            key={currentCue}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none z-20 px-4"
          >
            <span className="bg-black/75 text-white text-sm md:text-base font-medium px-3 py-1 rounded text-center leading-relaxed whitespace-pre-line">
              {currentCue}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls toggle */}
      <div className="absolute bottom-2 right-2 z-30">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/70 hover:bg-black/90 text-white text-xs rounded-lg border border-white/10 transition-all"
          title="Subtítulos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
          CC
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-9 right-0 w-64 bg-fp-elevated border border-white/10 rounded-xl p-3 text-white text-xs shadow-2xl"
            >
              <p className="font-semibold mb-2 text-white/70 uppercase tracking-wide">Subtítulos</p>

              {/* Track selector */}
              <div className="flex flex-col gap-1 mb-3">
                <button
                  onClick={() => { setSelectedTrack(null); resetTimer(); }}
                  className={`text-left px-2 py-1.5 rounded-lg transition-colors ${!selectedTrack ? 'bg-red-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}
                >
                  Apagado
                </button>
                {loadingTracks && <p className="text-gray-500 px-2">Cargando…</p>}
                {tracks.slice(0, 5).map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTrack(t); resetTimer(); }}
                    className={`text-left px-2 py-1.5 rounded-lg transition-colors capitalize ${selectedTrack?.id === t.id ? 'bg-red-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}
                  >
                    {t.language === 'es' ? 'Español' : t.language === 'en' ? 'Inglés' : t.language}
                  </button>
                ))}
              </div>

              {/* Timer controls — only when track selected */}
              {selectedTrack && (
                <>
                  <div className="border-t border-white/10 pt-2 mb-2">
                    <p className="text-gray-500 mb-1.5">Tiempo: {Math.floor(elapsed / 60)}:{String(Math.floor(elapsed % 60)).padStart(2, '0')}</p>
                    <div className="flex items-center gap-1.5">
                      {running ? (
                        <button onClick={pauseTimer} className="flex-1 bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg transition-colors">Pausar</button>
                      ) : (
                        <button onClick={startTimer} className="flex-1 bg-red-600 hover:bg-red-500 px-2 py-1.5 rounded-lg transition-colors">
                          {elapsed === 0 ? 'Iniciar' : 'Reanudar'}
                        </button>
                      )}
                      <button onClick={resetTimer} className="bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg transition-colors">↺</button>
                    </div>
                  </div>

                  {/* Offset */}
                  <div className="border-t border-white/10 pt-2">
                    <p className="text-gray-500 mb-1.5">Desfase: {offset > 0 ? '+' : ''}{offset}s</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => setOffset(o => o - 0.5)} className="flex-1 bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg">−0.5s</button>
                      <button onClick={() => setOffset(0)} className="bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg">0</button>
                      <button onClick={() => setOffset(o => o + 0.5)} className="flex-1 bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg">+0.5s</button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
