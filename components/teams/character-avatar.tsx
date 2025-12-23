"use client";

import React from 'react';
import Image from 'next/image';
import { Character } from '@/lib/mock-data';

interface CharacterAvatarProps {
  character: Character;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const elementColors = {
  fire: 'border-orange-500',
  ice: 'border-cyan-400',
  electric: 'border-yellow-400',
  physical: 'border-zinc-400',
  ether: 'border-purple-500'
};

const elementBgColors = {
  fire: 'bg-orange-500',
  ice: 'bg-cyan-400',
  electric: 'bg-yellow-400',
  physical: 'bg-zinc-400',
  ether: 'bg-purple-500'
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
          src={character.avatar}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 48px, 64px"
          unoptimized
        />
        <div className={`absolute bottom-0 left-0 right-0 ${elementBgColors[character.element]} text-white text-[10px] font-bold text-center py-0.5`}>
          {character.element.toUpperCase()}
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
