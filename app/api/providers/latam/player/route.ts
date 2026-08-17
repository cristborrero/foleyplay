import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tmdbId = searchParams.get('tmdbId');
  const title = searchParams.get('title') || '';
  const mediaType = searchParams.get('mediaType') || 'movie';

  // Construct internal fetch URL
  const origin = req.nextUrl.origin;
  const apiUrl = new URL(`${origin}/api/providers/latam`);
  if (tmdbId) apiUrl.searchParams.set('tmdbId', tmdbId);
  if (title) apiUrl.searchParams.set('title', title);
  apiUrl.searchParams.set('mediaType', mediaType);

  let streamUrl: string | null = null;
  let embedUrl: string | null = null;
  let resolvedTitle: string = title || 'Película';

  try {
    const res = await fetch(apiUrl.toString(), { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        streamUrl = data.streamUrl;
        embedUrl = data.embedUrl;
        resolvedTitle = data.title || resolvedTitle;
      }
    }
  } catch (err) {
    console.error('Error fetching stream in latam player route:', err);
  }

  if (streamUrl) {
    // Return custom HLS player HTML
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resolvedTitle} — FoleyPlay Latino</title>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; background: #080A09; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    #video-container { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000; }
    video { width: 100%; height: 100%; object-fit: contain; }
    .badge { position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); color: #CEFF00; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; pointer-events: none; z-index: 10; letter-spacing: 0.05em; text-transform: uppercase; }
  </style>
</head>
<body>
  <div id="video-container">
    <div class="badge">Audio Latino • 1080p HLS</div>
    <video id="video" controls autoplay playsinline></video>
  </div>
  <script>
    const video = document.getElementById('video');
    const streamUrl = "${streamUrl}";

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', function() {
        video.play().catch(() => {});
      });
    }
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }

  if (embedUrl) {
    return NextResponse.redirect(embedUrl);
  }

  // Fallback state when title is not in the Latin API catalog
  const fallbackHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>No disponible en este servidor</title>
  <style>
    body { background: #080A09; color: #F4F6F4; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
    h2 { font-size: 18px; margin-bottom: 8px; }
    p { font-size: 13px; color: #9CA39D; max-width: 400px; line-height: 1.5; margin-bottom: 20px; }
    .note { font-size: 11px; color: #636B64; }
  </style>
</head>
<body>
  <h2>Servidor Latino: Título no disponible</h2>
  <p>Este título aún no ha sido indexado en la fuente de audio latino. Por favor selecciona otro servidor (UnlimPlay o VidLink) en la barra superior.</p>
  <div class="note">FoleyPlay Multi-Server</div>
</body>
</html>`;

  return new NextResponse(fallbackHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
