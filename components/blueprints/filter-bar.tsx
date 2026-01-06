"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';
  const currentMaterial = searchParams.get('material') || '';
  const currentStage = searchParams.get('stage') || '';

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
          Material Type
        </label>
        <select
          className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
          value={currentMaterial}
          onChange={(e) => updateParams('material', e.target.value)}
        >
          <option value="">All Materials</option>
          <option value="Iron">Iron</option>
          <option value="Copper">Copper</option>
          <option value="Silicon">Silicon</option>
          <option value="Water">Water</option>
        </select>
      </div>

      <div className="flex-1 hidden md:block">
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Stage
        </label>
        <select
          className="w-full border-2 border-zinc-200 bg-white rounded-none px-3 py-2"
          value={currentStage}
          onChange={(e) => updateParams('stage', e.target.value)}
        >
          <option value="">All Stages</option>
          <option value="Early Game">Early Game</option>
          <option value="Mid Game">Mid Game</option>
          <option value="End Game">End Game</option>
        </select>
      </div>
    </div>
  );
}
