"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Heart, Eye, Flame, Snowflake, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSquadById, getCharactersByIds, Character } from '@/lib/mock-data';
import { motion } from 'framer-motion';

const elementIcons = {
  fire: Flame,
  ice: Snowflake,
  electric: Zap,
  physical: Shield,
  ether: Sparkles
};

const elementColors = {
  fire: 'from-orange-600 to-red-700',
  ice: 'from-cyan-500 to-blue-600',
  electric: 'from-yellow-400 to-amber-500',
  physical: 'from-zinc-500 to-zinc-700',
  ether: 'from-purple-500 to-violet-700'
};

export default function SquadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const squad = getSquadById(params.id);
  const characters = squad ? getCharactersByIds(squad.characterIds) : [];

  if (!squad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Squad Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-2 border-zinc-200 rounded-none mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="border border-zinc-700 bg-zinc-900 rounded-none shadow-lg overflow-hidden">
          <div className="p-6 mb-8">
            <h1 className="text-4xl font-black text-white mb-3 uppercase tracking-tight">
              {squad.title}
            </h1>
            <p className="text-zinc-400 mb-6 text-lg">by <span className="text-zinc-300 font-semibold">{squad.author}</span></p>

            <div className="flex flex-wrap gap-3 mb-4">
              {squad.tags.map((tag, index) => (
                <Badge key={index} className="rounded-none bg-zinc-700 text-zinc-300 border-zinc-600 px-4 py-1.5 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="px-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-[#FCEE21]"></span>
              TEAM LINEUP
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {characters.map((character, index) => {
                const ElementIcon = elementIcons[character.element];
                const colorClass = elementColors[character.element];
                return (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative aspect-[2/3] bg-zinc-900 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={character.artwork}
                      alt={character.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                          <ElementIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-center text-lg">{character.name}</h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="px-6 mb-8">
            <div className="w-full bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 rounded-lg relative">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-mono text-zinc-500 border border-zinc-700 px-2 py-1 rounded">
                  [ TACTICAL_GUIDE_V1.0 ]
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-[#FCEE21]"></span>
                TACTICAL GUIDE
              </h2>
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p className="text-lg">{squad.description}</p>
                <p>
                  This squad composition is designed for maximum efficiency in combat scenarios. 
                  The combination of elements provides excellent coverage against various enemy types, 
                  while the character synergies allow for powerful combo chains.
                </p>
                <p>
                  <strong className="text-white">Key Strategies:</strong> Focus on timing your abilities 
                  to maximize elemental reactions. The primary damage dealer should be positioned 
                  to take advantage of crowd control effects from support characters.
                </p>
                <p>
                  <strong className="text-white">Recommended Gear:</strong> Prioritize equipment that 
                  enhances elemental damage and cooldown reduction. This setup works best with 
                  balanced defensive and offensive stats.
                </p>
                <p>
                  <strong className="text-white">Team Synergy:</strong> The current configuration 
                  allows for seamless rotation between characters. Each member fills a specific 
                  role within the team composition, creating a well-rounded tactical unit.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >
                <Heart className="w-4 h-4 mr-2" />
                {squad.likes} Likes
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
