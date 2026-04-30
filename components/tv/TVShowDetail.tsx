'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsTV } from '@/lib/tv-context';
import { TMDBMedia, TMDBCast, TMDBEpisode } from '@/types/tmdb';
import ServerSelector from '@/components/player/ServerSelector';
import SeasonSelector from '@/components/detail/SeasonSelector';
import CastRow from '@/components/detail/CastRow';
import SimilarRow from '@/components/detail/SimilarRow';
import TVSimilarPanel from '@/components/tv/TVSimilarPanel';
import { Maximize, Minimize } from 'lucide-react';

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
}

interface TVShowDetailProps {
  tmdbId: number;
  seasons: Season[];
  imdbId?: string;
  cast: TMDBCast[];
  similar: TMDBMedia[];
}

function TVModeLayout({ tmdbId, seasons, imdbId, similar }: Omit<TVShowDetailProps, 'cast'>) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeSeason, setActiveSeason] = useState<number>(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/tmdb/tv/${tmdbId}/season/${activeSeason}`)
      .then(r => r.json())
      .then(d => setEpisodes(d.episodes || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [tmdbId, activeSeason]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left: season picker + player + episodes */}
      <div className="flex flex-col gap-3 flex-[3] min-w-0">
        {/* Season selector + fullscreen button */}
        <div data-tv-row className="flex gap-2 items-center shrink-0">
          <select
            className="bg-[#242424] text-white p-2 rounded border border-gray-700 outline-none text-sm flex-1"
            value={activeSeason}
            onChange={(e) => { setActiveSeason(Number(e.target.value)); setActiveEpisode(null); }}
          >
            {seasons.map((s) => (
              <option key={s.id} value={s.season_number}>{s.name}</option>
            ))}
          </select>
          <button
            data-tv-card
            tabIndex={0}
            onClick={toggleFullscreen}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); toggleFullscreen(); } }}
            className="flex items-center gap-2 text-white bg-[#222] hover:bg-[#333] focus:bg-[#333] rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500 transition-colors shrink-0"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'Salir' : 'Pantalla completa'}</span>
          </button>
        </div>

        {/* Player */}
        {activeEpisode ? (
          <ServerSelector
            mediaType="tv"
            tmdbId={tmdbId}
            imdbId={imdbId}
            season={activeSeason}
            episode={activeEpisode}
            iframeRef={iframeRef}
          />
        ) : (
          <div className="w-full aspect-video bg-[#141414] rounded-lg flex items-center justify-center border border-gray-800 shrink-0">
            <p className="text-gray-500 text-sm">Seleccioná un episodio para reproducir</p>
          </div>
        )}

        {/* Episode list */}
        <div
          data-tv-row
          className="flex flex-col gap-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', maxHeight: '35vh' }}
        >
          {isLoading ? (
            <div className="text-gray-400 py-4 text-center text-sm">Cargando episodios...</div>
          ) : (
            episodes.map((ep) => (
              <div
                key={ep.id}
                data-tv-card
                tabIndex={0}
                onClick={() => setActiveEpisode(ep.episode_number)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setActiveEpisode(ep.episode_number); } }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                  activeEpisode === ep.episode_number
                    ? 'bg-red-600/20 ring-1 ring-red-500/60'
                    : 'hover:bg-white/5 focus:bg-white/5'
                }`}
              >
                <span className="text-gray-500 text-xs w-5 shrink-0 text-center font-mono">
                  {ep.episode_number}
                </span>
                <span className="text-white text-sm truncate">{ep.name}</span>
                {ep.runtime > 0 && (
                  <span className="text-gray-600 text-xs shrink-0 ml-auto">{ep.runtime}m</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: similar titles */}
      <div
        className="flex-[2] min-w-0 overflow-y-auto [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        <TVSimilarPanel items={similar} mediaType="tv" />
      </div>
    </div>
  );
}

export default function TVShowDetail({ tmdbId, seasons, imdbId, cast, similar }: TVShowDetailProps) {
  const isTV = useIsTV();

  if (!isTV) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-white">Episodios</h2>
        <SeasonSelector tmdbId={tmdbId} seasons={seasons} imdbId={imdbId} />
        <CastRow cast={cast} />
        <SimilarRow items={similar} mediaType="tv" />
      </>
    );
  }

  return (
    <TVModeLayout
      tmdbId={tmdbId}
      seasons={seasons}
      imdbId={imdbId}
      similar={similar}
    />
  );
}
