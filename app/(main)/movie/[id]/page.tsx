import { tmdb } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import ServerSelector from '@/components/player/ServerSelector';
import DetailActions from '@/components/detail/DetailActions';
import CastRow from '@/components/detail/CastRow';
import SimilarRow from '@/components/detail/SimilarRow';

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
        <div className="relative h-[40vh] md:h-[60vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-fp-black via-fp-black/80 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
              <span>{releaseYear}</span>
              {movie.runtime && <span>{movie.runtime} min</span>}
              <span className="flex items-center text-green-400 font-bold">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
            </div>
            <p className="max-w-3xl text-gray-200 text-sm md:text-base leading-relaxed">
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

        {/* Player Section */}
        <div className="px-4 md:px-12 py-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-white">Reproducir</h2>
          <ServerSelector mediaType="movie" tmdbId={Number(id)} imdbId={movie.imdb_id} />
          <CastRow cast={movie.credits?.cast || []} />
          <SimilarRow items={movie.similar?.results || []} mediaType="movie" />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}