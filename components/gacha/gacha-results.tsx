'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/app/calculator/use-gacha-store';
import { RARITY_COLORS } from '@/lib/gacha/data';
import { X, Share2, SkipForward } from 'lucide-react';

interface CharacterCardProps {
  character: any;
  index: number;
  total: number;
}

function CharacterCard({ character, index, total }: CharacterCardProps) {
  const color = RARITY_COLORS[character.rarity];
  const stars = '★'.repeat(character.rarity);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: 'easeOut'
      }}
      className="relative group"
    >
      <div
        className="relative bg-zinc-800 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105"
        style={{ borderColor: color }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />

        <img
          src={`https://placehold.co/300x400/1a1a1a/${color.replace('#', '')}?text=${character.name}`}
          alt={character.name}
          className="w-full aspect-[3/4] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="text-[#FCEE21] text-xs font-bold mb-1">{stars}</div>
          <h3 className="text-white font-bold text-sm leading-tight">{character.name}</h3>
        </div>

        {character.rarity >= 5 && (
          <div
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function GachaResults() {
  const { lastResults, clearLastResults, setAnimating } = useGachaStore();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (lastResults && lastResults.length > 0) {
      setShowResults(true);
      const duration = lastResults.length * 80 + 500;
      const timer = setTimeout(() => {
        setAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [lastResults, setAnimating]);

  if (!lastResults || lastResults.length === 0 || !showResults) {
    return null;
  }

  const isTenPull = lastResults.length === 10;
  const hasSixStar = lastResults.some((r) => r.character.rarity === 6);
  const hasFiveStar = lastResults.some((r) => r.character.rarity === 5);

  const handleClose = () => {
    setShowResults(false);
    clearLastResults();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative bg-zinc-900 border-2 border-zinc-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1">
            {hasSixStar && (
              <div className="h-full bg-gradient-to-r from-[#FF4400] via-[#FF6600] to-[#FF4400] animate-pulse" />
            )}
            {!hasSixStar && hasFiveStar && (
              <div className="h-full bg-gradient-to-r from-[#FCEE21] via-[#FFE066] to-[#FCEE21]" />
            )}
            {!hasSixStar && !hasFiveStar && (
              <div className="h-full bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#A855F7]" />
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {isTenPull ? '10x Recruitment' : '1x Recruitment'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div
              className={`grid gap-4 ${
                isTenPull
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                  : 'grid-cols-1 max-w-sm mx-auto'
              }`}
            >
              {lastResults.map((result, index) => (
                <CharacterCard
                  key={`${result.character.id}-${index}`}
                  character={result.character}
                  index={index}
                  total={lastResults.length}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                <SkipForward className="w-5 h-5" />
                Skip
              </button>
              <button
                onClick={() => {
                  alert('Share feature coming soon!');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#FCEE21] text-black rounded-lg hover:bg-[#E5D81C] transition-colors font-bold"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
