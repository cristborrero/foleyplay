'use client';

import { createContext, useContext, useState } from 'react';

interface TVSidebarCtx {
  expanded: boolean;
  open: () => void;
  close: () => void;
}

const Ctx = createContext<TVSidebarCtx>({ expanded: false, open: () => {}, close: () => {} });

export function TVSidebarProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Ctx.Provider value={{ expanded, open: () => setExpanded(true), close: () => setExpanded(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTVSidebar() {
  return useContext(Ctx);
}
