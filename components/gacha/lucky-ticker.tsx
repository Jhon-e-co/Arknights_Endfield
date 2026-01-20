'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp } from 'lucide-react';

interface LuckyTickerProps {
  onViewLeaderboard?: () => void;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  score: number;
  rank: number;
  bestPull?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function LuckyTicker({ onViewLeaderboard }: LuckyTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/gacha/leaderboard?type=weekly');
        if (response.ok) {
          const { data } = await response.json();
          setLeaderboardData(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (leaderboardData.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % leaderboardData.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [leaderboardData.length]);

  const currentEntry = leaderboardData[currentIndex];
  const sixStarCount = currentEntry?.bestPull?.characters?.filter((c: any) => c.rarity === 6).length || 0; // eslint-disable-line @typescript-eslint/no-explicit-any

  const hasData = leaderboardData.length > 0 && currentEntry;

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
            {hasData ? (
              <>
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
              </>
            ) : (
              <div className="flex-1 min-w-0">
                <div className="text-zinc-900 font-semibold text-sm">
                  No recent records...
                </div>
                <div className="text-zinc-500 text-xs">
                  Be the first to make history!
                </div>
              </div>
            )}

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
