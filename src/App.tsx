import { useState, useMemo } from 'react';
import BusinessCard from './components/BusinessCard';
import FilterPanel from './components/FilterPanel';
import MapView from './components/MapView';
import { Business, FilterState } from './types';
import businessesData from './data/businesses.json';
import { getBusinessCategories } from './utils/businessCategories';

function App() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    snapHip: null,
    blackOwned: null,
    ejZone: null,
    indoorOutdoor: 'all',
    businessType: 'all',
    category: 'all',
    listingTier: 'all',
  });

  const businesses: Business[] = businessesData as Business[];

  const filteredBusinesses = useMemo(() => {
    const filtered = businesses.filter((business) => {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !filters.searchTerm ||
        business.business_name.toLowerCase().includes(searchLower) ||
        business.location.toLowerCase().includes(searchLower) ||
        business.activity.toLowerCase().includes(searchLower);

      const matchesSnapHip =
        filters.snapHip === null ||
        (filters.snapHip && business.snap_hip.toLowerCase() === 'yes') ||
        (!filters.snapHip && business.snap_hip.toLowerCase() !== 'yes');

      const matchesBlackOwned =
        filters.blackOwned === null ||
        (filters.blackOwned &&
          (business.black_owned.toLowerCase().includes('yes') ||
            business.black_owned.toLowerCase().includes('black'))) ||
        (!filters.blackOwned &&
          !business.black_owned.toLowerCase().includes('yes') &&
          !business.black_owned.toLowerCase().includes('black'));

      const matchesEjZone =
        filters.ejZone === null ||
        (filters.ejZone && business.ej_zone.toLowerCase().includes('yes')) ||
        (!filters.ejZone && !business.ej_zone.toLowerCase().includes('yes'));

      const matchesIndoorOutdoor =
        filters.indoorOutdoor === 'all' ||
        (filters.indoorOutdoor === 'outdoor' &&
          business.indoor_outdoor.toLowerCase().includes('outdoor')) ||
        (filters.indoorOutdoor === 'indoor' &&
          business.indoor_outdoor.toLowerCase().includes('indoor')) ||
        (filters.indoorOutdoor === 'hybrid' &&
          (business.indoor_outdoor.toLowerCase().includes('hybrid') ||
            business.indoor_outdoor.toLowerCase().includes('/')));

      const matchesBusinessType =
        filters.businessType === 'all' ||
        business.business_type === filters.businessType;

      const businessCategories = getBusinessCategories(business);

      const matchesCategory =
        filters.category === 'all' || businessCategories.includes(filters.category);

      const matchesListingTier =
        filters.listingTier === 'all' ||
        business.listing_tier === filters.listingTier;

      return (
        matchesSearch &&
        matchesSnapHip &&
        matchesBlackOwned &&
        matchesEjZone &&
        matchesIndoorOutdoor &&
        matchesBusinessType &&
        matchesCategory &&
        matchesListingTier
      );
    });

    // Sort by listing tier (premium > featured > basic) and featured status
    return filtered.sort((a, b) => {
      const tierOrder = { premium: 3, featured: 2, basic: 1 };
      const aTier = tierOrder[a.listing_tier || 'basic'];
      const bTier = tierOrder[b.listing_tier || 'basic'];

      if (aTier !== bTier) return bTier - aTier;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [businesses, filters]);

  const handleLocationClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setView('map');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Massachusetts Food Security & Sustainable Agriculture Directory</h1>
          <p className="mt-2 text-primary-100">
            Find farms, markets, food access resources, and sustainable building solutions
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setView('list')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📋 List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === 'map'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🗺️ Map View
          </button>
        </div>

        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          resultCount={filteredBusinesses.length}
        />

        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No businesses found matching your filters.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      searchTerm: '',
                      snapHip: null,
                      blackOwned: null,
                      ejZone: null,
                      indoorOutdoor: 'all',
                      businessType: 'all',
                      category: 'all',
                      listingTier: 'all',
                    })
                  }
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onLocationClick={handleLocationClick}
                />
              ))
            )}
          </div>
        ) : (
          <div className="h-[600px]">
            <MapView
              businesses={filteredBusinesses}
              center={mapCenter}
              zoom={mapCenter ? 14 : 10}
            />
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-300">
            Massachusetts Food Security Directory | Promoting food access and environmental justice
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
