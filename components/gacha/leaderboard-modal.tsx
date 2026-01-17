'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { mockLeaderboardData, LeaderboardEntry } from '@/lib/gacha/mock-leaderboard';
import Image from 'next/image';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PullPreview({ pullData, rank }: { pullData: LeaderboardEntry['pullData']; rank: number }) {
  const sixStarCount = pullData.filter((c) => c.rarity === 6).length;
  const fiveStarCount = pullData.filter((c) => c.rarity === 5).length;

  return (
    <div className="flex gap-1 p-2 bg-zinc-50 rounded-sm">
      {pullData.slice(0, 10).map((character, index) => {
        const isSixStar = character.rarity === 6;
        const isFiveStar = character.rarity === 5;
        
        return (
          <div
            key={`${character.id}-${index}`}
            className={`relative w-8 h-8 rounded-sm overflow-hidden flex-shrink-0 ${
              isSixStar ? 'border-2 border-red-500 shadow-[0_0_8px_rgba(255,68,0,0.4)]' : 
              isFiveStar ? 'border-2 border-[#FCEE21]' : 
              'border border-zinc-200'
            }`}
          >
            <Image
              src={character.image}
              alt={character.name}
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-zinc-900 max-w-2xl w-full rounded-none shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FCEE21]" />
                  <h2 className="text-lg font-bold">Lucky Leaderboard</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-200 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-100 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-3">User</div>
                  <div className="col-span-8">Pull Results</div>
                </div>

                <div className="divide-y divide-zinc-100">
                  {mockLeaderboardData.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#FCEE21]/10 transition-colors"
                    >
                      <div className="col-span-1 flex items-center">
                        <div className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                          entry.rank === 1 ? 'bg-[#FCEE21] text-black' :
                          entry.rank === 2 ? 'bg-zinc-300 text-black' :
                          entry.rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-zinc-100 text-zinc-600'
                        }`}>
                          {entry.rank}
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center">
                        <div>
                          <div className="font-semibold text-sm">{entry.username}</div>
                          <div className="text-xs text-zinc-500">
                            {Math.floor((Date.now() - entry.timestamp.getTime()) / 60000)}m ago
                          </div>
                        </div>
                      </div>

                      <div className="col-span-8 flex items-center">
                        <PullPreview pullData={entry.pullData} rank={entry.rank} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}