#!/usr/bin/env node
/**
 * scripts/update-iptv.js
 *
 * Downloads and filters the iptv-org database to keep only Spanish-language channels
 * from Latin America and Spain with at least one active stream.
 *
 * Run: node scripts/update-iptv.js
 * Output: public/data/iptv.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const IPTV_API_BASE = 'https://iptv-org.github.io/api';

const TARGET_COUNTRIES = [
  'MX', // Mexico
  'AR', // Argentina
  'CO', // Colombia
  'CL', // Chile
  'PE', // Peru
  'VE', // Venezuela
  'UY', // Uruguay
  'EC', // Ecuador
  'BO', // Bolivia
  'PY', // Paraguay
  'CR', // Costa Rica
  'PA', // Panama
  'DO', // Dominican Republic
  'SV', // El Salvador
  'GT', // Guatemala
  'HN', // Honduras
  'NI', // Nicaragua
  'CU', // Cuba
  'PR', // Puerto Rico (territory)
  'ES', // Spain
];

const COUNTRY_NAMES = {
  MX: 'México',
  AR: 'Argentina',
  CO: 'Colombia',
  CL: 'Chile',
  PE: 'Perú',
  VE: 'Venezuela',
  UY: 'Uruguay',
  EC: 'Ecuador',
  BO: 'Bolivia',
  PY: 'Paraguay',
  CR: 'Costa Rica',
  PA: 'Panamá',
  DO: 'República Dominicana',
  SV: 'El Salvador',
  GT: 'Guatemala',
  HN: 'Honduras',
  NI: 'Nicaragua',
  CU: 'Cuba',
  PR: 'Puerto Rico',
  ES: 'España',
};

const COUNTRY_FLAGS = {
  MX: '🇲🇽',
  AR: '🇦🇷',
  CO: '🇨🇴',
  CL: '🇨🇱',
  PE: '🇵🇪',
  VE: '🇻🇪',
  UY: '🇺🇾',
  EC: '🇪🇨',
  BO: '🇧🇴',
  PY: '🇵🇾',
  CR: '🇨🇷',
  PA: '🇵🇦',
  DO: '🇩🇴',
  SV: '🇸🇻',
  GT: '🇬🇹',
  HN: '🇭🇳',
  NI: '🇳🇮',
  CU: '🇨🇺',
  PR: '🇵🇷',
  ES: '🇪🇸',
};

// Country sort order: LatAm first (by size/population), Spain last
const SORT_ORDER = [
  'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'UY', 'BO', 'PY',
  'CR', 'GT', 'DO', 'PA', 'HN', 'SV', 'NI', 'CU', 'PR', 'ES',
];

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    console.log(`  Fetching: ${url}`);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔄  Updating IPTV channel database...\n');

  // --- 1. Fetch source data ---
  const [channels, streams, logos, tdtData] = await Promise.all([
    fetchJSON(`${IPTV_API_BASE}/channels.json`),
    fetchJSON(`${IPTV_API_BASE}/streams.json`),
    fetchJSON(`${IPTV_API_BASE}/logos.json`),
    fetchJSON('https://www.tdtchannels.com/lists/tv.json').catch((err) => {
      console.warn(`  ⚠️ Could not fetch TDTChannels: ${err.message}`);
      return null;
    }),
  ]);

  console.log(`\n  Channels total: ${channels.length}`);
  console.log(`  Streams total:  ${streams.length}`);
  console.log(`  Logos total:    ${logos.length}`);
  if (tdtData) console.log(`  TDTChannels fetched successfully.`);

  // --- 2. Build TDTChannels lookup map by normalized name ---
  /** @type {Map<string, { logo: string, streams: string[], epgId: string }>} */
  const tdtByName = new Map();
  if (tdtData && Array.isArray(tdtData.countries)) {
    tdtData.countries.forEach((c) => {
      if (Array.isArray(c.ambits)) {
        c.ambits.forEach((amb) => {
          if (Array.isArray(amb.channels)) {
            amb.channels.forEach((ch) => {
              if (!ch.name) return;
              const normKey = ch.name.toLowerCase().replace(/[^a-z0-9]/g, '');
              const chStreams = (ch.options || [])
                .filter((o) => o.url && (o.format === 'm3u8' || !o.format))
                .map((o) => o.url);

              if (chStreams.length > 0 || ch.logo) {
                tdtByName.set(normKey, {
                  name: ch.name,
                  logo: ch.logo || null,
                  streams: chStreams,
                  epgId: ch.epg_id || null,
                });
              }
            });
          }
        });
      }
    });
  }

  // --- 3. Build logos lookup: channelId -> logoUrl ---
  /** @type {Map<string, string>} */
  const logoByChannel = new Map();
  for (const logo of logos) {
    if (logo.channel && logo.url) {
      logoByChannel.set(logo.channel, logo.url);
    }
  }

  // --- 4. Build streams lookup: channelId -> [stream urls] ---
  /** @type {Map<string, string[]>} */
  const streamsByChannel = new Map();
  for (const stream of streams) {
    if (!stream.channel || !stream.url) continue;
    if (!streamsByChannel.has(stream.channel)) {
      streamsByChannel.set(stream.channel, []);
    }
    streamsByChannel.get(stream.channel).push(stream.url);
  }

  // --- 5. Filter channels ---
  const filtered = channels.filter((ch) => {
    // Must be in target countries
    if (!TARGET_COUNTRIES.includes(ch.country)) return false;

    // Skip adult content
    if (ch.is_nsfw) return false;

    // Skip closed channels
    if (ch.closed) return false;

    // Must have at least one stream (either from iptv-org or TDTChannels)
    const normKey = ch.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const tdt = tdtByName.get(normKey);
    const urls = streamsByChannel.get(ch.id) || [];

    if (urls.length === 0 && (!tdt || tdt.streams.length === 0)) return false;

    return true;
  });

  console.log(`\n  Channels after filter: ${filtered.length}`);

  // --- 6. Build structured output grouped by country ---
  /** @type {Map<string, { channels: Array }>} */
  const byCountry = new Map();

  for (const ch of filtered) {
    const code = ch.country;
    if (!byCountry.has(code)) {
      byCountry.set(code, []);
    }

    const normKey = ch.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const tdt = tdtByName.get(normKey);

    // Merge streams: TDTChannels streams prioritized (higher uptime/quality)
    const rawStreams = streamsByChannel.get(ch.id) || [];
    const tdtStreams = tdt ? tdt.streams : [];
    const combinedStreams = Array.from(new Set([...tdtStreams, ...rawStreams]));

    byCountry.get(code).push({
      id: ch.id,
      name: ch.name,
      logo: (tdt && tdt.logo) || ch.logo || logoByChannel.get(ch.id) || null,
      epgId: tdt ? tdt.epgId : null,
      categories: ch.categories || [],
      website: ch.website || null,
      streams: combinedStreams,
    });
  }

  // --- 5. Sort countries and build final output array ---
  const output = SORT_ORDER
    .filter((code) => byCountry.has(code))
    .map((code) => ({
      code,
      name: COUNTRY_NAMES[code],
      flag: COUNTRY_FLAGS[code],
      channels: byCountry.get(code).sort((a, b) => a.name.localeCompare(b.name)),
    }));

  // --- 6. Write output ---
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'iptv.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

  const stats = fs.statSync(outputPath);
  console.log(`\n✅  Written to: public/data/iptv.json`);
  console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`   Countries: ${output.length}`);
  console.log(`   Total channels: ${filtered.length}`);
  output.forEach((c) =>
    console.log(`     ${c.flag} ${c.name}: ${c.channels.length} channels`)
  );
}

main().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
