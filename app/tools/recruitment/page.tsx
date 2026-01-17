'use client';

import { useState, useEffect } from 'react';
import { Calculator, Sparkles, History, Trash2 } from 'lucide-react';
import BannerDisplay from '@/components/gacha/banner-display';
import GachaResults from '@/components/gacha/gacha-results';
import { useGachaStore } from '@/app/tools/recruitment/use-gacha-store';
import { RARITY_COLORS } from '@/lib/gacha/data';

export default function RecruitmentPage() {
  const { history, totalPulls, inventory, resetHistory } = useGachaStore();
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const sixStarCount = history.filter((r) => r.character.rarity === 6).length;
  const fiveStarCount = history.filter((r) => r.character.rarity === 5).length;
  const fourStarCount = history.filter((r) => r.character.rarity === 4).length;

  const averagePity6 = sixStarCount > 0 
    ? (totalPulls / sixStarCount).toFixed(1) 
    : 'N/A';

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all recruitment history? This cannot be undone.')) {
      resetHistory();
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Calculator className="w-8 h-8 text-[#FCEE21]" />
          <h1 className="text-3xl font-bold uppercase">
            <span className="bg-[#FCEE21] px-1 text-black">TOOLS</span> HUB
          </h1>
        </div>

        <div className="flex gap-4 mb-8 border-b-2 border-zinc-200 pb-4">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'simulator'
                ? 'bg-[#FCEE21] text-black font-bold'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Recruitment Simulator
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-[#FCEE21] text-black font-bold'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <History className="w-5 h-5" />
            History & Stats
          </button>
        </div>

        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <BannerDisplay />
            <GachaResults />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-zinc-500 text-sm mb-1">Total Pulls</div>
                <div className="text-3xl font-bold text-zinc-900">{totalPulls}</div>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-[#FF4400] text-sm mb-1">6★ Count</div>
                <div className="text-3xl font-bold text-[#FF4400]">{sixStarCount}</div>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-[#FCEE21] text-sm mb-1">5★ Count</div>
                <div className="text-3xl font-bold text-[#FCEE21]">{fiveStarCount}</div>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-[#A855F7] text-sm mb-1">4★ Count</div>
                <div className="text-3xl font-bold text-[#A855F7]">{fourStarCount}</div>
              </div>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FCEE21]" />
                Luck Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-zinc-500 text-sm mb-1">Average 6★ Pity</div>
                  <div className="text-2xl font-bold text-[#FF4400]">{averagePity6}</div>
                  <div className="text-xs text-zinc-400 mt-1">Lower is better</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-sm mb-1">6★ Rate</div>
                  <div className="text-2xl font-bold text-[#FF4400]">
                    {totalPulls > 0 ? ((sixStarCount / totalPulls) * 100).toFixed(2) : '0.00'}%
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">Expected: 0.8%</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Inventory</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(inventory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([charId, count]) => {
                    const char = history.find((r) => r.character.id === charId)?.character;
                    if (!char) return null;
                    const color = RARITY_COLORS[char.rarity];
                    return (
                      <div
                        key={charId}
                        className="bg-white border-2 rounded-lg p-3 text-center"
                        style={{ borderColor: color }}
                      >
                        <div className="text-lg font-bold mb-1 text-zinc-900">{char.name}</div>
                        <div className="text-xs text-zinc-400">x{count}</div>
                        <div className="text-xs mt-1" style={{ color }}>
                          {'★'.repeat(char.rarity)}
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(inventory).length === 0 && (
                  <div className="col-span-full text-center py-8 text-zinc-400">
                    <p>No characters recruited yet</p>
                  </div>
                )}
              </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Reset All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
