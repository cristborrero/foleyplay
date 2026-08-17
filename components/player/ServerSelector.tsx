'use client';

import { useState } from 'react';
import { streamProviders, StreamProvider } from '@/lib/streams';

interface ServerSelectorProps {
  mediaType: 'movie' | 'tv';
  tmdbId: number;
  imdbId?: string;
  season?: number;
  episode?: number;
  fullscreen?: boolean;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  tvMode?: boolean;
}

const MULTI_AUDIO_PROVIDERS = ['unlimplay', 'vidlink'];

export default function ServerSelector({
  mediaType,
  tmdbId,
  imdbId,
  season,
  episode,
  fullscreen = false,
  iframeRef,
  tvMode = false,
}: ServerSelectorProps) {
  const providers = tvMode
    ? streamProviders.filter((p) => p.id === 'unlimplay')
    : streamProviders;
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    streamProviders[0]?.id ?? ''
  );
  const [iframeKey, setIframeKey] = useState(0);

  const activeProvider =
    providers.find((p) => p.id === selectedProviderId) ?? providers[0];

  const getUrl = (provider: StreamProvider) => {
    if (mediaType === 'movie') return provider.getMovieUrl(tmdbId, imdbId);
    return provider.getTvUrl(tmdbId, season || 1, episode || 1, imdbId);
  };

  const isMultiAudio = MULTI_AUDIO_PROVIDERS.includes(activeProvider.id);
  const isLatam = activeProvider.id === 'latam-direct';

  return (
    <div className={`w-full flex flex-col space-y-3 ${fullscreen ? 'h-full' : ''}`}>
      {!tvMode && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          <span className="text-[#9CA39D] text-xs font-semibold uppercase tracking-wider shrink-0 mr-1">
            Servidor:
          </span>
          {providers.map((provider) => {
            const isActive = activeProvider.id === provider.id;
            const isDirectMulti = MULTI_AUDIO_PROVIDERS.includes(provider.id);
            const isLatamProvider = provider.id === 'latam-direct';

            return (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedProviderId(provider.id);
                  setIframeKey((k) => k + 1);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium text-xs transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-fp-lime text-black font-bold border-fp-lime'
                    : 'bg-[#151815] text-[#9CA39D] hover:text-[#F4F6F4] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <span>{provider.name}</span>
                {isLatamProvider && (
                  <span
                    className={`text-[9px] font-black uppercase px-1 py-0.2 rounded ${
                      isActive ? 'bg-black text-fp-lime' : 'bg-fp-lime/20 text-fp-lime'
                    }`}
                  >
                    Latino
                  </span>
                )}
                {isDirectMulti && (
                  <span
                    className={`text-[9px] font-bold uppercase ${
                      isActive ? 'text-black/70' : 'text-[#9CA39D]'
                    }`}
                  >
                    Multi-audio
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {!tvMode && isMultiAudio && (
        <p className="text-xs text-[#9CA39D]">
          Usá el selector de audio dentro del reproductor para cambiar entre Inglés y Español.
        </p>
      )}

      {!tvMode && isLatam && (
        <p className="text-xs text-[#9CA39D]">
          Stream HLS directo en audio Latino. Si este título aún no está disponible en este servidor, selecciona otro de la lista.
        </p>
      )}

      <div
        className={`relative bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl ${
          fullscreen ? 'flex-1 min-h-0 w-full' : 'w-full aspect-video'
        }`}
      >
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={getUrl(activeProvider)}
          className="absolute inset-0 w-full h-full"
          tabIndex={tvMode ? -1 : undefined}
          allowFullScreen
          referrerPolicy="origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        />
      </div>
    </div>
  );
}
