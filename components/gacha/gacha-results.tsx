'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGachaStore } from '@/app/tools/recruitment/use-gacha-store';
import { RARITY_COLORS, Character } from '@/lib/gacha/data';
import { X, Share2 } from 'lucide-react';
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

export default function GachaResults() {
  const { lastResults, clearLastResults, setAnimating } = useGachaStore();

  useEffect(() => {
    if (lastResults && lastResults.length > 0) {
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

  const handleClose = () => {
    clearLastResults();
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
            <CharacterCard
              key={`${result.character.id}-${index}`}
              character={result.character}
              index={index}
            />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-8 py-3 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors border border-zinc-300"
          >
            Continue
          </button>
          <button
            onClick={() => {
              alert('Share feature coming soon!');
            }}
            className="flex items-center gap-2 px-8 py-3 bg-[#FCEE21] text-black rounded-lg hover:bg-[#E5D81C] transition-colors font-bold shadow-md"
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
        </div>
      </motion.div>
    </div>
  );
}
