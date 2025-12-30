"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, Coins, BookOpen, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MOCK_CHARACTERS, calculateCost, Character, CalculationResult } from '@/lib/mock-calculator';
import { AdUnit } from '@/components/ui/ad-unit';

export default function CalculatorPage() {
  // State
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(MOCK_CHARACTERS[0]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(10);
  const [cost, setCost] = useState<CalculationResult>(calculateCost(1, 10));

  // Update cost whenever levels change
  useEffect(() => {
    const newCost = calculateCost(currentLevel, targetLevel);
    setCost(newCost);
  }, [currentLevel, targetLevel]);

  // Handle current level change
  const handleCurrentLevelChange = (value: number) => {
    setCurrentLevel(value);
    // Ensure target level is not less than current level
    if (targetLevel < value) {
      setTargetLevel(value);
    }
  };

  // Handle target level change
  const handleTargetLevelChange = (value: number) => {
    setTargetLevel(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <Calculator className="w-8 h-8 text-[#FCEE21]" />
        <h1 className="text-3xl font-bold uppercase">
          <span className="bg-[#FCEE21] px-1">RESOURCE</span> PLANNER
        </h1>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Control Panel */}
        <div className="lg:col-span-1">
          {/* Character Selection */}
          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#FCEE21]" />
              Select Character
            </h2>
            
            {/* Avatar List */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {MOCK_CHARACTERS.map((character) => (
                <div
                  key={character.id}
                  className={`flex flex-col items-center cursor-pointer transition-all ${selectedCharacter.id === character.id ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className={`w-16 h-16 rounded-full border-2 ${selectedCharacter.id === character.id ? 'border-[#FCEE21]' : 'border-zinc-200'} overflow-hidden mb-2`}>
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium">{character.name}</p>
                  <p className="text-xs text-zinc-500">{character.element}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Level Sliders */}
          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[#FCEE21]" />
              Level Progression
            </h2>

            {/* Current Level */}
            <div className="mb-6">
              <Slider
                label="Current Level"
                value={currentLevel}
                min={1}
                max={80}
                onChange={handleCurrentLevelChange}
              />
            </div>

            {/* Target Level */}
            <div>
              <Slider
                label="Target Level"
                value={targetLevel}
                min={currentLevel}
                max={80}
                onChange={handleTargetLevelChange}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Bill of Materials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Resource Requirements</h2>
            <Button
              variant="outline"
              className="border-2 border-zinc-200 rounded-none font-bold"
            >
              Save Plan
            </Button>
          </div>

          {/* Cost Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Digi-Cash */}
            <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-6 h-6 text-[#FCEE21]" />
                <h3 className="text-sm font-medium">Digi-Cash</h3>
              </div>
              <div className="text-4xl font-bold">{cost.digiCash.toLocaleString()}</div>
            </div>

            {/* Exp Records */}
            <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-[#FCEE21]" />
                <h3 className="text-sm font-medium">Exp Records</h3>
              </div>
              <div className="text-4xl font-bold">{cost.expRecords.toLocaleString()}</div>
            </div>
          </div>

          {/* Material List */}
          <div className="border border-zinc-200 bg-white rounded-none shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Breakthrough Materials</h3>
            <div className="space-y-4">
              {cost.materials.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{item.material.icon}</div>
                    <div>
                      <p className="font-medium">{item.material.name}</p>
                      <p className="text-xs text-zinc-500">Rarity: {'⭐'.repeat(item.material.rarity)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold">{item.quantity}</div>
                    <Button
                      variant="outline"
                      className="border-2 border-zinc-200 rounded-none"
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {cost.materials.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <p>No materials required for this upgrade</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="border border-zinc-200 bg-zinc-50 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Summary</h3>
                <p className="text-sm text-zinc-600">Upgrading {selectedCharacter.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-600">From Level {currentLevel}</p>
                <p className="text-sm font-medium">To Level {targetLevel}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Ad - Desktop only */}
          <AdUnit type="sidebar" className="hidden lg:block" />

          {/* Banner Ad - Mobile only */}
          <AdUnit type="banner" className="lg:hidden" />
        </div>
      </div>
    </div>
  );
}