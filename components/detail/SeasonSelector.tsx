'use client';

import { useState, useEffect } from 'react';
import { TMDBEpisode } from '@/types/tmdb';
import ServerSelector from '@/components/player/ServerSelector';
import EpisodeCard from '@/components/cards/EpisodeCard';

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
  const [activeSeason, setActiveSeason] = useState<number>(seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/tmdb/tv/${tmdbId}/season/${activeSeason}`)
      .then(r => r.json())
      .then(d => setEpisodes(d.episodes || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [tmdbId, activeSeason]);

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-8">
      <div className="w-full md:w-1/3 flex flex-col space-y-4">
        <select
          className="bg-[#242424] text-white p-3 rounded border border-gray-700 outline-none focus:border-white transition-colors"
          value={activeSeason}
          onChange={(e) => { setActiveSeason(Number(e.target.value)); setActiveEpisode(null); }}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              {season.name} ({season.episode_count} episodios)
            </option>
          ))}
        </select>

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

      <div className="w-full md:w-2/3">
        {activeEpisode ? (
          <>
            <h3 className="text-base sm:text-xl text-white mb-3 sm:mb-4">
              Reproduciendo: Episodio {activeEpisode}
            </h3>
            <ServerSelector
              mediaType="tv" tmdbId={tmdbId} imdbId={imdbId}
              season={activeSeason} episode={activeEpisode}
            />
          </>
        ) : (
          <div className="w-full aspect-video bg-[#141414] rounded-lg flex items-center justify-center border border-gray-800">
            <p className="text-gray-500">Selecciona un episodio para empezar a ver</p>
          </div>
        )}
      </div>
    </div>
  );
}
