'use client';

import { useState, useEffect } from 'react';
import TVUserCarousel from '@/components/tv/TVUserCarousel';

export default function TVWatchlistPage() {
  const [hasItems, setHasItems] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/watchlist')
      .then(r => r.json())
      .then(d => setHasItems(Array.isArray(d) && d.length > 0))
      .catch(() => setHasItems(false));
  }, []);

  return (
    <div className="overflow-y-auto h-full [&::-webkit-scrollbar]:hidden pt-4" style={{ scrollbarWidth: 'none' }}>
      <h1 className="text-white text-xl font-bold mb-6 px-8 lg:px-12">Mi Lista</h1>
      {hasItems === false ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400 text-lg">Tu lista está vacía.</p>
          <p className="text-gray-600 text-sm mt-2">Agregá películas y series para verlas más tarde.</p>
        </div>
      ) : (
        <TVUserCarousel title="" fetchUrl="/api/watchlist" />
      )}
    </div>
  );
}
