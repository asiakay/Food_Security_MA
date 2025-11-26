import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function FilterPanel({ filters, onFilterChange, resultCount }: FilterPanelProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleSnapHipChange = (value: string) => {
    onFilterChange({
      ...filters,
      snapHip: value === 'all' ? null : value === 'yes',
    });
  };

  const handleBlackOwnedChange = (value: string) => {
    onFilterChange({
      ...filters,
      blackOwned: value === 'all' ? null : value === 'yes',
    });
  };

  const handleEjZoneChange = (value: string) => {
    onFilterChange({
      ...filters,
      ejZone: value === 'all' ? null : value === 'yes',
    });
  };

  const handleIndoorOutdoorChange = (value: string) => {
    onFilterChange({
      ...filters,
      indoorOutdoor: value,
    });
  };

  const handleBusinessTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      businessType: value as any,
    });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value as any,
    });
  };

  const handleListingTierChange = (value: string) => {
    onFilterChange({
      ...filters,
      listingTier: value as any,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      searchTerm: '',
      snapHip: null,
      blackOwned: null,
      ejZone: null,
      indoorOutdoor: 'all',
      businessType: 'all',
      category: 'all',
      listingTier: 'all',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Filter Directory</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search by name, location, or activity..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <select
              id="businessType"
              value={filters.businessType}
              onChange={(e) => handleBusinessTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All Types</option>
              <option value="farm">Farms</option>
              <option value="farmers_market">Farmers Markets</option>
              <option value="food_business">Food Businesses</option>
              <option value="supplier">Suppliers</option>
              <option value="service_provider">Service Providers</option>
              <option value="showcase_project">Showcase Projects</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All Categories</option>
              <option value="produce_farm">Produce Farms</option>
              <option value="farmers_market">Farmers Markets</option>
              <option value="hempcrete_supplier">Hempcrete Suppliers</option>
              <option value="greenhouse_builder">Greenhouse Builders</option>
              <option value="solar_installer">Solar Installers</option>
              <option value="sustainable_building">Sustainable Building</option>
              <option value="agricultural_services">Agricultural Services</option>
              <option value="showcase_project">Showcase Projects</option>
            </select>
          </div>

          <div>
            <label htmlFor="listingTier" className="block text-sm font-medium text-gray-700 mb-1">
              Listing Tier
            </label>
            <select
              id="listingTier"
              value={filters.listingTier}
              onChange={(e) => handleListingTierChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All Tiers</option>
              <option value="premium">Premium</option>
              <option value="featured">Featured</option>
              <option value="basic">Basic</option>
            </select>
          </div>

          <div>
            <label htmlFor="snapHip" className="block text-sm font-medium text-gray-700 mb-1">
              SNAP/HIP Accepted
            </label>
            <select
              id="snapHip"
              value={filters.snapHip === null ? 'all' : filters.snapHip ? 'yes' : 'no'}
              onChange={(e) => handleSnapHipChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="blackOwned" className="block text-sm font-medium text-gray-700 mb-1">
              Black-Owned/Led
            </label>
            <select
              id="blackOwned"
              value={filters.blackOwned === null ? 'all' : filters.blackOwned ? 'yes' : 'no'}
              onChange={(e) => handleBlackOwnedChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="ejZone" className="block text-sm font-medium text-gray-700 mb-1">
              Environmental Justice Zone
            </label>
            <select
              id="ejZone"
              value={filters.ejZone === null ? 'all' : filters.ejZone ? 'yes' : 'no'}
              onChange={(e) => handleEjZoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="indoorOutdoor" className="block text-sm font-medium text-gray-700 mb-1">
              Location Type
            </label>
            <select
              id="indoorOutdoor"
              value={filters.indoorOutdoor}
              onChange={(e) => handleIndoorOutdoorChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
            >
              <option value="all">All</option>
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
              <option value="hybrid">Hybrid/Mixed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{resultCount}</span> result{resultCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
