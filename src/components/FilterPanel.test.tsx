import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from './FilterPanel';
import { FilterState } from '../types';

describe('FilterPanel', () => {
  const mockFilters: FilterState = {
    searchTerm: '',
    snapHip: null,
    blackOwned: null,
    ejZone: null,
    indoorOutdoor: 'all',
    businessType: 'all',
    category: 'all',
    listingTier: 'all',
  };

  it('should render filter panel with title', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    expect(screen.getByText('Filter Directory')).toBeDefined();
  });

  it('should display result count', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={42} />);

    expect(screen.getByText(/42/)).toBeDefined();
    expect(screen.getByText(/results/)).toBeDefined();
  });

  it('should display singular result when count is 1', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={1} />);

    expect(screen.getByText(/1/)).toBeDefined();
    expect(screen.getByText(/result$/)).toBeDefined();
  });

  it('should call onFilterChange when search term changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const searchInput = screen.getByPlaceholderText(/Search by name/);
    fireEvent.change(searchInput, { target: { value: 'farm' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      searchTerm: 'farm',
    });
  });

  it('should call onFilterChange when SNAP/HIP filter changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const snapHipSelect = screen.getByLabelText(/SNAP\/HIP Accepted/);
    fireEvent.change(snapHipSelect, { target: { value: 'yes' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      snapHip: true,
    });
  });

  it('should set snapHip to null when "all" is selected', () => {
    const onFilterChange = vi.fn();
    const filtersWithSnapHip = { ...mockFilters, snapHip: true };

    render(<FilterPanel filters={filtersWithSnapHip} onFilterChange={onFilterChange} resultCount={10} />);

    const snapHipSelect = screen.getByLabelText(/SNAP\/HIP Accepted/);
    fireEvent.change(snapHipSelect, { target: { value: 'all' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...filtersWithSnapHip,
      snapHip: null,
    });
  });

  it('should call onFilterChange when Black-Owned filter changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const blackOwnedSelect = screen.getByLabelText(/Black-Owned\/Led/);
    fireEvent.change(blackOwnedSelect, { target: { value: 'yes' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      blackOwned: true,
    });
  });

  it('should call onFilterChange when EJ Zone filter changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const ejZoneSelect = screen.getByLabelText(/Environmental Justice Zone/);
    fireEvent.change(ejZoneSelect, { target: { value: 'yes' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      ejZone: true,
    });
  });

  it('should call onFilterChange when business type changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const businessTypeSelect = screen.getByLabelText(/Business Type/);
    fireEvent.change(businessTypeSelect, { target: { value: 'farm' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      businessType: 'farm',
    });
  });

  it('should call onFilterChange when category changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const categorySelect = screen.getByLabelText(/^Category$/);
    fireEvent.change(categorySelect, { target: { value: 'produce_farm' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      category: 'produce_farm',
    });
  });

  it('should call onFilterChange when listing tier changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const listingTierSelect = screen.getByLabelText(/Listing Tier/);
    fireEvent.change(listingTierSelect, { target: { value: 'premium' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      listingTier: 'premium',
    });
  });

  it('should call onFilterChange when indoor/outdoor changes', () => {
    const onFilterChange = vi.fn();
    render(<FilterPanel filters={mockFilters} onFilterChange={onFilterChange} resultCount={10} />);

    const indoorOutdoorSelect = screen.getByLabelText(/Location Type/);
    fireEvent.change(indoorOutdoorSelect, { target: { value: 'outdoor' } });

    expect(onFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      indoorOutdoor: 'outdoor',
    });
  });

  it('should clear all filters when Clear All button is clicked', () => {
    const onFilterChange = vi.fn();
    const filtersWithValues: FilterState = {
      searchTerm: 'test',
      snapHip: true,
      blackOwned: true,
      ejZone: true,
      indoorOutdoor: 'outdoor',
      businessType: 'farm',
      category: 'produce_farm',
      listingTier: 'premium',
    };

    render(<FilterPanel filters={filtersWithValues} onFilterChange={onFilterChange} resultCount={10} />);

    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);

    expect(onFilterChange).toHaveBeenCalledWith({
      searchTerm: '',
      snapHip: null,
      blackOwned: null,
      ejZone: null,
      indoorOutdoor: 'all',
      businessType: 'all',
      category: 'all',
      listingTier: 'all',
    });
  });

  it('should display current search term in input', () => {
    const onFilterChange = vi.fn();
    const filtersWithSearch = { ...mockFilters, searchTerm: 'greenhouse' };

    render(<FilterPanel filters={filtersWithSearch} onFilterChange={onFilterChange} resultCount={5} />);

    const searchInput = screen.getByPlaceholderText(/Search by name/);
    expect((searchInput as HTMLInputElement).value).toBe('greenhouse');
  });

  it('should display correct selected values in dropdowns', () => {
    const onFilterChange = vi.fn();
    const filtersWithValues: FilterState = {
      searchTerm: '',
      snapHip: true,
      blackOwned: null,
      ejZone: false,
      indoorOutdoor: 'outdoor',
      businessType: 'supplier',
      category: 'hempcrete_supplier',
      listingTier: 'featured',
    };

    render(<FilterPanel filters={filtersWithValues} onFilterChange={onFilterChange} resultCount={3} />);

    expect((screen.getByLabelText(/SNAP\/HIP Accepted/) as HTMLSelectElement).value).toBe('yes');
    expect((screen.getByLabelText(/Black-Owned\/Led/) as HTMLSelectElement).value).toBe('all');
    expect((screen.getByLabelText(/Environmental Justice Zone/) as HTMLSelectElement).value).toBe('no');
    expect((screen.getByLabelText(/Location Type/) as HTMLSelectElement).value).toBe('outdoor');
    expect((screen.getByLabelText(/Business Type/) as HTMLSelectElement).value).toBe('supplier');
    expect((screen.getByLabelText(/^Category$/) as HTMLSelectElement).value).toBe('hempcrete_supplier');
    expect((screen.getByLabelText(/Listing Tier/) as HTMLSelectElement).value).toBe('featured');
  });
});
