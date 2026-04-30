'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Tv2 } from 'lucide-react';

interface TVPlayerControlsProps {
  title: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export default function TVPlayerControls({ title, iframeRef }: TVPlayerControlsProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerFocused, setPlayerFocused] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 4000);
  }, []);

  useEffect(() => {
    show();
    const onKey = (e: KeyboardEvent) => {
      if (playerFocused) {
        // When player has focus, only Back exits it
        if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'GoBack') {
          e.preventDefault();
          setPlayerFocused(false);
          backBtnRef.current?.focus();
          show();
        }
        return; // All other keys go to iframe
      }
      show();
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [show, playerFocused]);

  // Sync fullscreen state
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const enterPlayer = () => {
    setPlayerFocused(true);
    setVisible(false);
    iframeRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {visible && !playerFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none"
        >
          {/* Top bar */}
          <div className="flex items-center gap-4 p-4 bg-linear-to-b from-black/80 to-transparent pointer-events-auto">
            <button
              ref={backBtnRef}
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white bg-black/50 hover:bg-black/70 focus:bg-black/70 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Volver</span>
            </button>
            <h1 className="text-white font-semibold text-base truncate flex-1">{title}</h1>
          </div>

          {/* Bottom controls */}
          <div className="flex items-center justify-between p-4 bg-linear-to-t from-black/80 to-transparent pointer-events-auto">
            {/* Enter player mode */}
            <button
              onClick={enterPlayer}
              className="flex items-center gap-2 text-white bg-black/50 hover:bg-black/70 focus:bg-black/70 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              <Tv2 size={16} />
              <span className="text-sm">Controles del reproductor</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 text-white bg-black/50 hover:bg-black/70 focus:bg-black/70 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              <span className="text-sm">{isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
