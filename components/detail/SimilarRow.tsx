import Link from 'next/link';
import Image from 'next/image';
import { TMDBMedia } from '@/types/tmdb';

interface SimilarRowProps {
  items: TMDBMedia[];
  mediaType: 'movie' | 'tv';
}

export default function SimilarRow({ items, mediaType }: SimilarRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-white text-xl font-bold mb-4">Títulos similares</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {items.slice(0, 12).map((item) => {
          const imagePath = item.backdrop_path || item.poster_path;
          if (!imagePath) return null;
          return (
            <Link
              key={item.id}
              href={`/${item.media_type || mediaType}/${item.id}`}
              className="flex-none w-[180px] group"
            >
              <div className="relative aspect-video rounded overflow-hidden bg-gray-800 mb-2">
                <Image
                  src={`https://image.tmdb.org/t/p/w300${imagePath}`}
                  alt={item.title || item.name || ''}
                  fill
                  className="object-cover group-hover:opacity-80 transition-opacity"
                  sizes="180px"
                />
              </div>
              <p className="text-gray-300 text-xs truncate group-hover:text-white transition-colors">
                {item.title || item.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
