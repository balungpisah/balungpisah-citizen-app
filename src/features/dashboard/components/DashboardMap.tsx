'use client';

import { useSyncExternalStore } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { IMapMarker } from '@/features/dashboard/types';
import 'leaflet/dist/leaflet.css';

const severityColors = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#FACC15',
  low: '#22C55E',
};

const mapCenter: [number, number] = [-2.0, 118.0];
const indonesiaBounds: [[number, number], [number, number]] = [
  [-11.5, 94.5],
  [6.5, 141.5],
];

interface DashboardMapProps {
  markers: IMapMarker[];
}

export default function DashboardMap({ markers }: DashboardMapProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return <Skeleton className="h-[50vh] w-full rounded-md lg:h-[60vh]" />;
  }

  return (
    <div className="h-[50vh] w-full overflow-hidden rounded-md lg:h-[60vh]">
      <MapContainer
        center={mapCenter}
        zoom={4.5}
        minZoom={4.5}
        maxZoom={18}
        maxBounds={indonesiaBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          bounds={indonesiaBounds}
        />

        {markers.map((marker) => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lon]}
            radius={8}
            fillColor={severityColors[marker.max_severity]}
            color="#fff"
            weight={2}
            opacity={1}
            fillOpacity={0.8}
          >
            <Popup>
              <div className="space-y-2">
                <div className="font-semibold">{marker.title || 'Tanpa Judul'}</div>
                <div className="text-muted-foreground text-sm">{marker.reference_number}</div>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: severityColors[marker.max_severity],
                    color: severityColors[marker.max_severity],
                  }}
                >
                  {marker.max_severity}
                </Badge>
                {marker.primary_category_name && (
                  <div className="text-sm">{marker.primary_category_name}</div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
