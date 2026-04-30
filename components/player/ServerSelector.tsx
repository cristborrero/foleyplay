'use client';

import { useState } from 'react';
import { streamProviders, StreamProvider } from '@/lib/streams';
import { useIsTV } from '@/lib/tv-context';

interface ServerSelectorProps {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  imdbId?: string;
  season?: number;
  episode?: number;
  fullscreen?: boolean;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}

const MULTI_AUDIO_PROVIDERS = ['unlimplay', 'vidlink'];

export default function ServerSelector({ mediaType, tmdbId, imdbId, season, episode, fullscreen = false, iframeRef }: ServerSelectorProps) {
  const isTV = useIsTV();
  const providers = isTV ? streamProviders.filter(p => p.id === 'unlimplay') : streamProviders;

  const [selectedProviderId, setSelectedProviderId] = useState<string>(streamProviders[0]?.id ?? '');
  const activeProvider = providers.find(p => p.id === selectedProviderId) ?? providers[0];
  const [iframeKey, setIframeKey] = useState(0);

  const getUrl = (provider: StreamProvider) => {
    if (mediaType === 'movie') return provider.getMovieUrl(tmdbId, imdbId);
    return provider.getTvUrl(tmdbId, season || 1, episode || 1, imdbId);
  };

  const isDirect = MULTI_AUDIO_PROVIDERS.includes(activeProvider.id);

  return (
    <div className={`w-full flex flex-col space-y-3 ${fullscreen ? 'h-full' : ''}`}>
      {/* Provider Tabs — hidden in TV mode (single provider) */}
      {!isTV && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-gray-500 text-xs whitespace-nowrap shrink-0">Servidor:</span>
          {providers.map((provider) => {
            const isActive = activeProvider.id === provider.id;
            const direct = MULTI_AUDIO_PROVIDERS.includes(provider.id);
            return (
              <button
                key={provider.id}
                onClick={() => { setSelectedProviderId(provider.id); setIframeKey(k => k + 1); }}
                className={`relative px-3 py-1.5 rounded-md whitespace-nowrap font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {provider.name}
                {direct && (
                  <span className={`ml-1.5 text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-red-200' : 'text-green-400'}`}>
                    Multi-audio
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Feature hint for direct providers — hidden in TV mode */}
      {!isTV && isDirect && (
        <p className="text-xs text-gray-500">
          Usá el selector de idioma dentro del reproductor para cambiar entre Inglés y Español.
        </p>
      )}

      {/* Player */}
      <div className={`relative bg-black rounded-lg overflow-hidden border border-gray-800 shadow-2xl ${fullscreen ? 'flex-1 min-h-0 w-full' : 'w-full aspect-video'}`}>
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={getUrl(activeProvider)}
          className="absolute inset-0 w-full h-full"
          tabIndex={isTV ? -1 : undefined}
          allowFullScreen
          referrerPolicy="origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        />
      </div>
    </div>
  );
}
