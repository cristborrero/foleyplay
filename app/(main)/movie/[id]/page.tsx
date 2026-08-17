import { tmdb, extractRating } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import DetailActions from '@/components/detail/DetailActions';
import ServerSelector from '@/components/player/ServerSelector';
import CastRow from '@/components/detail/CastRow';
import SimilarRow from '@/components/detail/SimilarRow';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await tmdb.getDetail('movie', Number(id));
    if (!movie) return { title: 'Película no encontrada — FoleyPlay' };

    const title = movie.title || movie.name || movie.original_title || 'Película';
    const description = movie.overview || `Ver ${title} en streaming en alta definición en FoleyPlay.`;

    return {
      title: `${title} — Ver online en FoleyPlay`,
      description,
      openGraph: {
        title: `${title} — FoleyPlay`,
        description,
        images: movie.backdrop_path
          ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'Película — FoleyPlay' };
  }
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const movie = await tmdb.getDetail('movie', Number(id));
    if (!movie) return notFound();

    const title = movie.title || movie.name || movie.original_title;
    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : '';
    const rating = extractRating(movie);

    // JSON-LD Structured Data (Section 24)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: title,
      description: movie.overview,
      image: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
      datePublished: movie.release_date,
      duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
      aggregateRating: movie.vote_average
        ? {
            '@type': 'AggregateRating',
            ratingValue: movie.vote_average,
            bestRating: '10',
            worstRating: '1',
            ratingCount: movie.vote_count || 100,
          }
        : undefined,
    };

    return (
      <div className="min-h-screen bg-[#080A09] pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Hero Backdrop Area */}
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] w-full flex items-end pt-24 pb-8 overflow-hidden">
          {movie.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={title || ''}
              fill
              className="object-cover object-top brightness-[0.65]"
              priority
              sizes="100vw"
            />
          )}

          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A09] via-[#080A09]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080A09]/95 via-[#080A09]/60 to-transparent" />

          {/* Details Content */}
          <div className="container-editorial relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#F4F6F4] tracking-tight leading-[1.05] mb-3 max-w-4xl drop-shadow-xl">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-[#9CA39D] mb-4 font-medium">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#F4F6F4] border border-white/10 text-xs font-semibold">
                {rating}
              </span>
              {releaseYear && <span>{releaseYear}</span>}
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.vote_average && (
                <span className="text-fp-lime font-bold">
                  ★ {movie.vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>

            {movie.overview && (
              <p className="max-w-3xl text-sm sm:text-base text-[#9CA39D] leading-relaxed mb-6 font-normal">
                {movie.overview}
              </p>
            )}

            <DetailActions
              tmdbId={Number(id)}
              mediaType="movie"
              title={title || 'Película'}
              posterPath={movie.poster_path || ''}
            />
          </div>
        </div>

        {/* Player & Extra Content */}
        <div className="container-editorial py-8">
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F6F4] tracking-tight mb-6">
              Reproductor en Línea
            </h2>
            <ServerSelector
              mediaType="movie"
              tmdbId={Number(id)}
              imdbId={movie.imdb_id}
            />
          </div>

          <CastRow cast={movie.credits?.cast || []} />
          <SimilarRow items={movie.similar?.results || []} mediaType="movie" />
        </div>
      </div>
    );
  } catch {
    return notFound();
  }
}
