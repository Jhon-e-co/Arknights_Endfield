'use client';

import { useState, useEffect } from 'react';
import { Calculator, Sparkles, History, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import BannerDisplay from '@/components/gacha/banner-display';
import GachaResults from '@/components/gacha/gacha-results';
import { useGachaStore } from './use-gacha-store';
import { RARITY_COLORS } from '@/lib/gacha/data';
import { useTranslations } from "next-intl";

type ViewState = 'banner' | 'results';

export default function RecruitmentPageContent() {
  const t = useTranslations();
  const { history, totalPulls, inventory, resetHistory, lastResults, fetchStats, setHistory } = useGachaStore();
  const [activeTab, setActiveTab] = useState<'simulator' | 'history'>('simulator');
  const [viewState, setViewState] = useState<ViewState>('banner');
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  useEffect(() => {
    if (lastResults && lastResults.length > 0) {
      setViewState('results');
    }
  }, [lastResults]);

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!error && user) {
        setUser(user);
        await fetchHistoryFromServer();
        await fetchStats();
      }
    } catch (error) {
      console.error('Failed to check user:', error);
    }
  };

  const fetchHistoryFromServer = async () => {
    try {
      const response = await fetch('/api/gacha/history');
      if (response.ok) {
        const { data } = await response.json();
        if (data.history && data.history.length > 0) {
          setHistory(data.history, data.inventory);
        }
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {t('app.headhunt.page.loading')}
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

  const handleReturnToBanner = () => {
    setViewState('banner');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Calculator className="w-8 h-8 text-[#FCEE21]" />
          <h1 className="text-3xl font-bold uppercase">
            <span className="bg-[#FCEE21] px-1 text-black">{t('app.headhunt.page.h_e_a_d_h_u_n_t')}</span> {t('app.headhunt.page.s_i_m_u_l_a_t_o_r')}
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
            {t('app.headhunt.page.headhunt__simulator')}
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
            {t('app.headhunt.page.history__stats')}
          </button>
        </div>

        {activeTab === 'simulator' && (
          <div className="space-y-8">
            <div className="aspect-[21/9] w-full bg-white">
              {viewState === 'banner' ? (
                <BannerDisplay />
              ) : (
                <GachaResults onReturnToBanner={handleReturnToBanner} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-zinc-500 text-sm mb-1">{t('app.headhunt.page.total__pulls')}</div>
                <div className="text-3xl font-bold text-zinc-900">{totalPulls}</div>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-[#FF4400] text-sm mb-1">{t('app.headhunt.page.6__count')}</div>
                <div className="text-3xl font-bold text-[#FF4400]">{sixStarCount}</div>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-[#FCEE21] text-sm mb-1">{t('app.headhunt.page.5__count')}</div>
                <div className="text-3xl font-bold text-[#FCEE21]">{fiveStarCount}</div>
              </div>
              <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-4">
                <div className="text-[#A855F7] text-sm mb-1">{t('app.headhunt.page.4__count')}</div>
                <div className="text-3xl font-bold text-[#A855F7]">{fourStarCount}</div>
              </div>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FCEE21]" />
                {t('app.headhunt.page.luck__analysis')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-zinc-500 text-sm mb-1">{t('app.headhunt.page.average_6__pity')}</div>
                  <div className="text-2xl font-bold text-[#FF4400]">{averagePity6}</div>
                  <div className="text-xs text-zinc-400 mt-1">{t('app.headhunt.page.lower_is_better')}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-sm mb-1">{t('app.headhunt.page.6__rate')}</div>
                  <div className="text-2xl font-bold text-[#FF4400]">
                    {totalPulls > 0 ? ((sixStarCount / totalPulls) * 100).toFixed(2) : '0.00'}%
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">{t('app.headhunt.page.expected_0_8')}</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t('app.headhunt.page.inventory')}</h2>
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
                    <p>{t('app.headhunt.page.no_characters_recruited_yet')}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  {t('app.headhunt.page.reset__all__data')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
