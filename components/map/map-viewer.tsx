"use client";

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapViewer() {
  // Default center: Somewhere in Asia for demo
  const center = [35.6762, 139.6503]; // Tokyo coordinates as placeholder
  const zoom = 13;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full"
      style={{ height: '100%', width: '100%' }}
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Example Marker */}
      <Marker position={center}>
        <Popup>
          <div className="text-center">
            <h3 className="font-bold">Endfield Hub</h3>
            <p className="text-sm text-zinc-600">Main operational base</p>
            <div className="mt-2 flex justify-between text-xs">
              <span>Resources: High</span>
              <span>Threat: Low</span>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}