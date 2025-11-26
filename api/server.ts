import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import type { Business, EnrichmentSuggestion, VerificationResult, NewMarketDiscovery } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(express.json());

const DATA_PATH = path.join(process.cwd(), 'src/data/businesses.json');
const SUGGESTIONS_PATH = path.join(process.cwd(), 'api/data/enrichment-suggestions.json');
const VERIFICATION_PATH = path.join(process.cwd(), 'api/data/verification-results.json');
const DISCOVERIES_PATH = path.join(process.cwd(), 'api/data/new-market-discoveries.json');

// Helper to read JSON files
async function readJSONFile<T>(filePath: string): Promise<T | null> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Helper to write JSON files
async function writeJSONFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Get all businesses
app.get('/api/businesses', async (req, res) => {
  try {
    const businesses = await readJSONFile<Business[]>(DATA_PATH);
    res.json(businesses || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load businesses' });
  }
});

// Get enrichment suggestions
app.get('/api/suggestions', async (req, res) => {
  try {
    const suggestions = await readJSONFile<EnrichmentSuggestion[]>(SUGGESTIONS_PATH);
    res.json(suggestions || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load suggestions' });
  }
});

// Get verification results
app.get('/api/verifications', async (req, res) => {
  try {
    const verifications = await readJSONFile<VerificationResult[]>(VERIFICATION_PATH);
    res.json(verifications || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load verifications' });
  }
});

// Get market discoveries
app.get('/api/discoveries', async (req, res) => {
  try {
    const discoveries = await readJSONFile<NewMarketDiscovery[]>(DISCOVERIES_PATH);
    res.json(discoveries || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load discoveries' });
  }
});

// Apply a suggestion
app.post('/api/suggestions/:id/apply', async (req, res) => {
  try {
    const businesses = await readJSONFile<Business[]>(DATA_PATH);
    const suggestions = await readJSONFile<EnrichmentSuggestion[]>(SUGGESTIONS_PATH);

    if (!businesses || !suggestions) {
      return res.status(404).json({ error: 'Data not found' });
    }

    const suggestionId = parseInt(req.params.id);
    const suggestion = suggestions[suggestionId];

    if (!suggestion) {
      return res.status(404).json({ error: 'Suggestion not found' });
    }

    // Find and update the business
    const business = businesses.find((b) => b.id === suggestion.businessId);
    if (business) {
      (business as any)[suggestion.field] = suggestion.suggestedValue;
      await writeJSONFile(DATA_PATH, businesses);

      // Remove the applied suggestion
      suggestions.splice(suggestionId, 1);
      await writeJSONFile(SUGGESTIONS_PATH, suggestions);

      res.json({ success: true, business });
    } else {
      res.status(404).json({ error: 'Business not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply suggestion' });
  }
});

// Reject a suggestion
app.delete('/api/suggestions/:id', async (req, res) => {
  try {
    const suggestions = await readJSONFile<EnrichmentSuggestion[]>(SUGGESTIONS_PATH);

    if (!suggestions) {
      return res.status(404).json({ error: 'Suggestions not found' });
    }

    const suggestionId = parseInt(req.params.id);
    suggestions.splice(suggestionId, 1);
    await writeJSONFile(SUGGESTIONS_PATH, suggestions);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject suggestion' });
  }
});

// Add a discovered market as a new business
app.post('/api/discoveries/:id/add', async (req, res) => {
  try {
    const businesses = await readJSONFile<Business[]>(DATA_PATH);
    const discoveries = await readJSONFile<NewMarketDiscovery[]>(DISCOVERIES_PATH);

    if (!businesses || !discoveries) {
      return res.status(404).json({ error: 'Data not found' });
    }

    const discoveryId = parseInt(req.params.id);
    const discovery = discoveries[discoveryId];

    if (!discovery) {
      return res.status(404).json({ error: 'Discovery not found' });
    }

    // Create new business from discovery
    const newBusiness: Business = {
      id: Math.max(...businesses.map((b) => b.id)) + 1,
      business_name: discovery.business_name,
      location: discovery.location,
      activity: discovery.activity,
      website: discovery.website,
      instagram: '',
      facebook: '',
      phone: discovery.phone,
      email: discovery.email,
      hours: '',
      season: '',
      snap_hip: '',
      vendor_info: '',
      social: '',
      latitude: null,
      longitude: null,
      black_owned: '',
      indoor_outdoor: '',
      ej_zone: '',
    };

    businesses.push(newBusiness);
    await writeJSONFile(DATA_PATH, businesses);

    // Remove the added discovery
    discoveries.splice(discoveryId, 1);
    await writeJSONFile(DISCOVERIES_PATH, discoveries);

    res.json({ success: true, business: newBusiness });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add discovery' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
