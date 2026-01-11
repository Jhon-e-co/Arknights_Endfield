"use client";

import { useRouter, useSearchParams } from 'next/navigation';

const MATERIAL_TAGS = [
  "Ferrium",
  "Peligun",
  "Kland Kuc",
  "Quartz",
  "Originium"
];

const FUNCTION_TAGS = [
  "Power",
  "Logistics",
  "AIC",
  "Combat"
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';
  const currentMaterial = searchParams.get('material') || '';
  const currentFunction = searchParams.get('function') || '';

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/blueprints?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Sort by
        </label>
        <select
          className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Liked</option>
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Material
        </label>
        <select
          className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
          value={currentMaterial}
          onChange={(e) => updateParams('material', e.target.value)}
        >
          <option value="">All Materials</option>
          {MATERIAL_TAGS.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 hidden md:block">
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Function
        </label>
        <select
          className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
          value={currentFunction}
          onChange={(e) => updateParams('function', e.target.value)}
        >
          <option value="">All Functions</option>
          {FUNCTION_TAGS.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
