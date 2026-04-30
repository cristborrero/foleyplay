'use client';

import { useRef } from 'react';
import { useIsTV } from '@/lib/tv-context';
import ServerSelector from '@/components/player/ServerSelector';
import TVPlayerControls from '@/components/tv/TVPlayerControls';

interface TVDetailPlayerProps {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  imdbId?: string;
  title: string;
}

export default function TVDetailPlayer({ mediaType, tmdbId, imdbId, title }: TVDetailPlayerProps) {
  const isTV = useIsTV();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!isTV) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-white">Reproducir</h2>
        <ServerSelector mediaType={mediaType} tmdbId={tmdbId} imdbId={imdbId} />
      </>
    );
  }

  return (
    <div className="relative">
      <ServerSelector mediaType={mediaType} tmdbId={tmdbId} imdbId={imdbId} iframeRef={iframeRef} />
      <TVPlayerControls title={title} iframeRef={iframeRef} />
    </div>
  );
}
