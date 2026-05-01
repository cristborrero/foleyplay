import { tmdb } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import DetailActions from '@/components/detail/DetailActions';
import TVMovieDetail from '@/components/tv/TVMovieDetail';

export default async function TVMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const movie = await tmdb.getDetail('movie', Number(id));
    if (!movie) return notFound();

    const title = movie.title || movie.name || movie.original_title || '';
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

    return (
      <div className="overflow-y-auto h-full [&::-webkit-scrollbar]:hidden bg-fp-black" style={{ scrollbarWidth: 'none' }}>
        <div className="relative h-[40vh] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-fp-black via-fp-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h1 className="text-3xl font-bold text-white mb-1 leading-tight">{title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
              <span>{releaseYear}</span>
              {movie.runtime && <span>{movie.runtime} min</span>}
              <span className="text-green-400 font-bold">★ {movie.vote_average?.toFixed(1)}</span>
            </div>
            <p className="text-gray-300 text-sm max-w-2xl line-clamp-2">{movie.overview}</p>
            <DetailActions
              tmdbId={Number(id)}
              mediaType="movie"
              title={title}
              posterPath={movie.poster_path || ''}
            />
          </div>
        </div>

        <div className="px-6 py-4">
          <TVMovieDetail
            tmdbId={Number(id)}
            imdbId={movie.imdb_id}
            similar={movie.similar?.results || []}
          />
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}
