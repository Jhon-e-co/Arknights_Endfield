"use client";

import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label
}: SliderProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-zinc-700">
          {label}: {value}
        </label>
      )}
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-zinc-200 rounded-none appearance-none cursor-pointer"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 border-2 border-zinc-200 rounded-none px-2 py-1 text-center"
        />
      </div>
    </div>
  );
}