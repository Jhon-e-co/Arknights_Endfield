"use client";

import React from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_ICON = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface GameMapViewerProps {
  mapImage: string;
  width: number;
  height: number;
  markers: Record<string, Array<{ x: number; y: number; name: string; id: string }>>;
  visibleCategories: string[];
}

const getIconByCategory = (category: string): L.Icon => {
  const iconFileName = category.toLowerCase();
  const iconUrl = `/images/icons/icon-${iconFileName}.webp`;

  const customIcon = L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'custom-map-icon',
  });

  const img = new Image();
  img.src = iconUrl;
  img.onerror = () => {
    console.warn(`Icon not found: ${iconUrl}, using default icon`);
  };

  return customIcon;
};

export default function GameMapViewer({ mapImage, width, height, markers, visibleCategories }: GameMapViewerProps) {
  const bounds: L.LatLngBoundsExpression = [[0, 0], [height, width]];

  const mapStyle = {
    height: '100%',
    width: '100%',
    background: '#1a1a1a',
    transform: 'translate3d(0,0,0)',
    willChange: 'transform'
  };

  return (
    <MapContainer 
      center={[height / 2, width / 2]} 
      zoom={-1} 
      minZoom={-2} 
      maxZoom={2} 
      crs={L.CRS.Simple} 
      style={mapStyle}
      preferCanvas={true}
      zoomSnap={0.5}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={120}
      attributionControl={false}
      zoomControl={false}
    >
      <ImageOverlay url={mapImage} bounds={bounds} />
      <ZoomControl position="bottomright" />
      
      {Object.entries(markers).map(([category, items]) => {
        if (!visibleCategories.includes(category)) {
          return null;
        }

        return items.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.y, marker.x]} 
            icon={getIconByCategory(category)}
          >
            <Popup> 
              <div className="text-sm"> 
                <span className="inline-block px-2 py-0.5 rounded text-xs text-white bg-blue-600 mb-1"> 
                  {category} 
                </span> 
                <p className="font-bold">{marker.name}</p> 
                <p className="text-xs text-gray-400 mt-1"> 
                  {Math.round(marker.x)}, {Math.round(marker.y)} 
                </p> 
              </div> 
            </Popup> 
          </Marker> 
        ));
      })}
    </MapContainer> 
  );
}
