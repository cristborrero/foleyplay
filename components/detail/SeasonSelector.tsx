'use client';

import { useRef, useState, useEffect } from 'react';
import { TMDBEpisode } from '@/types/tmdb';
import ServerSelector from '@/components/player/ServerSelector';
import EpisodeCard from '@/components/cards/EpisodeCard';
import { useIsTV } from '@/lib/tv-context';
import TVPlayerControls from '@/components/tv/TVPlayerControls';

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
}

interface SeasonSelectorProps {
  tmdbId: number;
  seasons: Season[];
  imdbId?: string;
}

export default function SeasonSelector({ tmdbId, seasons, imdbId }: SeasonSelectorProps) {
  const isTV = useIsTV();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeSeason, setActiveSeason] = useState<number>(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEpisodes() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tmdb/tv/${tmdbId}/season/${activeSeason}`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
        // Si hay episodios, no reproducimos automáticamente por ahora para no recargar el iframe innecesariamente
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEpisodes();
  }, [tmdbId, activeSeason]);

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
      {/* Left Column: Seasons and Episodes */}
      <div className="w-full md:w-1/3 flex flex-col space-y-4">
        {/* Season Dropdown */}
        <select
          className="bg-[#242424] text-white p-3 rounded border border-gray-700 outline-none focus:border-white transition-colors"
          value={activeSeason}
          onChange={(e) => {
            setActiveSeason(Number(e.target.value));
            setActiveEpisode(null); // Reset playing episode when changing season
          }}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              {season.name} ({season.episode_count} episodios)
            </option>
          ))}
        </select>

        {/* Episodes List */}
        <div className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
          {isLoading ? (
            <div className="text-gray-400 py-4 text-center">Cargando episodios...</div>
          ) : (
            episodes.map((ep) => (
              <EpisodeCard
                key={ep.id}
                episode={ep}
                isActive={activeEpisode === ep.episode_number}
                onClick={() => setActiveEpisode(ep.episode_number)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Column: Player */}
      <div className="w-full md:w-2/3">
        {activeEpisode ? (
          <div className="relative">
            {!isTV && (
              <h3 className="text-base sm:text-xl text-white mb-3 sm:mb-4">
                Reproduciendo: Episodio {activeEpisode}
              </h3>
            )}
            <ServerSelector
              mediaType="tv"
              tmdbId={tmdbId}
              imdbId={imdbId}
              season={activeSeason}
              episode={activeEpisode}
              iframeRef={iframeRef}
            />
            {isTV && <TVPlayerControls title={`Episodio ${activeEpisode}`} iframeRef={iframeRef} />}
          </div>
        ) : (
          <div className="w-full aspect-video bg-[#141414] rounded-lg flex items-center justify-center border border-gray-800">
            <p className="text-gray-500">Selecciona un episodio para empezar a ver</p>
          </div>
        )}
      </div>
    </div>
  );
}