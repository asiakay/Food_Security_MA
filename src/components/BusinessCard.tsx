import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onLocationClick?: (lat: number, lng: number) => void;
}

export default function BusinessCard({ business, onLocationClick }: BusinessCardProps) {
  const hasCoordinates = business.latitude !== null && business.longitude !== null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{business.business_name}</h3>
        {hasCoordinates && onLocationClick && (
          <button
            onClick={() => onLocationClick(business.latitude!, business.longitude!)}
            className="text-primary-600 hover:text-primary-700 text-sm"
            title="View on map"
          >
            📍 Map
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          <span className="font-semibold">Location:</span> {business.location}
        </p>

        {business.activity && (
          <p className="text-gray-600">
            <span className="font-semibold">Activities:</span> {business.activity}
          </p>
        )}

        {business.hours && (
          <p className="text-gray-600">
            <span className="font-semibold">Hours:</span> {business.hours}
          </p>
        )}

        {business.season && (
          <p className="text-gray-600">
            <span className="font-semibold">Season:</span> {business.season}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {business.snap_hip && business.snap_hip.toLowerCase() === 'yes' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              SNAP/HIP Accepted
            </span>
          )}

          {business.black_owned && (business.black_owned.toLowerCase().includes('yes') || business.black_owned.toLowerCase().includes('black')) && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
              Black-Owned/Led
            </span>
          )}

          {business.ej_zone && business.ej_zone.toLowerCase().includes('yes') && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              EJ Zone
            </span>
          )}

          {business.indoor_outdoor && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              {business.indoor_outdoor}
            </span>
          )}
        </div>

        <div className="border-t pt-3 mt-3 space-y-1">
          {business.website && business.website.startsWith('http') && (
            <p>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                🌐 Website
              </a>
            </p>
          )}

          {business.phone && (
            <p>
              <a href={`tel:${business.phone}`} className="text-gray-700 hover:text-primary-600">
                📞 {business.phone}
              </a>
            </p>
          )}

          {business.email && (
            <p>
              <a href={`mailto:${business.email}`} className="text-gray-700 hover:text-primary-600">
                ✉️ {business.email}
              </a>
            </p>
          )}

          {business.social && (
            <p className="text-gray-600 text-xs">
              {business.social}
            </p>
          )}

          {business.vendor_info && business.vendor_info.startsWith('http') && (
            <p>
              <a
                href={business.vendor_info}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 hover:underline text-xs"
              >
                Vendor Info
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
