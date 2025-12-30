"use client";

import React from 'react';
import Image from 'next/image';
import { Character, getCharacterAvatar } from '@/lib/mock-data';

interface CharacterAvatarProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const elementColors = {
  heat: 'border-orange-500',
  cryo: 'border-cyan-400',
  electric: 'border-yellow-400',
  physical: 'border-zinc-400',
  nature: 'border-green-500'
};

const elementBgColors = {
  heat: 'bg-orange-500',
  cryo: 'bg-cyan-400',
  electric: 'bg-yellow-400',
  physical: 'bg-zinc-400',
  nature: 'bg-green-500'
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20'
};

export function CharacterAvatar({ character, size = 'md', showName = false }: CharacterAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${sizeClasses[size]} border-2 ${elementColors[character.element]} bg-zinc-900 overflow-hidden`}>
        <Image
          src={getCharacterAvatar(character)}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 48px, 64px"
          unoptimized
        />
        <div className={`absolute bottom-0 left-0 right-0 ${elementBgColors[character.element]} flex items-center justify-center py-0.5`}>
          <Image
            src={`/images/elements/${character.element}.webp`}
            alt={character.element}
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </div>
      </div>
      {showName && (
        <span className="text-xs font-medium text-zinc-700 truncate max-w-[80px]">
          {character.name}
        </span>
      )}
    </div>
  );
}
