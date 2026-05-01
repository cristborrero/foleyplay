'use client';

import { useState, useEffect } from 'react';

const ratingCache = new Map<string, string>();

interface MediaRatingProps {
  id: number;
  mediaType: 'movie' | 'tv';
  className?: string;
}

function normalizeRating(r: string): string {
  const rating = r.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  
  const mappings: Record<string, string> = {
    'TV-Y': 'G',
    'TV-Y7': 'PG',
    'TV-G': 'G',
    'TV-PG': 'PG',
    'TV-14': 'PG-13',
    'TV-MA': 'R',
    '12': 'PG-13',
    '15': 'R',
    '18': 'NC-17',
    '7': 'G',
    '10': 'PG',
    '13': 'PG-13',
    '16': 'R',
  };

  if (mappings[rating]) return mappings[rating];
  
  // Clean up common variations
  if (rating.includes('PG13')) return 'PG-13';
  if (rating.includes('NC17')) return 'NC-17';
  if (rating === 'APPROVED' || rating === 'PASSED') return 'G';
  
  return rating;
}

export default function MediaRating({ id, mediaType, className = "text-[9px] text-gray-300 border border-gray-600 px-1 rounded-sm leading-tight font-medium" }: MediaRatingProps) {
  const [rating, setRating] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `${mediaType}-${id}`;
    if (ratingCache.has(cacheKey)) {
      setRating(ratingCache.get(cacheKey)!);
      return;
    }

    let isMounted = true;
    
    fetch(`/api/tmdb/${mediaType}/${id}?append_to_response=release_dates,content_ratings`)
      .then(res => res.json())
      .then(data => {
        let r = 'NR';
        if (mediaType === 'tv') {
          if (data.content_ratings?.results) {
            const usRating = data.content_ratings.results.find((cr: any) => cr.iso_3166_1 === 'US');
            r = usRating ? usRating.rating : (data.content_ratings.results[0]?.rating || 'NR');
          }
        } else {
          if (data.release_dates?.results) {
            const usRelease = data.release_dates.results.find((cr: any) => cr.iso_3166_1 === 'US');
            if (usRelease && usRelease.release_dates.length > 0) {
              const rated = usRelease.release_dates.find((d: any) => d.certification !== '');
              r = rated ? rated.certification : 'NR';
            } else {
              for (const country of data.release_dates.results) {
                const rated = country.release_dates.find((d: any) => d.certification !== '');
                if (rated) {
                  r = rated.certification;
                  break;
                }
              }
            }
          }
        }
        
        if (r === '') r = 'NR';
        
        const normalized = normalizeRating(r);
        ratingCache.set(cacheKey, normalized);
        if (isMounted) setRating(normalized);
      })
      .catch(() => {
        if (isMounted) setRating('NR');
      });

    return () => { isMounted = false; };
  }, [id, mediaType]);

  if (!rating) {
    return <span className={`${className} animate-pulse bg-gray-800 text-transparent border-gray-800`}>NR</span>;
  }

  return (
    <span className={className}>
      {rating}
    </span>
  );
}
