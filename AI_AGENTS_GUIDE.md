# AI Agents Guide

This guide explains how to use the AI-powered agents to automatically enrich, verify, and discover food security businesses.

## Overview

The Food Security Directory includes three AI agents powered by Claude (Anthropic):

1. **Enrichment Agent** - Fills in missing business information
2. **Verification Agent** - Validates existing data for accuracy
3. **Discovery Agent** - Finds new markets and businesses to add

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your API key from: https://console.anthropic.com/

### 3. Start the API Server (Optional)

If you want to use the admin dashboard:

```bash
npm run api:dev
```

This starts the API server on `http://localhost:3001`

## Using the Agents

### Enrichment Agent

The enrichment agent fills in missing data by:
- Using AI to research and suggest missing information
- Scraping business websites for contact info
- Geocoding addresses to get coordinates

**Run the agent:**

```bash
npm run agent:enrich
```

**What it does:**
- Scans the directory for businesses with missing data
- Uses Claude AI to research each business
- Scrapes websites for phone, email, social media
- Geocodes addresses to find coordinates
- Generates suggestions saved to `api/data/enrichment-suggestions.json`

**Example output:**

```
🚀 Starting data enrichment agent...

Found 15 businesses with missing data

🔍 Enriching data for: Metro Herbs
  🌐 Scraping website: https://www.instagram.com/metroherbs/
  📍 Geocoding address...
  ✅ Found 4 suggestions

✨ Complete! Generated 45 total suggestions
📄 Suggestions saved to: api/data/enrichment-suggestions.json
```

### Verification Agent

The verification agent checks existing data for issues:
- Invalid phone/email formats
- Broken website URLs
- Inconsistent information
- Logical errors

**Run the agent:**

```bash
npm run agent:verify
```

**What it does:**
- Reviews each business in the directory
- Uses Claude AI to identify data quality issues
- Checks for format errors and inconsistencies
- Generates verification results saved to `api/data/verification-results.json`

**Example output:**

```
🔎 Starting data verification agent...

Verifying 32 businesses

🔍 Verifying data for: Boston Public Market
  ✅ Found 0 issues

🔍 Verifying data for: 2 Cents Homegrown
  ⚠️ Found 3 issues

✨ Complete! Found 12 total issues
📄 Results saved to: api/data/verification-results.json
```

### Discovery Agent

The discovery agent finds new markets and businesses:
- Searches specific geographic areas
- Uses Claude AI to research local food resources
- Focuses on underserved communities
- Prioritizes EJ zones and SNAP-accepting locations

**Run the agent:**

```bash
npm run agent:discover
```

**What it does:**
- Searches predefined areas (Boston, Cambridge, Worcester, etc.)
- Uses Claude AI to identify potential new businesses
- Focuses on farmers markets, urban farms, food co-ops
- Saves discoveries to `api/data/new-market-discoveries.json`

**Example output:**

```
🌟 Starting new market discovery agent...

🔍 Searching for new markets in: Boston, MA
  ✅ Discovered 5 potential new markets

🔍 Searching for new markets in: Worcester, MA
  ✅ Discovered 3 potential new markets

✨ Complete! Discovered 8 potential new markets
📄 Discoveries saved to: api/data/new-market-discoveries.json

💡 Review these suggestions in the admin dashboard
```

## Admin Dashboard

The admin dashboard provides a UI to review and approve AI suggestions.

### Access the Dashboard

1. Start the API server:
   ```bash
   npm run api:dev
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Navigate to `/admin` in your browser

### Dashboard Features

#### Data Enrichment Tab
- View all AI-generated suggestions
- See confidence levels (high/medium/low)
- Review current vs. suggested values
- See reasoning and sources
- **Apply** suggestions to update the directory
- **Reject** suggestions you disagree with

#### New Markets Tab
- View discovered businesses
- See confidence levels and sources
- Review complete business information
- **Add to Directory** to create a new entry
- **Reject** discoveries that aren't relevant

## Configuration

### Customizing Search Areas

Edit `api/agents/discover-markets.ts` to change search areas:

```typescript
const SEARCH_AREAS = [
  'Boston, MA',
  'Your City, State',
  // Add more areas...
];
```

### Rate Limiting

The agents include automatic rate limiting to respect API limits:
- 2 second delay between enrichment requests
- 5 second delay between discovery requests

Adjust in the agent files if needed.

### Testing Limits

By default, agents process limited records for testing:
- Enrichment: 5 businesses
- Verification: 10 businesses
- Discovery: 3 areas

Remove `.slice()` limits in production:

```typescript
// Testing (limit to 5):
for (const business of businessesToEnrich.slice(0, 5)) {

// Production (process all):
for (const business of businessesToEnrich) {
```

## API Endpoints

The API server provides these endpoints:

### GET /api/businesses
Get all businesses in the directory

### GET /api/suggestions
Get all enrichment suggestions

### GET /api/verifications
Get all verification results

### GET /api/discoveries
Get all discovered markets

### POST /api/suggestions/:id/apply
Apply an enrichment suggestion

### DELETE /api/suggestions/:id
Reject an enrichment suggestion

### POST /api/discoveries/:id/add
Add a discovered market to the directory

## Best Practices

### 1. Review Before Applying
Always review AI suggestions before applying them. AI can make mistakes.

### 2. Verify High-Impact Changes
Double-check suggestions for critical fields like:
- Coordinates (verify on map)
- Contact information
- SNAP/HIP acceptance
- EJ zone designation

### 3. Run Agents Periodically
Schedule regular runs to:
- Keep data fresh
- Find new markets
- Verify existing information

### 4. Backup Data
Always backup `src/data/businesses.json` before bulk operations:

```bash
cp src/data/businesses.json src/data/businesses.backup.json
```

### 5. Monitor API Usage
Claude API has rate limits and costs. Monitor usage at:
https://console.anthropic.com/

## Troubleshooting

### "API key not found"
Make sure `.env` file exists with valid `ANTHROPIC_API_KEY`

### "Failed to load suggestions"
Run the enrichment agent first to generate suggestions:
```bash
npm run agent:enrich
```

### "Rate limit exceeded"
Increase delay between requests in agent files or wait before retrying

### "Geocoding failed"
OpenStreetMap's Nominatim has usage limits. Add delays or use alternative geocoding service.

### "Module not found"
Make sure dependencies are installed:
```bash
npm install
```

## Advanced Usage

### Custom AI Prompts

Edit `api/services/claude-ai.ts` to customize AI behavior:

```typescript
const systemPrompt = `You are a data enrichment assistant...
Add your custom instructions here...`;
```

### Web Scraping Rules

Edit `api/services/web-scraper.ts` to customize scraping:

```typescript
// Add custom extraction patterns
const customRegex = /your-pattern/g;
```

### Database Integration

To use a real database instead of JSON files:

1. Install database client (e.g., PostgreSQL, MongoDB)
2. Update `api/server.ts` to use database queries
3. Update agent scripts to read/write from database

## Cost Estimation

Approximate costs using Claude API (as of 2024):

- **Enrichment**: ~$0.01 per business
- **Verification**: ~$0.005 per business
- **Discovery**: ~$0.03 per search area

Example: Processing 100 businesses = ~$1-2

Monitor actual costs in Anthropic Console.

## Support

For issues or questions:
- Open an issue on GitHub
- Check Claude API documentation: https://docs.anthropic.com/
- Review error logs in console output

## Future Enhancements

Planned features:
- Automated scheduling (cron jobs)
- Email notifications for new discoveries
- Batch processing for large datasets
- Multi-language support
- Integration with external APIs (Google Places, Yelp, etc.)
- Machine learning confidence scoring
- Historical tracking of changes
