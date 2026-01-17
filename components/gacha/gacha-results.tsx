'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/app/tools/recruitment/use-gacha-store';
import { RARITY_COLORS, Character } from '@/lib/gacha/data';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

interface GachaResultsProps {
  onReturnToBanner: () => void;
}

interface MysteryCardProps {
  rarity: number;
  index: number;
}

function MysteryCard({ rarity, index }: MysteryCardProps) {
  const color = RARITY_COLORS[rarity];
  const isSixStar = rarity === 6;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.03,
        ease: 'easeOut'
      }}
      className={`relative h-full aspect-[9/20] rounded-sm overflow-hidden ${
        isSixStar ? 'shadow-[0_0_20px_rgba(255,68,0,0.5)]' : 'shadow-sm'
      }`}
      style={{ 
        backgroundColor: color,
        boxShadow: isSixStar ? `0 0 30px ${color}60, 0 0 60px ${color}30` : undefined
      }}
    >
      {isSixStar && (
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
        />
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={isSixStar ? {
            scale: [1, 1.15, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-center"
        >
          <Sparkles className={`w-8 h-8 mx-auto mb-1 ${isSixStar ? 'text-white' : 'text-white/70'}`} />
          <div className="text-white/90 font-bold text-sm">?</div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/20 backdrop-blur-sm">
        <div className="text-white/90 font-bold text-xs text-center">
          {'★'.repeat(rarity)}
        </div>
      </div>
    </motion.div>
  );
}

interface RevealedCardProps {
  character: Character;
  index: number;
}

function RevealedCard({ character, index }: RevealedCardProps) {
  const color = RARITY_COLORS[character.rarity];
  const isSixStar = character.rarity === 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      className={`relative h-full aspect-[9/20] rounded-sm overflow-hidden ${
        isSixStar ? 'shadow-[0_0_20px_rgba(255,68,0,0.5)]' : 'shadow-sm'
      }`}
      style={{ borderColor: color }}
    >
      <div className="relative h-full">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 300px) 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 backdrop-blur-sm">
        <div className="text-white/90 font-bold text-xs text-center truncate">
          {character.name}
        </div>
      </div>
    </motion.div>
  );
}

export default function GachaResults({ onReturnToBanner }: GachaResultsProps) {
  const { lastResults, clearLastResults, setAnimating } = useGachaStore();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (lastResults && lastResults.length > 0) {
      setIsRevealed(false);
      const duration = lastResults.length * 50 + 500;
      const timer = setTimeout(() => {
        setAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [lastResults, setAnimating]);

  if (!lastResults || lastResults.length === 0) {
    return null;
  }

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleDone = () => {
    clearLastResults();
    onReturnToBanner();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-full flex gap-1 px-2">
          {lastResults.map((result, index) => (
            <AnimatePresence key={`${result.character.id}-${index}`} mode="wait">
              {!isRevealed ? (
                <MysteryCard
                  rarity={result.character.rarity}
                  index={index}
                />
              ) : (
                <RevealedCard
                  character={result.character}
                  index={index}
                />
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 py-6 border-t border-zinc-200">
        {!isRevealed ? (
          <button
            onClick={handleReveal}
            className="flex items-center gap-2 px-12 py-4 bg-[#FCEE21] text-black rounded-lg hover:bg-[#E5D81C] transition-colors font-bold shadow-md text-lg"
          >
            REVEAL
          </button>
        ) : (
          <button
            onClick={handleDone}
            className="flex items-center gap-2 px-12 py-4 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-bold shadow-md text-lg"
          >
            DONE
          </button>
        )}
      </div>
    </motion.div>
  );
}