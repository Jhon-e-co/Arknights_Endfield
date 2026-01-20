"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Filter, Map, ChevronRight } from 'lucide-react';
import { MAPS } from '@/lib/map-data';

const GameMapViewer = dynamic(() => import('@/components/map/game-map-viewer'), {
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
  const currentMap = MAPS['the-hub'];
  const categories = Object.keys(currentMap.markers);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(categories));

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedCategories.size === categories.length) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories(new Set(categories));
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <div className="z-0 h-full w-full">
        <GameMapViewer 
          mapImage={currentMap.image} 
          width={currentMap.size.width} 
          height={currentMap.size.height} 
          markers={currentMap.markers}
          visibleCategories={Array.from(selectedCategories)}
        />
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
          {/* Select All Toggle */}
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200">
            <input
              type="checkbox"
              id="select-all"
              checked={selectedCategories.size === categories.length}
              onChange={toggleAll}
              className="rounded-none border-2 border-zinc-300 text-[#FCEE21] focus:ring-[#FCEE21]"
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({selectedCategories.size}/{categories.length})
            </label>
          </div>

          {/* Category Filters */}
          <div>
            <h3 className="text-sm font-medium mb-3">CATEGORIES</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.has(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded-none border-2 border-zinc-300 text-[#FCEE21] focus:ring-[#FCEE21]"
                  />
                  <label htmlFor={`category-${category}`} className="text-sm flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-zinc-200 flex items-center justify-center text-xs">
                      {currentMap.markers[category].length}
                    </span>
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}