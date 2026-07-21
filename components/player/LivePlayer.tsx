'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  X, Radio, AlertCircle, RefreshCw, Play, Pause,
  Volume2, VolumeX, Maximize, Minimize, Signal,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { IPTVChannel } from '@/types/app';

interface LivePlayerProps {
  channel: IPTVChannel;
  onClose: () => void;
}

// ── Custom controls hook ──────────────────────────────────────────────────────

function useVideoControls(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, [videoRef]);

  const changeVolume = useCallback((val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  }, [videoRef]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  }, []);

  const stop = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  }, [videoRef]);

  // Sync state when video events fire externally
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [videoRef]);

  return { playing, muted, volume, fullscreen, containerRef, toggle, toggleMute, changeVolume, toggleFullscreen, stop };
}

// ── Controls bar ─────────────────────────────────────────────────────────────

function ControlsBar({
  playing, muted, volume, fullscreen,
  onToggle, onMute, onVolume, onFullscreen, onStop,
}: {
  playing: boolean; muted: boolean; volume: number; fullscreen: boolean;
  onToggle: () => void; onMute: () => void; onVolume: (v: number) => void;
  onFullscreen: () => void; onStop: () => void;
}) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent px-4 py-4 flex items-center gap-3">
      {/* Play/Pause */}
      <button onClick={onToggle} className="text-white hover:text-fp-lime transition-colors" aria-label={playing ? 'Pausar' : 'Reproducir'}>
        {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
      </button>

      {/* Stop */}
      <button onClick={onStop} className="text-white/70 hover:text-white transition-colors" aria-label="Detener">
        <span className="w-4 h-4 bg-current rounded-sm block" />
      </button>

      {/* Live badge */}
      <div className="flex items-center gap-1.5 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">En vivo</span>
      </div>

      <div className="flex-1" />

      {/* Volume */}
      <div className="flex items-center gap-2">
        <button onClick={onMute} className="text-white/70 hover:text-white transition-colors" aria-label={muted ? 'Activar audio' : 'Silenciar'}>
          {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          className="w-20 accent-fp-lime cursor-pointer h-1"
          aria-label="Volumen"
        />
      </div>

      {/* Fullscreen */}
      <button onClick={onFullscreen} className="text-white/70 hover:text-white transition-colors" aria-label="Pantalla completa">
        {fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LivePlayer({ channel, onClose }: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamIndex, setStreamIndex] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const controls = useVideoControls(videoRef);

  const streamUrl = channel.streams[streamIndex];
  const proxiedStreamUrl = useMemo(() => {
    if (!streamUrl) return '';
    // Proxy only unencrypted http:// streams to bypass Mixed Content.
    // Secure https:// streams load directly (avoiding Cloudflare port limits).
    if (streamUrl.startsWith('http://')) {
      return `/api/proxy/stream?url=${encodeURIComponent(streamUrl)}`;
    }
    return streamUrl;
  }, [streamUrl]);

  // Auto-hide controls after 3s of inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => { if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current); };
  }, [resetControlsTimer]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') { e.preventDefault(); controls.toggle(); }
      if (e.key === 'm') controls.toggleMute();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, controls]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Load HLS stream
  useEffect(() => {
    if (!videoRef.current || !proxiedStreamUrl) return;
    setError(false);
    setLoading(true);

    const video = videoRef.current;
    let hlsInstance: import('hls.js').default | null = null;

    // Detect if original URL is HLS format
    const isHLS = /\.m3u8/i.test(streamUrl) || streamUrl.includes('m3u8');

    if (isHLS) {
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: false, lowLatencyMode: true, backBufferLength: 0 });
          hlsInstance.loadSource(proxiedStreamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            video.play().catch(() => {});
          });
          hlsInstance.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) { setLoading(false); setError(true); hlsInstance?.destroy(); }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = proxiedStreamUrl;
          video.onloadedmetadata = () => setLoading(false);
          video.play().catch(() => setError(true));
        } else {
          setLoading(false);
          setError(true);
        }
      });
    } else {
      video.src = proxiedStreamUrl;
      video.oncanplay = () => setLoading(false);
      video.play().catch(() => setError(true));
    }

    return () => { hlsInstance?.destroy(); };
  }, [proxiedStreamUrl, streamUrl]);

  return (
    // Backdrop
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal shell */}
      <motion.div
        ref={controls.containerRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onMouseMove={resetControlsTimer}
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.9)] flex flex-col"
        style={{ aspectRatio: '16/9' }}
      >
        {/* ── Top bar (channel info + close) ── */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {channel.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="h-7 w-auto max-w-[72px] object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <Radio size={16} className="text-fp-lime" />
                )}
                <span className="text-white font-semibold text-sm">{channel.name}</span>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Video area ── */}
        <div className="flex-1 relative bg-black cursor-pointer" onClick={controls.toggle}>
          {/* Loading state */}
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              {channel.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="h-16 w-auto max-w-[140px] object-contain opacity-40 mb-2"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="w-8 h-8 border-2 border-fp-lime border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-xs">Conectando señal...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 px-6 text-center">
              {channel.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="h-12 w-auto max-w-[120px] object-contain opacity-30 mb-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <AlertCircle size={28} className="text-red-400" />
              <div>
                <p className="text-white font-semibold text-sm">Señal no disponible</p>
                <p className="text-gray-500 text-xs mt-1">El stream no responde en este momento.</p>
              </div>
              {channel.streams.length > 1 && streamIndex < channel.streams.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setStreamIndex((i) => i + 1); setError(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-fp-lime text-black font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity"
                >
                  <RefreshCw size={14} />
                  Señal {streamIndex + 2} / {channel.streams.length}
                </button>
              )}
            </div>
          )}

          {/* Video element — hidden controls, we have our own */}
          <video
            ref={videoRef}
            className={`w-full h-full object-contain transition-opacity duration-300 ${loading || error ? 'opacity-0' : 'opacity-100'}`}
            playsInline
            autoPlay
          />
        </div>

        {/* ── Custom controls bar ── */}
        <AnimatePresence>
          {showControls && !error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
            >
              <ControlsBar
                playing={controls.playing}
                muted={controls.muted}
                volume={controls.volume}
                fullscreen={controls.fullscreen}
                onToggle={controls.toggle}
                onMute={controls.toggleMute}
                onVolume={controls.changeVolume}
                onFullscreen={controls.toggleFullscreen}
                onStop={controls.stop}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Stream selector (below the modal) ── */}
      {channel.streams.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
          <Signal size={12} className="text-gray-400" />
          <span className="text-gray-400 text-xs mr-1">Señal:</span>
          {channel.streams.map((_, i) => (
            <button
              key={i}
              onClick={() => { setStreamIndex(i); setError(false); }}
              className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                i === streamIndex
                  ? 'bg-fp-lime text-black scale-110'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
