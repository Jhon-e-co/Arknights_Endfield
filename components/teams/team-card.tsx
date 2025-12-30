"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DBCharacter {
  id: string;
  name: string;
  element: string;
  rarity: number;
  image_url: string;
}

interface TeamCardProps {
  squad: {
    id: string;
    title: string;
    description?: string;
    members: DBCharacter[];
    likes: number;
    profiles?: {
      username: string;
      avatar_url: string;
    };
    author?: string;
    tags?: string[];
  };
}

const elementColors = {
  heat: 'from-orange-600 to-red-700',
  cryo: 'from-cyan-500 to-blue-600',
  electric: 'from-yellow-400 to-amber-500',
  physical: 'from-zinc-500 to-zinc-700',
  nature: 'from-green-500 to-emerald-600'
};

export function TeamCard({ squad }: TeamCardProps) {
  const members = squad.members || [];
  const authorName = squad.profiles?.username || squad.author || 'Unknown';

  const handleLike = () => {
    console.log('Liking squad:', squad.id);
  };

  const getCharacterImage = (character: any) => {
    if (!character || typeof character !== 'object' || !character.name) {
      return '/images/avatars/default.png';
    }
    return character.image_url || `/characters/${character.name.replace(/\s+/g, '_')}.webp`;
  };

  return (
    <div className="group relative w-full aspect-[2.4/1] overflow-hidden bg-zinc-900 rounded-lg">
      <div className="absolute inset-0 grid grid-cols-4">
        {members.slice(0, 4).map((character, index) => {
          if (!character || typeof character !== 'object' || !character.name) {
            return null;
          }
          return (
            <div key={character.id} className="relative h-full w-full">
              <Image
                src={getCharacterImage(character)}
                alt={character.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />

      <div className="absolute top-4 left-4 z-20">
        <div className="flex flex-wrap gap-2">
          {(squad.tags || []).slice(0, 3).map((tag, index) => (
            <Badge key={index} className="rounded-none bg-black/70 text-white border-zinc-600 backdrop-blur-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-black text-white mb-1 group-hover:text-[#FCEE21] transition-colors">
              {squad.title}
            </h3>
            <p className="text-sm text-zinc-400 mb-3">
              by <span className="text-zinc-300">{authorName}</span>
            </p>
            <div className="flex items-center gap-2">
              {members.slice(0, 4).map((character, index) => {
                if (!character || typeof character !== 'object' || !character.name || !character.element) {
                  return null;
                }
                const elementKey = character.element.toLowerCase();
                const colorClass = elementColors[elementKey as keyof typeof elementColors] || 'from-zinc-500 to-zinc-700';
                return (
                  <div
                    key={character.id}
                    className={`w-8 h-8 rounded bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}
                    title={character.name}
                  >
                    <Image
                      src={`/images/elements/${elementKey}.webp`}
                      alt={character.element}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
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
      </div>
    </div>
  );
}
