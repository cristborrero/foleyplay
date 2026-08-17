import Image from 'next/image';
import { UserRound } from 'lucide-react';
import { TMDBCast } from '@/types/tmdb';

interface CastRowProps {
  cast: TMDBCast[];
}

export default function CastRow({ cast }: CastRowProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="pt-5 pb-6" aria-labelledby="cast-heading">
      <h3 id="cast-heading" className="text-[0.68rem] uppercase tracking-[0.2em] text-fp-lime font-bold mb-4">Reparto</h3>
      <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-2 content-row-scroll" aria-label="Actores principales">
        {cast.slice(0, 12).map((person) => (
          <div key={person.id} className="flex-none text-center w-[4.75rem] sm:w-24">
            <div className="relative w-[4.25rem] h-[4.25rem] sm:w-20 sm:h-20 mx-auto rounded-full overflow-hidden bg-fp-elevated border border-white/10 mb-2">
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <UserRound size={28} strokeWidth={1.2} aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="text-white text-[11px] sm:text-xs font-medium truncate">{person.name}</p>
            <p className="text-gray-500 text-[10px] sm:text-xs truncate">{person.character || 'Reparto'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
