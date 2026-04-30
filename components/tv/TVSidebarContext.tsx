'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface TVSidebarCtx {
  expanded: boolean;
  open: () => void;
  close: () => void;
}

const Ctx = createContext<TVSidebarCtx>({ expanded: false, open: () => {}, close: () => {} });

export function TVSidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const open  = useCallback(() => setExpanded(true),  []);
  const close = useCallback(() => setExpanded(false), []);
  return <Ctx.Provider value={{ expanded, open, close }}>{children}</Ctx.Provider>;
}

export function useTVSidebar() {
  return useContext(Ctx);
}
