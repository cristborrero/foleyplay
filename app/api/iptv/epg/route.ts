import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface EPGEvent {
  hi: number; // Unix start time
  hf: number; // Unix end time
  t: string;  // Title
  d?: string; // Description
  g?: string; // Genre
  c?: string; // Cover
}

interface EPGChannel {
  name: string;
  events: EPGEvent[];
}

let cachedEPG: EPGChannel[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache

async function fetchEPGData(): Promise<EPGChannel[]> {
  const now = Date.now();
  if (cachedEPG && now - lastFetchTime < CACHE_DURATION) {
    return cachedEPG;
  }

  try {
    const res = await fetch('https://www.tdtchannels.com/epg/TV.json', {
      headers: { 'User-Agent': 'FoleyPlay/1.0' },
      next: { revalidate: 900 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data)) {
      cachedEPG = data;
      lastFetchTime = now;
      return data;
    }
    return [];
  } catch {
    return cachedEPG || [];
  }
}

export async function GET(req: NextRequest) {
  const epgId = req.nextUrl.searchParams.get('epgId');
  if (!epgId) {
    return NextResponse.json({ current: null, next: null });
  }

  const epgChannels = await fetchEPGData();
  const channelData = epgChannels.find(
    (ch) => ch.name.toLowerCase() === epgId.toLowerCase()
  );

  if (!channelData || !Array.isArray(channelData.events)) {
    return NextResponse.json({ current: null, next: null });
  }

  const nowSec = Math.floor(Date.now() / 1000);

  const currentEvent = channelData.events.find(
    (ev) => nowSec >= ev.hi && nowSec < ev.hf
  );

  const currentIndex = currentEvent ? channelData.events.indexOf(currentEvent) : -1;
  const nextEvent = currentIndex !== -1 && currentIndex + 1 < channelData.events.length
    ? channelData.events[currentIndex + 1]
    : null;

  return NextResponse.json({
    current: currentEvent
      ? {
          title: currentEvent.t,
          description: currentEvent.d || null,
          genre: currentEvent.g || null,
          startTime: currentEvent.hi,
          endTime: currentEvent.hf,
        }
      : null,
    next: nextEvent
      ? {
          title: nextEvent.t,
          startTime: nextEvent.hi,
          endTime: nextEvent.hf,
        }
      : null,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
