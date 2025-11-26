import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
  onLocationClick?: (lat: number, lng: number) => void;
}

export default function BusinessCard({ business, onLocationClick }: BusinessCardProps) {
  const hasCoordinates = business.latitude !== null && business.longitude !== null;
  const isShowcase = business.showcase_project?.is_showcase;
  const isSupplier = business.business_type === 'supplier' || business.business_type === 'service_provider';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
      business.listing_tier === 'premium' ? 'ring-2 ring-yellow-400' :
      business.listing_tier === 'featured' ? 'ring-1 ring-blue-300' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{business.business_name}</h3>
          {business.listing_tier && business.listing_tier !== 'basic' && (
            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
              business.listing_tier === 'premium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {business.listing_tier.toUpperCase()}
            </span>
          )}
        </div>
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

        {isShowcase && business.showcase_project && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-md border border-green-200">
            <p className="font-semibold text-green-800 mb-2">🌟 Showcase Project</p>
            {business.showcase_project.project_type && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Type:</span> {business.showcase_project.project_type}
              </p>
            )}
            {business.showcase_project.budget_range && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Budget:</span> {business.showcase_project.budget_range}
              </p>
            )}
            {business.showcase_project.timeline && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Timeline:</span> {business.showcase_project.timeline}
              </p>
            )}
            {business.showcase_project.design_highlights && business.showcase_project.design_highlights.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-700 mb-1">Key Features:</p>
                <ul className="text-xs text-gray-600 space-y-0.5 ml-4">
                  {business.showcase_project.design_highlights.slice(0, 4).map((highlight, idx) => (
                    <li key={idx}>• {highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            {business.showcase_project.open_source && (
              <p className="text-xs text-green-700 mt-2 font-semibold">✓ Open-Source Design Available</p>
            )}
            {business.showcase_project.replicable && (
              <p className="text-xs text-blue-700 font-semibold">✓ Community-Replicable</p>
            )}
          </div>
        )}

        {isSupplier && business.supplier_info && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="font-semibold text-blue-800 mb-2">Supplier Information</p>
            {business.supplier_info.service_area && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Service Area:</span> {business.supplier_info.service_area}
              </p>
            )}
            {business.supplier_info.years_experience && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Experience:</span> {business.supplier_info.years_experience} years
              </p>
            )}
            {business.supplier_info.certifications && business.supplier_info.certifications.length > 0 && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">Certifications:</span> {business.supplier_info.certifications.join(', ')}
              </p>
            )}
            {business.supplier_info.specialties && business.supplier_info.specialties.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-700 mb-1">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {business.supplier_info.specialties.slice(0, 3).map((specialty, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {business.supplier_info.pricing_tier && (
              <p className="text-xs text-gray-600 mt-2">
                <span className="font-semibold">Pricing:</span> {business.supplier_info.pricing_tier}
              </p>
            )}
          </div>
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

          {business.verified && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              ✓ Verified
            </span>
          )}

          {business.categories && business.categories.map((cat, idx) => (
            <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
              {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          ))}
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
