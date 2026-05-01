'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import TVSidebar from './TVSidebar';
import TVFooter from './TVFooter';
import TVBackHandler from '@/components/layout/TVBackHandler';
import TVFocusManager from './TVFocusManager';
import { TVSidebarProvider, useTVSidebar } from './TVSidebarContext';

const HOME_PATHS = ['/tv/browse', '/tv/movies', '/tv/tv-shows'];

function TVContentHeader() {
  const pathname = usePathname();
  const router = useRouter();

  if (HOME_PATHS.includes(pathname)) return null;

  return (
    <div data-tv-row className="flex items-center px-4 py-2 shrink-0">
      <button
        data-tv-card
        tabIndex={0}
        onClick={() => router.back()}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); router.back(); } }}
        className="flex items-center gap-2 text-gray-400 hover:text-white focus:text-white outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Volver</span>
      </button>
    </div>
  );
}

function TVLayoutInner({ children }: { children: React.ReactNode }) {
  const { expanded, close } = useTVSidebar();

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      <TVBackHandler />
      <TVFocusManager />
      <div className="flex flex-1 min-h-0">
        <TVSidebar expanded={expanded} onClose={close} />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TVContentHeader />
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
