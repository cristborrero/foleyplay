'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Signal, ChevronDown, ChevronUp, Tv, Play } from 'lucide-react';
import LivePlayer from '@/components/player/LivePlayer';
import type { IPTVChannel, IPTVCountry } from '@/types/app';

const GRADIENTS = [
  'from-red-900/80 to-rose-950 border-red-500/20 text-red-200',
  'from-purple-900/80 to-indigo-950 border-purple-500/20 text-purple-200',
  'from-blue-900/80 to-slate-950 border-blue-500/20 text-blue-200',
  'from-emerald-900/80 to-teal-950 border-emerald-500/20 text-emerald-200',
  'from-amber-900/80 to-orange-950 border-amber-500/20 text-amber-200',
  'from-pink-900/80 to-fuchsia-950 border-pink-500/20 text-pink-200',
  'from-cyan-900/80 to-sky-950 border-cyan-500/20 text-cyan-200',
];

function getChannelGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
}

// ── Channel card ─────────────────────────────────────────────────────────────

function ChannelCard({
  channel,
  onClick,
}: {
  channel: IPTVChannel;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const category = channel.categories[0] ?? null;

  // Clean logo URL: upgrade http to https
  const logoUrl = useMemo(() => {
    if (!channel.logo) return null;
    if (channel.logo.startsWith('http://')) {
      return channel.logo.replace('http://', 'https://');
    }
    return channel.logo;
  }, [channel.logo]);

  const gradientClass = useMemo(() => getChannelGradient(channel.name), [channel.name]);

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative flex flex-col rounded-xl bg-[#181818] hover:bg-[#222] border border-white/5 hover:border-white/15 overflow-hidden transition-all cursor-pointer text-left shadow-lg hover:shadow-2xl"
    >
      {/* Thumbnail area 16:9 */}
      <div className="relative w-full aspect-video bg-[#111] flex items-center justify-center p-3">
        {logoUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={channel.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain max-h-[52px] filter drop-shadow-md"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Stylish Brand Tile Fallback */
          <div className={`w-full h-full rounded-lg bg-gradient-to-br ${gradientClass} border flex flex-col items-center justify-center p-2 text-center shadow-inner select-none`}>
            <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase leading-tight line-clamp-2 drop-shadow-sm">
              {channel.name}
            </span>
          </div>
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-fp-lime text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play size={20} className="fill-black ml-0.5" />
          </div>
        </div>

        {/* Always-visible live dot */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-[8px] font-bold uppercase tracking-widest">Live</span>
        </div>

        {/* Stream count badge */}
        {channel.streams.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs rounded px-1.5 py-0.5">
            <span className="text-gray-300 text-[9px] font-medium">{channel.streams.length} señales</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-white text-xs font-semibold leading-snug line-clamp-1">
          {channel.name}
        </p>
        {category && (
          <p className="text-gray-500 text-[10px] mt-0.5 capitalize">{category}</p>
        )}
      </div>
    </motion.button>
  );
}

// ── Country section ───────────────────────────────────────────────────────────

function CountrySection({
  country,
  onPlay,
  searchQuery,
}: {
  country: IPTVCountry;
  onPlay: (channel: IPTVChannel) => void;
  searchQuery: string;
}) {
  const [expanded, setExpanded] = useState(true);

  // Alphabetical sorting of channels
  const filteredChannels = useMemo(() => {
    let list = country.channels;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((ch) => ch.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
  }, [country.channels, searchQuery]);

  if (filteredChannels.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Country header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-3 w-full text-left mb-4 group"
      >
        <span className="text-2xl">{country.flag}</span>
        <span className="text-white font-bold text-lg">{country.name}</span>
        <span className="text-gray-500 text-sm">({filteredChannels.length})</span>
        <span className="ml-auto text-gray-500 group-hover:text-white transition-colors">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Channel grid */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onClick={() => onPlay(channel)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TVEnVivoPage() {
  const [allCountries, setAllCountries] = useState<IPTVCountry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeChannel, setActiveChannel] = useState<IPTVChannel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState<string>('all');

  // Load the IPTV data client-side to avoid bundling 728KB into the JS chunk
  useEffect(() => {
    fetch('/data/iptv.json')
      .then((r) => r.json())
      .then((data: IPTVCountry[]) => {
        setAllCountries(data);
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, []);

  const totalChannels = allCountries.reduce((sum, c) => sum + c.channels.length, 0);

  const displayedCountries = useMemo(() => {
    if (activeCountry === 'all') return allCountries;
    return allCountries.filter((c) => c.code === activeCountry);
  }, [activeCountry, allCountries]);

  if (loadingData) {
    return (
      <div className="min-h-screen bg-fp-black pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-fp-lime border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Cargando canales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fp-black pt-14 flex flex-col md:flex-row">
      
      {/* ── Left Sidebar (Countries selector & Search) ── */}
      <aside className="w-full md:w-72 bg-[#0c0c0c] border-b md:border-b-0 md:border-r border-white/5 flex flex-col shrink-0 md:h-[calc(100vh-56px)] md:sticky md:top-14">
        
        {/* Search bar & header */}
        <div className="p-4 md:p-6 border-b border-white/5 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Signal size={20} className="text-fp-lime" />
              <h1 className="text-lg font-bold text-white tracking-wide">TV en Vivo</h1>
            </div>
            <p className="text-xs text-gray-500">
              {totalChannels.toLocaleString()} señales disponibles
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar canal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-white/8 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-fp-lime/50 transition-colors"
            />
          </div>
        </div>

        {/* Countries Scroll Area */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-2 md:p-4 gap-1 no-scrollbar max-h-48 md:max-h-full">
          {/* Option: Todos */}
          <button
            onClick={() => setActiveCountry('all')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 md:shrink ${
              activeCountry === 'all'
                ? 'bg-fp-lime text-black shadow-md'
                : 'bg-transparent text-gray-300 hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>🌎</span>
              <span>Todos los países</span>
            </span>
            <span className={`text-xs ml-2 md:ml-0 ${activeCountry === 'all' ? 'text-black/60 font-bold' : 'text-gray-500'}`}>
              {totalChannels}
            </span>
          </button>

          {/* List of countries */}
          {allCountries.map((country) => {
            const count = country.channels.length;
            return (
              <button
                key={country.code}
                onClick={() => setActiveCountry(country.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 md:shrink ${
                  activeCountry === country.code
                    ? 'bg-fp-lime text-black shadow-md'
                    : 'bg-transparent text-gray-300 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{country.flag}</span>
                  <span>{country.name}</span>
                </span>
                <span className={`text-xs ml-2 md:ml-0 ${activeCountry === country.code ? 'text-black/60 font-bold' : 'text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Right Content Area (Channel Grid) ── */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto md:h-[calc(100vh-56px)]">
        {displayedCountries.map((country) => (
          <CountrySection
            key={country.code}
            country={country}
            onPlay={setActiveChannel}
            searchQuery={searchQuery}
          />
        ))}

        {displayedCountries.every(
          (c) =>
            !c.channels.some((ch) =>
              ch.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ) && searchQuery && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Tv size={40} className="text-gray-700 animate-pulse" />
            <p className="text-gray-400 text-sm">No se encontraron canales para &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </main>

      {/* ── Live player modal ── */}
      <AnimatePresence>
        {activeChannel && (
          <LivePlayer
            key={activeChannel.id}
            channel={activeChannel}
            onClose={() => setActiveChannel(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
