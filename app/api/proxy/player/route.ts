import { NextRequest } from 'next/server';


const ALLOWED_DOMAINS = [
  '2embed.cc',
  '2embed.online',
  'embed.su',
  'vidsrc.me',
  'vidsrc.to',
  'streamimdb.me',
];

// Known ad network domains — their <script> tags get removed from proxied HTML
const AD_SCRIPT_DOMAINS = [
  'juicyads.com',
  'exoclick.com',
  'popads.net',
  'popcash.net',
  'propellerads.com',
  'hilltopads.net',
  'trafficjunky.com',
  'clkmon.com',
  'adskeeper.com',
  'zoneplanner.com',
  'adsterra.com',
  'pubfuture.com',
  'moneygocash.com',
  'seedtag.com',
];

const AD_DOMAINS_PATTERN = AD_SCRIPT_DOMAINS.map((d) => d.replace('.', '\\.')).join('|');

// Injected before ANY script in the page — blocks all popup patterns
const POPUP_BLOCKER = `<script data-injected="1">
(function(){
  'use strict';

  var fakePop = function(){
    return { focus:function(){}, close:function(){}, closed:false, document:{write:function(){}} };
  };

  // Lock window.open as non-writable so ad scripts can't restore it
  try {
    Object.defineProperty(window,'open',{ value:fakePop, writable:false, configurable:false });
  } catch(e) { window.open = fakePop; }

  // Kill known ad globals
  ['_open','popunder','_pop','Popunder','pop','createPop','_popup'].forEach(function(k){
    try { window[k] = fakePop; } catch(e){}
  });

  // Block top/parent navigation (frame-breakout technique)
  try {
    Object.defineProperty(window,'top',{ get:function(){ return window; }, configurable:false });
    Object.defineProperty(window,'parent',{ get:function(){ return window; }, configurable:false });
  } catch(e){}

  // Block location-based redirects
  try { window.location.assign = function(){}; } catch(e){}
  try { window.location.replace = function(){}; } catch(e){}

  // Intercept _blank / _top clicks (catches both static and dynamic anchors)
  document.addEventListener('click', function(e){
    var el = e.target;
    while (el && el.tagName) {
      if (el.tagName === 'A') {
        var t = (el.getAttribute('target') || '').toLowerCase();
        if (t === '_blank' || t === '_top' || t === '_parent') {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
      }
      el = el.parentElement;
    }
  }, true);

  // MutationObserver — removes invisible full-coverage ad overlays injected after load
  if (typeof MutationObserver !== 'undefined') {
    var mo = new MutationObserver(function(muts){
      muts.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if (node.nodeType !== 1) return;
          var candidates = node.tagName === 'A' ? [node] : Array.from(node.querySelectorAll('a'));
          candidates.forEach(function(a){
            var t = (a.getAttribute('target') || '').toLowerCase();
            if (t === '_blank' || t === '_top') {
              var s = window.getComputedStyle(a);
              if (s.position === 'fixed' || s.position === 'absolute') {
                a.removeAttribute('href');
                a.removeAttribute('target');
                a.style.pointerEvents = 'none';
              }
            }
          });
        });
      });
    });
    var startObserver = function(){
      if (document.body) mo.observe(document.body,{ childList:true, subtree:true });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserver);
    } else {
      startObserver();
    }
  }
})();
</script>`;

function stripAds(html: string): string {
  // Remove external ad network <script> tags
  html = html.replace(
    new RegExp(`<script[^>]+src=["'][^"']*(?:${AD_DOMAINS_PATTERN})[^"']*["'][^>]*>.*?</script>`, 'gis'),
    ''
  );

  // Remove target="_blank" / "_top" / "_parent" from anchor tags
  html = html.replace(/(<a\b[^>]*)target\s*=\s*["'](?:_blank|_top|_parent)["']/gi, '$1');

  // Neutralize inline window.open() calls in raw HTML (catches non-dynamic scripts)
  html = html.replace(/\bwindow\.open\s*\(/g, '(function(){return null;})(');

  return html;
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get('url');

  if (!target) return new Response('Missing url', { status: 400 });

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  if (targetUrl.protocol !== 'https:') return new Response('HTTPS only', { status: 400 });

  const allowed = ALLOWED_DOMAINS.some(
    (d) => targetUrl.hostname === d || targetUrl.hostname.endsWith('.' + d)
  );
  if (!allowed) return new Response('Domain not allowed', { status: 403 });

  try {
    const upstream = await fetch(target, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: targetUrl.origin + '/',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
      },
    });

    if (!upstream.ok) return new Response(`Upstream error: ${upstream.status}`, { status: 502 });

    let html = await upstream.text();

    // 1. HTML-level ad stripping (before injection)
    html = stripAds(html);

    // 2. Inject blocker + base href at the very start of <head>
    const base = `<base href="${targetUrl.origin}/">`;
    if (/<head/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>${base}${POPUP_BLOCKER}`);
    } else {
      html = POPUP_BLOCKER + html;
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Failed to fetch provider', { status: 502 });
  }
}
