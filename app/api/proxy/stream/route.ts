import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');
  if (!urlParam) {
    return new Response('Missing URL', { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      return new Response(`Error fetching stream: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get('content-type') || '';
    const isPlaylist =
      contentType.includes('mpegurl') ||
      contentType.includes('m3u8') ||
      targetUrl.pathname.endsWith('.m3u8') ||
      targetUrl.href.includes('.m3u8');

    // ── Rewrite M3U8 Playlists ──
    if (isPlaylist) {
      const text = await response.text();
      const lines = text.split('\n');
      
      // Determine base URL for relative paths
      const lastSlashIndex = targetUrl.href.lastIndexOf('/');
      const baseUrl = targetUrl.href.substring(0, lastSlashIndex + 1);

      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          return line;
        }

        // Resolve relative paths to absolute URLs
        let absoluteUrl = trimmed;
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          try {
            absoluteUrl = new URL(trimmed, baseUrl).toString();
          } catch {
            absoluteUrl = baseUrl + trimmed;
          }
        }

        // Wrap sub-playlist or chunk in this proxy
        return `${req.nextUrl.origin}/api/proxy/stream?url=${encodeURIComponent(absoluteUrl)}`;
      });

      return new Response(rewrittenLines.join('\n'), {
        headers: {
          'Content-Type': 'application/x-mpegURL',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store',
        },
      });
    }

    // ── Pipe Binary Chunks (.ts, fmp4, etc.) ──
    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err: any) {
    return new Response(`Proxy error: ${err.message}`, { status: 500 });
  }
}
