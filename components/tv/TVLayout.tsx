'use client';

import TVSidebar from './TVSidebar';
import TVFooter from './TVFooter';
import TVBackHandler from '@/components/layout/TVBackHandler';
import { TVSidebarProvider, useTVSidebar } from './TVSidebarContext';

function TVLayoutInner({ children }: { children: React.ReactNode }) {
  const { expanded, close } = useTVSidebar();

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      <TVBackHandler />
      <div className="flex flex-1 min-h-0">
        <TVSidebar expanded={expanded} onClose={close} />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
          <TVFooter />
        </main>
      </div>
    </div>
  );
}

export default function TVLayout({ children }: { children: React.ReactNode }) {
  return (
    <TVSidebarProvider>
      <TVLayoutInner>{children}</TVLayoutInner>
    </TVSidebarProvider>
  );
}
