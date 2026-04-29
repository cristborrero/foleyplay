'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserItem {
  _id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath: string;
  progress?: number;
  season?: number;
  episode?: number;
}

interface UserContentRowProps {
  title: string;
  fetchUrl: string;
  showProgress?: boolean;
}

export default function UserContentRow({ title, fetchUrl, showProgress = false }: UserContentRowProps) {
  const [items, setItems] = useState<UserItem[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(fetchUrl);
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(`UserContentRow fetch error (${fetchUrl}):`, e);
      }
    }
    fetchData();
  }, [fetchUrl]);

  if (items.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { scrollLeft, clientWidth } = rowRef.current;
    rowRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="pl-4 md:pl-12 my-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center rounded-l"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll py-4 pr-4 md:pr-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <Link
              key={item._id}
              href={`/${item.mediaType}/${item.tmdbId}`}
              className="flex-none w-[150px] md:w-[200px] group/card"
            >
              <div className="relative aspect-2/3 rounded-md overflow-hidden bg-gray-800">
                {item.posterPath ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${item.posterPath}`}
                    alt={item.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover/card:opacity-80"
                    sizes="200px"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">
                    {item.title}
                  </div>
                )}
                {showProgress && item.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                    />
                  </div>
                )}
                {item.mediaType === 'tv' && item.season && item.episode && (
                  <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white">
                    T{item.season}E{item.episode}
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-xs mt-2 truncate group-hover/card:text-white transition-colors">
                {item.title}
              </p>
            </Link>
          ))}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center rounded-r"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
