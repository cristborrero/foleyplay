'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const TVContext = createContext(false);

export function TVProvider({ children }: { children: React.ReactNode }) {
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('fp-platform');
    if (stored === 'tv') { setIsTV(true); return; }

    const params = new URLSearchParams(window.location.search);
    if (params.get('platform') === 'tv') {
      sessionStorage.setItem('fp-platform', 'tv');
      setIsTV(true);
      return;
    }

    // Fallback: Capacitor native check on large screen
    if ((window as any)?.Capacitor?.isNativePlatform?.() && window.innerWidth >= 960) {
      sessionStorage.setItem('fp-platform', 'tv');
      setIsTV(true);
    }
  }, []);

  return <TVContext.Provider value={isTV}>{children}</TVContext.Provider>;
}

export function useIsTV() {
  return useContext(TVContext);
}
