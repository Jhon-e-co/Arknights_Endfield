"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Filter, Map, ChevronRight } from 'lucide-react';

// Dynamically import MapViewer with SSR disabled to avoid "window is not defined"
const MapViewer = dynamic(() => import('@/components/map/map-viewer'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-zinc-100">
      <div className="text-center">
        <Map className="w-12 h-12 text-zinc-400 mx-auto mb-4 animate-pulse" />
        <p className="text-zinc-500">Loading Map Engine...</p>
      </div>
    </div>
  )
});

export default function MapPage() {
  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Map Viewer */}
      <div className="z-0 h-full w-full">
        <MapViewer />
      </div>

      {/* Floating Sidebar */}
      <div className="absolute top-4 left-4 w-80 h-[calc(100%-2rem)] border border-zinc-200 bg-white/80 backdrop-blur-md rounded-none shadow-lg z-10">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#FCEE21]" />
            <h2 className="text-lg font-bold">Mission Control</h2>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </div>

        {/* Sidebar Content */}
        <div className="p-4 space-y-6">
          {/* Resources Filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">RESOURCES</h3>
            <div className="space-y-2">
              {[
                { name: 'Iron Ore', icon: '🔩', checked: true },
                { name: 'Copper Ore', icon: '🧲', checked: true },
                { name: 'Silicon', icon: '💎', checked: false },
                { name: 'Water', icon: '💧', checked: true },
                { name: 'Energy', icon: '⚡', checked: false }
              ].map((resource, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`resource-${index}`}
                    checked={resource.checked}
                    className="rounded-none border-2 border-zinc-300 text-[#FCEE21] focus:ring-[#FCEE21]"
                  />
                  <label htmlFor={`resource-${index}`} className="text-sm">
                    {resource.icon} {resource.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Enemies Filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">THREAT LEVEL</h3>
            <div className="space-y-2">
              {[
                { name: 'Low', color: 'bg-green-100', checked: true },
                { name: 'Medium', color: 'bg-yellow-100', checked: true },
                { name: 'High', color: 'bg-red-100', checked: false }
              ].map((threat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`threat-${index}`}
                    checked={threat.checked}
                    className="rounded-none border-2 border-zinc-300 text-[#FCEE21] focus:ring-[#FCEE21]"
                  />
                  <label htmlFor={`threat-${index}`} className="text-sm flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${threat.color}`}></span>
                    {threat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-4 right-4 space-y-3">
        <button className="bg-[#FCEE21] text-black p-3 rounded-none shadow-lg hover:bg-[#FCEE21]/90 transition-colors">
          <span className="sr-only">Add Marker</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button className="bg-white text-black border-2 border-zinc-200 p-3 rounded-none shadow-lg hover:bg-zinc-50 transition-colors">
          <span className="sr-only">Reset View</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}