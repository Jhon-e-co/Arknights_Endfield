'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/app/tools/recruitment/use-gacha-store';
import { RARITY_COLORS, Character } from '@/lib/gacha/data';
import { Sparkles, ArrowLeft } from 'lucide-react';
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
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.02,
        ease: 'easeOut'
      }}
      className={`relative h-full rounded-sm overflow-hidden ${
        isSixStar ? 'shadow-[0_0_30px_rgba(255,68,0,0.6)] animate-pulse' : 'shadow-sm'
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
          }}
          transition={{
            duration: 1.5,
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
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-center"
        >
          <Sparkles className={`w-6 h-6 mx-auto mb-1 ${isSixStar ? 'text-white' : 'text-white/70'}`} />
          <div className="text-white/90 font-bold text-xs">?</div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/20 backdrop-blur-sm">
        <div className="text-white/90 font-bold text-[10px] text-center">
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.04,
        ease: 'easeOut'
      }}
      className={`relative h-full rounded-sm overflow-hidden ${
        isSixStar ? 'shadow-[0_0_20px_rgba(255,68,0,0.5)]' : 'shadow-sm'
      }`}
    >
      <div className="relative h-full">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 300px) 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/50 backdrop-blur-sm">
        <div className="text-white/90 font-bold text-[10px] text-center truncate">
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
      const duration = lastResults.length * 40 + 500;
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

  const handleBack = () => {
    clearLastResults();
    onReturnToBanner();
  };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full h-full grid grid-cols-10 gap-1">
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

      <div className="flex justify-center items-center py-4 px-4 border-t border-zinc-200 bg-white">
        {!isRevealed ? (
          <button
            onClick={handleReveal}
            className="flex items-center gap-2 px-16 py-3 bg-[#FCEE21] text-black rounded-lg hover:bg-[#E5D81C] transition-colors font-bold shadow-md text-base"
          >
            REVEAL
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-8 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors font-medium text-sm border border-zinc-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Banner
          </button>
        )}
      </div>
    </div>
  );
}