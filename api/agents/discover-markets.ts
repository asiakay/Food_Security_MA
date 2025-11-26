import fs from 'fs/promises';
import path from 'path';
import { discoverNewMarkets } from '../services/claude-ai.js';
import type { NewMarketDiscovery } from '../types.js';

const DISCOVERIES_PATH = path.join(process.cwd(), 'api/data/new-market-discoveries.json');

const SEARCH_AREAS = [
  'Boston, MA',
  'Cambridge, MA',
  'Somerville, MA',
  'Worcester, MA',
  'Springfield, MA',
  'Dorchester, MA',
  'Roxbury, MA',
  'Mattapan, MA',
  'Providence, RI',
  'Pawtucket, RI',
];

async function saveDiscoveries(discoveries: NewMarketDiscovery[]): Promise<void> {
  await fs.mkdir(path.dirname(DISCOVERIES_PATH), { recursive: true });
  await fs.writeFile(DISCOVERIES_PATH, JSON.stringify(discoveries, null, 2));
}

async function discoverInArea(area: string): Promise<NewMarketDiscovery[]> {
  const discoveries: NewMarketDiscovery[] = [];

  console.log(`\n🔍 Searching for new markets in: ${area}`);

  try {
    const discoveryData = await discoverNewMarkets(area);

    for (const discovery of discoveryData.discoveries || []) {
      discoveries.push({
        business_name: discovery.business_name,
        location: discovery.location,
        activity: discovery.activity,
        website: discovery.website || '',
        phone: discovery.phone || '',
        email: discovery.email || '',
        confidence: discovery.confidence,
        source: discovery.source,
        discoveredAt: new Date().toISOString(),
      });
    }

    console.log(`  ✅ Discovered ${discoveries.length} potential new markets`);
  } catch (error) {
    console.error(`  ❌ Discovery failed: ${error}`);
  }

  return discoveries;
}

async function main() {
  console.log('🌟 Starting new market discovery agent...\n');

  const allDiscoveries: NewMarketDiscovery[] = [];

  for (const area of SEARCH_AREAS.slice(0, 3)) {
    // Limit to 3 areas for testing
    const discoveries = await discoverInArea(area);
    allDiscoveries.push(...discoveries);

    // Rate limiting - longer delay for research tasks
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  await saveDiscoveries(allDiscoveries);

  console.log(`\n✨ Complete! Discovered ${allDiscoveries.length} potential new markets`);
  console.log(`📄 Discoveries saved to: ${DISCOVERIES_PATH}`);
  console.log('\n💡 Review these suggestions in the admin dashboard');
}

main().catch(console.error);
