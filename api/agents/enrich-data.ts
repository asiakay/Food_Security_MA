import fs from 'fs/promises';
import path from 'path';
import { enrichBusinessData } from '../services/claude-ai.js';
import { scrapeWebsite, geocodeAddress } from '../services/web-scraper.js';
import type { Business, EnrichmentSuggestion } from '../types.js';

const DATA_PATH = path.join(process.cwd(), 'src/data/businesses.json');
const SUGGESTIONS_PATH = path.join(process.cwd(), 'api/data/enrichment-suggestions.json');

async function loadBusinesses(): Promise<Business[]> {
  const data = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

async function saveSuggestions(suggestions: EnrichmentSuggestion[]): Promise<void> {
  await fs.mkdir(path.dirname(SUGGESTIONS_PATH), { recursive: true });
  await fs.writeFile(SUGGESTIONS_PATH, JSON.stringify(suggestions, null, 2));
}

async function enrichBusiness(business: Business): Promise<EnrichmentSuggestion[]> {
  const suggestions: EnrichmentSuggestion[] = [];

  console.log(`\n🔍 Enriching data for: ${business.business_name}`);

  // Step 1: Use AI to suggest missing data
  try {
    const aiSuggestions = await enrichBusinessData(
      business.business_name,
      business.location,
      business
    );

    for (const suggestion of aiSuggestions.suggestions || []) {
      suggestions.push({
        businessId: business.id,
        field: suggestion.field,
        currentValue: business[suggestion.field as keyof Business] as string | number | null,
        suggestedValue: suggestion.value,
        confidence: suggestion.confidence,
        source: `AI: ${suggestion.source}`,
        reasoning: suggestion.reasoning,
      });
    }
  } catch (error) {
    console.error(`  ❌ AI enrichment failed: ${error}`);
  }

  // Step 2: If website exists, scrape for additional info
  if (business.website && business.website.startsWith('http')) {
    try {
      console.log(`  🌐 Scraping website: ${business.website}`);
      const scrapedInfo = await scrapeWebsite(business.website);

      if (scrapedInfo.phone && !business.phone) {
        suggestions.push({
          businessId: business.id,
          field: 'phone',
          currentValue: business.phone,
          suggestedValue: scrapedInfo.phone,
          confidence: 'high',
          source: 'Web Scraper',
          reasoning: `Found phone number on business website`,
        });
      }

      if (scrapedInfo.email && !business.email) {
        suggestions.push({
          businessId: business.id,
          field: 'email',
          currentValue: business.email,
          suggestedValue: scrapedInfo.email,
          confidence: 'high',
          source: 'Web Scraper',
          reasoning: `Found email address on business website`,
        });
      }

      if (scrapedInfo.socialMedia?.instagram && !business.instagram) {
        suggestions.push({
          businessId: business.id,
          field: 'instagram',
          currentValue: business.instagram,
          suggestedValue: scrapedInfo.socialMedia.instagram,
          confidence: 'high',
          source: 'Web Scraper',
          reasoning: `Found Instagram link on business website`,
        });
      }
    } catch (error) {
      console.error(`  ❌ Web scraping failed: ${error}`);
    }
  }

  // Step 3: If missing coordinates, try to geocode
  if (!business.latitude || !business.longitude) {
    try {
      console.log(`  📍 Geocoding address...`);
      const coords = await geocodeAddress(business.location);
      if (coords) {
        suggestions.push({
          businessId: business.id,
          field: 'latitude',
          currentValue: business.latitude,
          suggestedValue: coords.latitude,
          confidence: 'high',
          source: 'Geocoding Service',
          reasoning: `Geocoded from address: ${business.location}`,
        });
        suggestions.push({
          businessId: business.id,
          field: 'longitude',
          currentValue: business.longitude,
          suggestedValue: coords.longitude,
          confidence: 'high',
          source: 'Geocoding Service',
          reasoning: `Geocoded from address: ${business.location}`,
        });
      }
    } catch (error) {
      console.error(`  ❌ Geocoding failed: ${error}`);
    }
  }

  console.log(`  ✅ Found ${suggestions.length} suggestions`);
  return suggestions;
}

async function main() {
  console.log('🚀 Starting data enrichment agent...\n');

  const businesses = await loadBusinesses();
  const allSuggestions: EnrichmentSuggestion[] = [];

  // Process businesses with missing data
  const businessesToEnrich = businesses.filter(
    (b) =>
      !b.phone ||
      !b.email ||
      !b.website ||
      !b.latitude ||
      !b.longitude ||
      !b.hours ||
      !b.snap_hip
  );

  console.log(`Found ${businessesToEnrich.length} businesses with missing data\n`);

  for (const business of businessesToEnrich.slice(0, 5)) {
    // Limit to 5 for testing
    const suggestions = await enrichBusiness(business);
    allSuggestions.push(...suggestions);

    // Rate limiting - wait 2 seconds between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  await saveSuggestions(allSuggestions);

  console.log(`\n✨ Complete! Generated ${allSuggestions.length} total suggestions`);
  console.log(`📄 Suggestions saved to: ${SUGGESTIONS_PATH}`);
}

main().catch(console.error);
