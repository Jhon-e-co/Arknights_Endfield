'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore } from '@/app/[locale]/headhunt/use-gacha-store';
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
  const isFourStar = rarity === 4;
  const isFiveStar = rarity === 5;
  const isSixStar = rarity === 6;

  const getGradientClass = () => {
    if (isFourStar) {
      return 'bg-gradient-to-t from-purple-900 via-purple-600 to-purple-400';
    }
    if (isFiveStar) {
      return 'bg-gradient-to-t from-yellow-800 via-yellow-500 to-[#FCEE21]';
    }
    return 'bg-gradient-to-t from-red-900 via-[#FF4400] to-red-500';
  };

  const getShadowClass = () => {
    if (isFourStar) {
      return 'shadow-[inset_0_0_20px_rgba(168,85,247,0.5)]';
    }
    if (isFiveStar) {
      return 'shadow-[inset_0_0_30px_rgba(252,238,33,0.6)]';
    }
    return 'shadow-[0_0_40px_rgba(255,68,0,0.8)] animate-pulse z-10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.02,
        ease: 'easeOut'
      }}
      className={`relative h-full rounded-md overflow-hidden ${getGradientClass()} ${getShadowClass()}`}
    >
      {isSixStar && (
        <>
          <motion.div
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,68,0,0.4)_0%,transparent_70%)]"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_60%)]"
          />
        </>
      )}
      
      {isFiveStar && (
        <motion.div
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,238,33,0.3)_0%,transparent_70%)]"
        />
      )}

      {isFourStar && (
        <motion.div
          animate={{
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25)_0%,transparent_70%)]"
        />
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={isSixStar ? {
            scale: [1, 1.3, 1],
            rotate: [0, 5, -5, 0],
          } : isFiveStar ? {
            scale: [1, 1.15, 1],
          } : {}}
          transition={{
            duration: isSixStar ? 1.5 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-center"
        >
          <Sparkles className={`w-6 h-6 mx-auto mb-1 ${isSixStar ? 'text-white' : isFiveStar ? 'text-white/90' : 'text-white/70'}`} />
          <div className="text-white/90 font-bold text-xs">?</div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/30 backdrop-blur-sm">
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
  const isFourStar = character.rarity === 4;
  const isFiveStar = character.rarity === 5;
  const isSixStar = character.rarity === 6;

  const getBackgroundGradient = () => {
    if (isFourStar) {
      return 'bg-gradient-to-t from-purple-950/90 via-purple-900/50 to-transparent';
    }
    if (isFiveStar) {
      return 'bg-gradient-to-t from-yellow-950/90 via-yellow-900/50 to-transparent';
    }
    return 'bg-gradient-to-t from-red-950/90 via-red-900/50 to-transparent';
  };

  const getShadowClass = () => {
    if (isSixStar) {
      return 'shadow-[0_0_20px_rgba(255,68,0,0.5)]';
    }
    return 'shadow-sm';
  };

  const getAccentColor = () => {
    if (isFourStar) return 'bg-purple-500';
    if (isFiveStar) return 'bg-[#FCEE21]';
    return 'bg-[#FF4400]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.04,
        ease: 'easeOut'
      }}
      className={`relative h-full rounded-md overflow-hidden ${getShadowClass()}`}
    >
      <div className={`relative h-full ${getBackgroundGradient()}`}>
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 300px) 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className={`h-1 ${getAccentColor()}`} />
        <div className="p-1 bg-black/80 backdrop-blur-sm">
          <div className="text-white/90 font-bold text-[10px] text-center truncate">
            {character.name}
          </div>
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