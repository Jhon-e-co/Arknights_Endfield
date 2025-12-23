"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Flame, Snowflake, Zap, Shield, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Squad, getCharactersByIds } from '@/lib/mock-data';

interface TeamCardProps {
  squad: Squad;
}

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

export function TeamCard({ squad }: TeamCardProps) {
  const characters = getCharactersByIds(squad.characterIds);
  const [captain, ...members] = characters;
  const primaryElement = captain?.element || 'physical';
  const ElementIcon = elementIcons[primaryElement];

  const handleLike = () => {
    console.log('Liking squad:', squad.id);
  };

  return (
    <div className="w-full h-64 lg:h-80 relative rounded-lg overflow-hidden group">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <Image
          src={captain?.artwork || ''}
          alt="Background"
          fill
          className="object-cover blur-md opacity-30"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      {/* Gradient Overlay for Text Protection */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/40 to-transparent z-10" />

      {/* Members Background Layer */}
      <div className="absolute inset-y-0 left-[35%] right-0 flex items-end justify-start ml-24 pb-0 z-5">
        {members.map((character, index) => (
          <div
            key={character.id}
            className="relative h-[70%] w-auto transition-transform duration-300 group-hover:scale-105 opacity-60"
            style={{
              zIndex: members.length - index,
              marginLeft: index > 0 ? '-4rem' : '0'
            }}
          >
            <Image
              src={character.artwork}
              alt={character.name}
              width={250}
              height={350}
              className="h-full w-auto object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Captain Layer - C Position */}
      {captain && (
        <div className="absolute left-[22%] bottom-0 h-[110%] w-auto z-20 transition-transform duration-300 group-hover:scale-105">
          <Image
            src={captain.artwork}
            alt={captain.name}
            width={400}
            height={600}
            className="h-full w-auto object-contain drop-shadow-2xl"
            unoptimized
          />
        </div>
      )}

      {/* Info Overlay - Top Left */}
      <div className="absolute top-6 left-6 z-30">
        <div className="bg-black/70 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 max-w-md">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FCEE21] transition-colors">
            {squad.title}
          </h3>
          <p className="text-sm text-zinc-300">
            by <span className="text-zinc-400">{squad.author}</span>
          </p>
        </div>
      </div>

      {/* Element Icons - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-30">
        <div className="flex items-center gap-2">
          {characters.slice(0, 4).map((character, index) => {
            const Icon = elementIcons[character.element];
            const colorClass = elementColors[character.element];
            return (
              <div
                key={character.id}
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
                title={character.name}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags - Top Right */}
      <div className="absolute top-6 right-6 z-30">
        <div className="flex flex-wrap gap-2 justify-end">
          {squad.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} className="rounded-none bg-black/70 text-white border-zinc-600 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Buttons - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="rounded-none bg-black/70 text-white border-zinc-600 backdrop-blur-sm hover:bg-zinc-800"
          onClick={handleLike}
        >
          <Heart className="w-4 h-4 mr-2" fill="none" strokeWidth={2} />
          {squad.likes}
        </Button>
        <Link href={`/teams/${squad.id}`}>
          <Button className="rounded-none bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 font-bold px-6 py-2">
            View Squad
          </Button>
        </Link>
      </div>
    </div>
  );
}
