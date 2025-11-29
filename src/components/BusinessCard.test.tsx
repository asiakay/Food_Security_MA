import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BusinessCard from './BusinessCard';
import { Business } from '../types';

describe('BusinessCard', () => {
  const mockBusiness: Business = {
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

  it('should render business name', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText('Test Farm')).toBeDefined();
  });

  it('should render location', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText(/Boston, MA/)).toBeDefined();
  });

  it('should render activity', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText(/Organic Vegetables/)).toBeDefined();
  });

  it('should render hours and season', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText(/9am-5pm/)).toBeDefined();
    expect(screen.getByText(/Year Round/)).toBeDefined();
  });

  it('should show SNAP/HIP badge when accepted', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText('SNAP/HIP Accepted')).toBeDefined();
  });

  it('should show Black-Owned/Led badge', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.getByText('Black-Owned/Led')).toBeDefined();
  });

  it('should not show EJ Zone badge when not in EJ zone', () => {
    render(<BusinessCard business={mockBusiness} />);
    expect(screen.queryByText('EJ Zone')).toBeNull();
  });

  it('should show map button when coordinates are provided', () => {
    const onLocationClick = vi.fn();
    render(<BusinessCard business={mockBusiness} onLocationClick={onLocationClick} />);

    const mapButton = screen.getByTitle('View on map');
    expect(mapButton).toBeDefined();
  });

  it('should call onLocationClick with correct coordinates', () => {
    const onLocationClick = vi.fn();
    render(<BusinessCard business={mockBusiness} onLocationClick={onLocationClick} />);

    const mapButton = screen.getByTitle('View on map');
    fireEvent.click(mapButton);

    expect(onLocationClick).toHaveBeenCalledWith(42.3601, -71.0589);
  });

  it('should not show map button when coordinates are null', () => {
    const businessWithoutCoords = { ...mockBusiness, latitude: null, longitude: null };
    const onLocationClick = vi.fn();

    render(<BusinessCard business={businessWithoutCoords} onLocationClick={onLocationClick} />);

    expect(screen.queryByTitle('View on map')).toBeNull();
  });

  it('should render website link', () => {
    render(<BusinessCard business={mockBusiness} />);
    const websiteLink = screen.getByText('🌐 Website');
    expect(websiteLink).toBeDefined();
    expect(websiteLink.closest('a')).toHaveProperty('href', 'https://testfarm.com/');
  });

  it('should render phone link', () => {
    render(<BusinessCard business={mockBusiness} />);
    const phoneLink = screen.getByText(/617-555-0100/);
    expect(phoneLink).toBeDefined();
    expect(phoneLink.closest('a')).toHaveProperty('href', 'tel:617-555-0100');
  });

  it('should render email link', () => {
    render(<BusinessCard business={mockBusiness} />);
    const emailLink = screen.getByText(/info@testfarm.com/);
    expect(emailLink).toBeDefined();
    expect(emailLink.closest('a')).toHaveProperty('href', 'mailto:info@testfarm.com');
  });

  it('should render premium listing tier with styling', () => {
    const premiumBusiness: Business = {
      ...mockBusiness,
      listing_tier: 'premium',
    };

    const { container } = render(<BusinessCard business={premiumBusiness} />);
    expect(screen.getByText('PREMIUM')).toBeDefined();
    expect(container.querySelector('.ring-2.ring-yellow-400')).toBeTruthy();
  });

  it('should render featured listing tier with styling', () => {
    const featuredBusiness: Business = {
      ...mockBusiness,
      listing_tier: 'featured',
    };

    const { container } = render(<BusinessCard business={featuredBusiness} />);
    expect(screen.getByText('FEATURED')).toBeDefined();
    expect(container.querySelector('.ring-1.ring-blue-300')).toBeTruthy();
  });

  it('should render showcase project information', () => {
    const showcaseBusiness: Business = {
      ...mockBusiness,
      showcase_project: {
        is_showcase: true,
        project_type: 'Solar Greenhouse',
        budget_range: '$50k-$100k',
        timeline: '6 months',
        design_highlights: ['Passive solar heating', 'Rainwater collection', 'Recycled materials'],
        replicable: true,
        open_source: true,
      },
    };

    render(<BusinessCard business={showcaseBusiness} />);

    expect(screen.getByText('🌟 Showcase Project')).toBeDefined();
    expect(screen.getByText(/Solar Greenhouse/)).toBeDefined();
    expect(screen.getByText(/\$50k-\$100k/)).toBeDefined();
    expect(screen.getByText(/6 months/)).toBeDefined();
    expect(screen.getByText('✓ Open-Source Design Available')).toBeDefined();
    expect(screen.getByText('✓ Community-Replicable')).toBeDefined();
  });

  it('should render supplier information', () => {
    const supplierBusiness: Business = {
      ...mockBusiness,
      business_type: 'supplier',
      supplier_info: {
        service_area: 'Massachusetts',
        years_experience: 10,
        certifications: ['Organic', 'Certified B Corp'],
        specialties: ['Hempcrete', 'Natural Building'],
        pricing_tier: 'Mid-range',
      },
    };

    render(<BusinessCard business={supplierBusiness} />);

    expect(screen.getByText('Supplier Information')).toBeDefined();
    expect(screen.getByText(/Massachusetts/)).toBeDefined();
    expect(screen.getByText(/10 years/)).toBeDefined();
    expect(screen.getByText(/Organic, Certified B Corp/)).toBeDefined();
    expect(screen.getByText(/Mid-range/)).toBeDefined();
  });

  it('should show verified badge when verified', () => {
    const verifiedBusiness: Business = {
      ...mockBusiness,
      verified: true,
    };

    render(<BusinessCard business={verifiedBusiness} />);
    expect(screen.getByText('✓ Verified')).toBeDefined();
  });

  it('should render categories with proper formatting', () => {
    const businessWithCategories: Business = {
      ...mockBusiness,
      categories: ['produce_farm', 'greenhouse_builder'],
    };

    render(<BusinessCard business={businessWithCategories} />);
    expect(screen.getByText('Produce Farm')).toBeDefined();
    expect(screen.getByText('Greenhouse Builder')).toBeDefined();
  });
});
