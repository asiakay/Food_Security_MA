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

  const clearFilters = () => {
    onFilterChange({
      searchTerm: '',
      snapHip: null,
      blackOwned: null,
      ejZone: null,
      indoorOutdoor: 'all',
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="snapHip" className="block text-sm font-medium text-gray-700 mb-1">
              SNAP/HIP Accepted
            </label>
            <select
              id="snapHip"
              value={filters.snapHip === null ? 'all' : filters.snapHip ? 'yes' : 'no'}
              onChange={(e) => handleSnapHipChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
