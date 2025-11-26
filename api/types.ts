import { z } from 'zod';

export const BusinessSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  location: z.string(),
  activity: z.string(),
  website: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  phone: z.string(),
  email: z.string(),
  hours: z.string(),
  season: z.string(),
  snap_hip: z.string(),
  vendor_info: z.string(),
  social: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  black_owned: z.string(),
  indoor_outdoor: z.string(),
  ej_zone: z.string(),
});

export type Business = z.infer<typeof BusinessSchema>;

export interface EnrichmentSuggestion {
  businessId: number;
  field: keyof Business;
  currentValue: string | number | null;
  suggestedValue: string | number | null;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  reasoning: string;
}

export interface VerificationResult {
  businessId: number;
  field: keyof Business;
  isValid: boolean;
  currentValue: string | number | null;
  issues: string[];
  suggestions: string[];
}

export interface NewMarketDiscovery {
  business_name: string;
  location: string;
  activity: string;
  website: string;
  phone: string;
  email: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  discoveredAt: string;
}
