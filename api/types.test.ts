import { describe, it, expect } from 'vitest';
import { BusinessSchema, type Business, type EnrichmentSuggestion, type VerificationResult, type NewMarketDiscovery } from './types';

describe('BusinessSchema validation', () => {
  it('should validate a complete business object', () => {
    const validBusiness = {
      id: 1,
      business_name: 'Test Farm',
      location: 'Boston, MA',
      activity: 'Organic Vegetables',
      website: 'https://testfarm.com',
      instagram: '@testfarm',
      facebook: 'testfarm',
      phone: '617-555-0100',
      email: 'info@testfarm.com',
      hours: '9am-5pm',
      season: 'Year Round',
      snap_hip: 'Yes',
      vendor_info: 'Local produce',
      social: 'Instagram, Facebook',
      latitude: 42.3601,
      longitude: -71.0589,
      black_owned: 'Yes',
      indoor_outdoor: 'Outdoor',
      ej_zone: 'No',
    };

    const result = BusinessSchema.safeParse(validBusiness);
    expect(result.success).toBe(true);
  });

  it('should allow null for latitude and longitude', () => {
    const business = {
      id: 1,
      business_name: 'Test Farm',
      location: 'Boston, MA',
      activity: 'Organic Vegetables',
      website: 'https://testfarm.com',
      instagram: '@testfarm',
      facebook: 'testfarm',
      phone: '617-555-0100',
      email: 'info@testfarm.com',
      hours: '9am-5pm',
      season: 'Year Round',
      snap_hip: 'Yes',
      vendor_info: 'Local produce',
      social: 'Instagram, Facebook',
      latitude: null,
      longitude: null,
      black_owned: 'Yes',
      indoor_outdoor: 'Outdoor',
      ej_zone: 'No',
    };

    const result = BusinessSchema.safeParse(business);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidBusiness = {
      id: 1,
      business_name: 'Test Farm',
      // missing required fields
    };

    const result = BusinessSchema.safeParse(invalidBusiness);
    expect(result.success).toBe(false);
  });

  it('should reject invalid types', () => {
    const invalidBusiness = {
      id: '1', // should be number
      business_name: 'Test Farm',
      location: 'Boston, MA',
      activity: 'Organic Vegetables',
      website: 'https://testfarm.com',
      instagram: '@testfarm',
      facebook: 'testfarm',
      phone: '617-555-0100',
      email: 'info@testfarm.com',
      hours: '9am-5pm',
      season: 'Year Round',
      snap_hip: 'Yes',
      vendor_info: 'Local produce',
      social: 'Instagram, Facebook',
      latitude: '42.3601', // should be number
      longitude: -71.0589,
      black_owned: 'Yes',
      indoor_outdoor: 'Outdoor',
      ej_zone: 'No',
    };

    const result = BusinessSchema.safeParse(invalidBusiness);
    expect(result.success).toBe(false);
  });
});

describe('EnrichmentSuggestion type', () => {
  it('should accept valid enrichment suggestion', () => {
    const suggestion: EnrichmentSuggestion = {
      businessId: 1,
      field: 'website',
      currentValue: '',
      suggestedValue: 'https://newfarm.com',
      confidence: 'high',
      source: 'web scraping',
      reasoning: 'Found on social media profile',
    };

    expect(suggestion.businessId).toBe(1);
    expect(suggestion.confidence).toBe('high');
  });

  it('should enforce confidence levels', () => {
    const validConfidences: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];

    validConfidences.forEach(conf => {
      const suggestion: EnrichmentSuggestion = {
        businessId: 1,
        field: 'phone',
        currentValue: null,
        suggestedValue: '617-555-0100',
        confidence: conf,
        source: 'test',
        reasoning: 'test',
      };
      expect(suggestion.confidence).toBe(conf);
    });
  });
});

describe('VerificationResult type', () => {
  it('should accept valid verification result', () => {
    const result: VerificationResult = {
      businessId: 1,
      field: 'email',
      isValid: true,
      currentValue: 'test@example.com',
      issues: [],
      suggestions: [],
    };

    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('should handle invalid results with issues', () => {
    const result: VerificationResult = {
      businessId: 2,
      field: 'phone',
      isValid: false,
      currentValue: 'invalid-phone',
      issues: ['Invalid phone format'],
      suggestions: ['Use format: XXX-XXX-XXXX'],
    };

    expect(result.isValid).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.suggestions).toHaveLength(1);
  });
});

describe('NewMarketDiscovery type', () => {
  it('should accept valid market discovery', () => {
    const discovery: NewMarketDiscovery = {
      business_name: 'New Farm Market',
      location: 'Cambridge, MA',
      activity: 'Farmers Market',
      website: 'https://newfarm.com',
      phone: '617-555-0200',
      email: 'info@newfarm.com',
      confidence: 'high',
      source: 'web research',
      discoveredAt: new Date().toISOString(),
    };

    expect(discovery.confidence).toBe('high');
    expect(discovery.discoveredAt).toBeTruthy();
  });
});
