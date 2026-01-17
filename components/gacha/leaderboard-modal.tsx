'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Character {
  id: string;
  name: string;
  rarity: number;
  element: string;
  type: string;
  image: string;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  score: number;
  rank: number;
  weekStart?: string;
  bestPull?: any;
  totalPulls?: number;
  total6Star?: number;
  total5Star?: number;
  total4Star?: number;
  best6StarPity?: number | null;
  avg6StarPity?: number | null;
  lastPullAt?: string | null;
  createdAt?: string;
}

function PullPreview({ pullData, rank }: { pullData: any; rank: number }) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  if (!pullData) {
    return <div className="text-xs text-zinc-400">No pull data</div>;
  }

  const rawData = Array.isArray(pullData) ? pullData : pullData.characters || [];

  if (!Array.isArray(rawData) || rawData.length === 0) {
    return <div className="text-xs text-zinc-400">No characters</div>;
  }

  const characters = rawData.map((item: any) => {
    if (item.character) return item.character;
    return item;
  });

  const handleImageError = (characterId: string) => {
    setImageErrors(prev => new Set(prev).add(characterId));
  };

  const getCharacterImage = (character: Character) => {
    const imagePath = character.image;
    
    if (!imagePath) {
      return '/images/characters/placeholder.webp';
    }
    
    return imagePath;
  };

  const getRarityStyles = (rarity: number) => {
    switch (rarity) {
      case 6:
        return {
          size: 'w-12 h-12',
          bg: 'bg-red-500/10',
          border: 'border-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]',
          badge: 'bg-red-500 text-white',
          badgeText: '6★'
        };
      case 5:
        return {
          size: 'w-10 h-10',
          bg: 'bg-yellow-400/10',
          border: 'border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]',
          badge: 'bg-yellow-400 text-black',
          badgeText: '5★'
        };
      case 4:
        return {
          size: 'w-10 h-10',
          bg: 'bg-purple-500/10',
          border: 'border-2 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]',
          badge: 'bg-purple-500 text-white',
          badgeText: '4★'
        };
      default:
        return {
          size: 'w-10 h-10',
          bg: 'bg-zinc-100',
          border: 'border border-zinc-200',
          badge: 'bg-zinc-400 text-white',
          badgeText: `${rarity}★`
        };
    }
  };

  return (
    <div className="flex gap-2 p-2 bg-zinc-50 rounded-lg flex-wrap">
      {characters.slice(0, 10).map((character: Character, index: number) => {
        const styles = getRarityStyles(character.rarity);
        const hasImageError = imageErrors.has(character.id);
        
        return (
          <div
            key={`${character.id}-${index}`}
            className={`relative overflow-hidden flex-shrink-0 rounded-lg ${styles.size} ${styles.bg} ${styles.border}`}
          >
            {!hasImageError ? (
              <Image
                src={getCharacterImage(character)}
                alt={character.name || 'Character'}
                fill
                className="object-cover"
                sizes={styles.size === 'w-12 h-12' ? "48px" : "40px"}
                priority={rank <= 3 && index < 3}
                placeholder="empty"
                onError={() => handleImageError(character.id)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-200">
                <span className="text-xs text-zinc-500">?</span>
              </div>
            )}
            <div className={`absolute bottom-0 right-0 px-1.5 py-0.5 text-[10px] font-bold rounded-tl-lg ${styles.badge}`}>
              {styles.badgeText}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [leaderboardType, setLeaderboardType] = useState<'weekly' | 'alltime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (type: 'weekly' | 'alltime') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gacha/leaderboard?type=${type}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch leaderboard');
      }

      const { data } = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard(leaderboardType);
    }
  }, [isOpen, leaderboardType]);

  const handleRefresh = () => {
    fetchLeaderboard(leaderboardType);
  };

  const handleTypeChange = (type: 'weekly' | 'alltime') => {
    setLeaderboardType(type);
  };

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
              className="bg-white text-zinc-900 max-w-6xl max-w-[95vw] w-full rounded-none shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FCEE21]" />
                  <h2 className="text-lg font-bold">Lucky Leaderboard</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="p-1 hover:bg-zinc-200 rounded transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-5 h-5 text-zinc-600 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-zinc-200 rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 px-6 py-3 bg-zinc-100 border-b border-zinc-200">
                <button
                  onClick={() => handleTypeChange('weekly')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    leaderboardType === 'weekly'
                      ? 'bg-[#FCEE21] text-black'
                      : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => handleTypeChange('alltime')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    leaderboardType === 'alltime'
                      ? 'bg-[#FCEE21] text-black'
                      : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
                  }`}
                >
                  All Time
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {error ? (
                  <div className="flex items-center justify-center h-64 text-zinc-500">
                    <div className="text-center">
                      <p className="mb-2">{error}</p>
                      <button
                        onClick={handleRefresh}
                        className="text-[#FCEE21] hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin" />
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-zinc-500">
                    <p>No data available yet</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-100 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                      <div className="col-span-1">Rank</div>
                      <div className="col-span-3">User</div>
                      <div className="col-span-8">Pull Results</div>
                    </div>

                    <div className="divide-y divide-zinc-100">
                      {leaderboardData.map((entry) => (
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

                          <div className="col-span-3 flex items-center gap-3">
                            <div className="relative w-8 h-8">
                              <Image
                                src={entry.avatarUrl || '/images/avatars/default.webp'}
                                alt={entry.username}
                                width={32}
                                height={32}
                                sizes="32px"
                                priority={entry.rank <= 3}
                                placeholder="empty"
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/avatars/default.webp';
                                }}
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{entry.username}</div>
                              <div className="text-xs text-zinc-500">
                                Score: {entry.score}
                              </div>
                            </div>
                          </div>

                          <div className="col-span-8 flex items-center">
                            <PullPreview pullData={entry.bestPull} rank={entry.rank} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
