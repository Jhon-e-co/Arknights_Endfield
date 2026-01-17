'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/app/tools/recruitment/use-gacha-store';
import { RARITY_COLORS, Character } from '@/lib/gacha/data';
import { X, Share2, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface CharacterCardProps {
  character: Character;
  index: number;
}

function CharacterCard({ character, index }: CharacterCardProps) {
  const color = RARITY_COLORS[character.rarity];
  const stars = '★'.repeat(character.rarity);
  const isSixStar = character.rarity === 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: 'easeOut'
      }}
      className={`relative bg-white border-2 rounded-lg overflow-hidden ${
        isSixStar ? 'shadow-[0_0_20px_rgba(255,68,0,0.5)]' : 'shadow-md'
      }`}
      style={{ borderColor: color }}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 300px) 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/60" />
      </div>

      <div className="p-3 bg-white">
        <div className="text-sm font-bold mb-1" style={{ color }}>
          {stars}
        </div>
        <h3 className="text-base font-bold text-zinc-900 leading-tight">
          {character.name}
        </h3>
      </div>
    </motion.div>
  );
}

interface MysteryCardProps {
  rarity: number;
  index: number;
  isRevealed: boolean;
  onReveal: () => void;
}

function MysteryCard({ rarity, index, isRevealed, onReveal }: MysteryCardProps) {
  const color = RARITY_COLORS[rarity];
  const isSixStar = rarity === 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      onClick={onReveal}
      className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSixStar ? 'shadow-[0_0_30px_rgba(255,68,0,0.6)]' : 'shadow-md'
      }`}
      style={{ 
        backgroundColor: color,
        boxShadow: isSixStar ? `0 0 40px ${color}80, 0 0 80px ${color}40` : undefined
      }}
    >
      {isSixStar && (
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"
        />
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={isSixStar ? {
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-center"
        >
          <Sparkles className={`w-16 h-16 mx-auto mb-2 ${isSixStar ? 'text-white' : 'text-white/80'}`} />
          <div className="text-white/90 font-bold text-lg">?</div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/20 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="text-white/90 font-bold text-sm">
            {'★'.repeat(rarity)}
          </div>
          <Eye className="w-4 h-4 text-white/70" />
        </div>
      </div>
    </motion.div>
  );
}

export default function GachaResults() {
  const { lastResults, clearLastResults, setAnimating } = useGachaStore();
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (lastResults && lastResults.length > 0) {
      setIsRevealed(false);
      setRevealedIndices(new Set());
      const duration = lastResults.length * 80 + 500;
      const timer = setTimeout(() => {
        setAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [lastResults, setAnimating]);

  if (!lastResults || lastResults.length === 0) {
    return null;
  }

  const isTenPull = lastResults.length === 10;
  const hasSixStar = lastResults.some((r) => r.character.rarity === 6);
  const hasFiveStar = lastResults.some((r) => r.character.rarity === 5);

  const handleRevealAll = () => {
    setIsRevealed(true);
    setRevealedIndices(new Set(lastResults.map((_, i) => i)));
  };

  const handleRevealSingle = (index: number) => {
    const newRevealed = new Set(revealedIndices);
    newRevealed.add(index);
    setRevealedIndices(newRevealed);
    
    if (newRevealed.size === lastResults.length) {
      setIsRevealed(true);
    }
  };

  const handleClose = () => {
    clearLastResults();
    setIsRevealed(false);
    setRevealedIndices(new Set());
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900">
            {isTenPull ? '10x Recruitment' : '1x Recruitment'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600" />
          </button>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {lastResults.map((result, index) => (
            <AnimatePresence key={`${result.character.id}-${index}`} mode="wait">
              {!isRevealed && !revealedIndices.has(index) ? (
                <MysteryCard
                  rarity={result.character.rarity}
                  index={index}
                  isRevealed={isRevealed}
                  onReveal={() => handleRevealSingle(index)}
                />
              ) : (
                <CharacterCard
                  character={result.character}
                  index={index}
                />
              )}
            </AnimatePresence>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-8 py-3 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors border border-zinc-300"
          >
            Continue
          </button>
          {!isRevealed && (
            <button
              onClick={handleRevealAll}
              className="flex items-center gap-2 px-8 py-3 bg-[#FCEE21] text-black rounded-lg hover:bg-[#E5D81C] transition-colors font-bold shadow-md"
            >
              <Eye className="w-5 h-5" />
              Reveal Results
            </button>
          )}
          {isRevealed && (
            <button
              onClick={() => {
                alert('Share feature coming soon!');
              }}
              className="flex items-center gap-2 px-8 py-3 bg-[#FCEE21] text-black rounded-lg hover:bg-[#E5D81C] transition-colors font-bold shadow-md"
            >
              <Share2 className="w-5 h-5" />
              Share Results
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
