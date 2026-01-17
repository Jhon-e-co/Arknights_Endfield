'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';
import { mockLeaderboardData, LeaderboardEntry } from '@/lib/gacha/mock-leaderboard';

interface LuckyTickerProps {
  onViewLeaderboard?: () => void;
}

export default function LuckyTicker({ onViewLeaderboard }: LuckyTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mockLeaderboardData.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentEntry = mockLeaderboardData[currentIndex];
  const sixStarCount = currentEntry.pullData.filter((c) => c.rarity === 6).length;

  return (
    <div className="bg-white border border-zinc-200 border-l-4 border-l-[#FCEE21] shadow-sm rounded-sm overflow-hidden">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3"
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
                <span className="text-zinc-900 font-bold text-sm">
                  #{currentEntry.rank}
                </span>
              </div>
              {currentEntry.rank === 1 && (
                <Trophy className="w-5 h-5 text-[#FCEE21]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-zinc-900 font-semibold text-sm truncate">
                  {currentEntry.username}
                </span>
                <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
              </div>
              <div className="text-zinc-500 text-xs">
                pulled {sixStarCount > 0 ? `${sixStarCount}x 6★` : 'rare operators'}!
              </div>
            </div>

            {onViewLeaderboard && (
              <button
                onClick={onViewLeaderboard}
                className="flex-shrink-0 text-[#FCEE21] hover:text-[#E5D81C] transition-colors font-semibold text-sm"
              >
                View →
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}