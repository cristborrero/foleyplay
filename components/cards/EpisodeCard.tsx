import Image from 'next/image';
import { TMDBEpisode } from '@/types/tmdb';

interface EpisodeCardProps {
  episode: TMDBEpisode;
  isActive?: boolean;
  onClick?: () => void;
}

export default function EpisodeCard({ episode, isActive = false, onClick }: EpisodeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start text-left w-full p-3 rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${
        isActive
          ? 'bg-[#333] border-l-4 border-red-600'
          : 'bg-netflix-dark hover:bg-[#242424] border-l-4 border-transparent'
      }`}
    >
      {episode.still_path && (
        <div className="relative w-28 aspect-video flex-none rounded overflow-hidden mr-3">
          <Image
            src={`https://image.tmdb.org/t/p/w185${episode.still_path}`}
            alt={episode.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-gray-500 font-bold text-sm shrink-0">{episode.episode_number}.</span>
          <h4 className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
            {episode.name}
          </h4>
        </div>
        {episode.runtime ? (
          <p className="text-gray-500 text-xs">{episode.runtime} min</p>
        ) : null}
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
          {episode.overview || 'Sin descripción disponible.'}
        </p>
      </div>
    </button>
  );
}
