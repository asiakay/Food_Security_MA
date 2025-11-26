import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Business } from '../types';
import { useEffect, useRef } from 'react';

interface MapViewProps {
  businesses: Business[];
  center?: [number, number];
  zoom?: number;
}

export default function MapView({ businesses, center, zoom = 10 }: MapViewProps) {
  const mapRef = useRef<any>(null);

  const defaultCenter: LatLngExpression = center || [42.3601, -71.0589];

  const businessesWithCoords = businesses.filter(
    (b) => b.latitude !== null && b.longitude !== null
  );

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {businessesWithCoords.map((business) => (
          <Marker
            key={business.id}
            position={[business.latitude!, business.longitude!]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-base mb-2">{business.business_name}</h3>
                <p className="text-sm text-gray-600 mb-1">{business.location}</p>
                {business.activity && (
                  <p className="text-sm text-gray-600 mb-1">{business.activity}</p>
                )}
                {business.hours && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Hours:</span> {business.hours}
                  </p>
                )}
                {business.website && business.website.startsWith('http') && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm block mt-2"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
