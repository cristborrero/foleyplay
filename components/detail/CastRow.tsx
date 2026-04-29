import Image from 'next/image';
import { TMDBCast } from '@/types/tmdb';

interface CastRowProps {
  cast: TMDBCast[];
}

export default function CastRow({ cast }: CastRowProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-white text-xl font-bold mb-4">Reparto</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {cast.slice(0, 12).map((person) => (
          <div key={person.id} className="flex-none text-center w-24">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-white text-xs font-medium truncate">{person.name}</p>
            <p className="text-gray-400 text-xs truncate">{person.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
