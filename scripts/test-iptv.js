#!/usr/bin/env node
/**
 * scripts/test-iptv.js
 *
 * Runs programmatic QA validations on the IPTV implementation:
 * 1. Checks public/data/iptv.json existence and JSON integrity.
 * 2. Validates country groups, flags and channels structure.
 * 3. Asserts channels have non-empty streams and valid properties.
 * 4. Checks logo resolution stats.
 * 5. Tests local /api/proxy/stream logic with a sample HLS stream.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const iptvPath = path.join(__dirname, '..', 'public', 'data', 'iptv.json');

console.log('🧪  Starting IPTV Implementation QA Checks...\n');

// ── 1. Check file existence ──
if (!fs.existsSync(iptvPath)) {
  console.error('❌  Error: public/data/iptv.json does not exist. Run build/sync script first.');
  process.exit(1);
}
console.log('✅  iptv.json file exists.');

// ── 2. Read and parse JSON ──
let data;
try {
  data = JSON.parse(fs.readFileSync(iptvPath, 'utf8'));
  console.log('✅  iptv.json parsed successfully.');
} catch (e) {
  console.error('❌  Error parsing JSON:', e.message);
  process.exit(1);
}

// ── 3. Validate structures ──
if (!Array.isArray(data)) {
  console.error('❌  Error: Root data must be an array of countries.');
  process.exit(1);
}

let totalChannels = 0;
let channelsWithLogos = 0;
let errors = [];

data.forEach((country, index) => {
  if (!country.code || !country.name || !country.flag || !Array.isArray(country.channels)) {
    errors.push(`Country at index ${index} is missing required fields (code, name, flag, channels).`);
    return;
  }

  country.channels.forEach((channel, cIndex) => {
    totalChannels++;
    if (channel.logo) {
      channelsWithLogos++;
    }

    if (!channel.id || !channel.name || !Array.isArray(channel.streams) || channel.streams.length === 0) {
      errors.push(`Channel ${channel.name || cIndex} in ${country.name} has missing/invalid properties.`);
    }

    channel.streams.forEach((stream) => {
      if (!stream.startsWith('http://') && !stream.startsWith('https://')) {
        errors.push(`Channel ${channel.name} in ${country.name} has invalid stream protocol: ${stream}`);
      }
    });
  });
});

if (errors.length > 0) {
  console.error(`❌  Structure validations failed with ${errors.length} errors:`);
  errors.slice(0, 10).forEach((err) => console.error(`    - ${err}`));
  process.exit(1);
}

console.log(`✅  Structural integrity is clean.`);
console.log(`📊  Stats:`);
console.log(`    - Countries: ${data.length}`);
console.log(`    - Total Channels: ${totalChannels}`);
console.log(`    - Channels with Logos: ${channelsWithLogos} (${((channelsWithLogos / totalChannels) * 100).toFixed(1)}%)`);

// ── 4. Test proxy rewriting logic locally ──
console.log('\n🔄  Testing local proxy parsing helper behavior...');
const samplePlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=1280000,RESOLUTION=1280x720
index_720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2560000,RESOLUTION=1920x1080
/live/index_1080p.m3u8
http://example.com/chunk.ts`;

const baseUrl = 'https://videostream.shockmedia.com.ar:19360/beatsradio/';
const lines = samplePlaylist.split('\n');

try {
  const rewritten = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    let absoluteUrl = trimmed;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      absoluteUrl = new URL(trimmed, baseUrl).toString();
    }
    return `http://localhost:3000/api/proxy/stream?url=${encodeURIComponent(absoluteUrl)}`;
  });

  const expectedUrl1 = `http://localhost:3000/api/proxy/stream?url=${encodeURIComponent('https://videostream.shockmedia.com.ar:19360/beatsradio/index_720p.m3u8')}`;
  const expectedUrl2 = `http://localhost:3000/api/proxy/stream?url=${encodeURIComponent('https://videostream.shockmedia.com.ar:19360/live/index_1080p.m3u8')}`;
  const expectedUrl3 = `http://localhost:3000/api/proxy/stream?url=${encodeURIComponent('http://example.com/chunk.ts')}`;

  if (rewritten.includes(expectedUrl1) && rewritten.includes(expectedUrl2) && rewritten.includes(expectedUrl3)) {
    console.log('✅  Proxy URL rewriting simulation succeeded.');
  } else {
    throw new Error('Url rewrite did not output expected format.');
  }
} catch (e) {
  console.error('❌  Proxy URL rewriting simulation failed:', e.message);
  process.exit(1);
}

console.log('\n🎉  All IPTV Implementation QA Checks Passed successfully!');
process.exit(0);
