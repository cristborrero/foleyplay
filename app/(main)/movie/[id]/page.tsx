import { tmdb } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import DetailActions from '@/components/detail/DetailActions';
import TVMovieDetail from '@/components/tv/TVMovieDetail';

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const movie = await tmdb.getDetail('movie', Number(id));

    if (!movie) {
      return notFound();
    }

    const title = movie.title || movie.name || movie.original_title;
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';

    return (
      <div className="min-h-screen bg-fp-black">
        {/* Banner Section */}
        <div className="relative h-[45vh] sm:h-[50vh] md:h-[60vh] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-fp-black via-fp-black/80 to-transparent" />

          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 lg:p-12 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-300 mb-3">
              <span>{releaseYear}</span>
              {movie.runtime && <span>{movie.runtime} min</span>}
              <span className="flex items-center text-green-400 font-bold">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
            </div>
            <p className="max-w-full md:max-w-3xl text-gray-200 text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
              {movie.overview}
            </p>
            <DetailActions
              tmdbId={Number(id)}
              mediaType="movie"
              title={title || 'Título desconocido'}
              posterPath={movie.poster_path || ''}
            />
          </div>
        </div>

        {/* Player + Similar Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 max-w-7xl mx-auto">
          <TVMovieDetail
            tmdbId={Number(id)}
            imdbId={movie.imdb_id}
            title={title || ''}
            cast={movie.credits?.cast || []}
            similar={movie.similar?.results || []}
          />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
