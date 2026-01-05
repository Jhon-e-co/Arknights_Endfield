"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SquadActions } from '@/components/teams/squad-actions';
import { DeleteButton } from '@/components/common/delete-button';

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
    author_id?: string;
    tags?: string[];
    initialIsLiked?: boolean;
    initialIsCollected?: boolean;
  };
  currentUserId?: string;
  currentUserRole?: string;
}

const elementColors = {
  heat: 'from-orange-600 to-red-700',
  cryo: 'from-cyan-500 to-blue-600',
  electric: 'from-yellow-400 to-amber-500',
  physical: 'from-zinc-500 to-zinc-700',
  nature: 'from-green-500 to-emerald-600'
};

export function TeamCard({ squad, currentUserId, currentUserRole = 'user' }: TeamCardProps) {
  const members = squad.members || [];
  const authorName = squad.profiles?.username || squad.author || 'Unknown';
  const canDelete = squad.author_id === currentUserId || currentUserRole === 'admin';
  const initialIsLiked = squad.initialIsLiked || false;
  const initialIsCollected = squad.initialIsCollected || false;

  const getCharacterImage = (character: DBCharacter) => {
    if (!character || typeof character !== 'object' || !character.name) {
      return '/images/avatars/default.png';
    }
    return character.image_url || `/characters/${character.name.replace(/\s+/g, '_')}.webp`;
  };

  return (
    <div className="group relative w-full aspect-[2.4/1] overflow-hidden bg-zinc-900 rounded-lg shadow-md hover:shadow-xl transition-all">
      <Link href={`/teams/${squad.id}`} className="absolute inset-0 z-10" aria-label={`View ${squad.title}`}>
        <span className="sr-only">View Squad</span>
      </Link>

      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-4">
          {members.slice(0, 4).map((character) => {
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
        <div className="relative z-20 pointer-events-auto">
          <div className="flex flex-wrap gap-2 mb-2">
            {(squad.tags || []).slice(0, 3).map((tag) => (
              <Badge key={tag} className="rounded-none bg-black/70 text-white border-zinc-600 backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{squad.title}</h3>
          <div className="flex items-center gap-2 text-zinc-300 text-sm relative z-20 pointer-events-auto">
            <span>by</span>
            {squad.author_id ? (
              <Link 
                href={`/users/${squad.author_id}`} 
                className="hover:text-[#FCEE21] hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {authorName}
              </Link>
            ) : (
              <span>{authorName}</span>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex gap-1">
            {members.slice(0, 4).map((character) => {
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

          <div className="flex items-center gap-3 relative z-20 pointer-events-auto">
            {canDelete && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteButton id={squad.id} type="squad" />
              </div>
            )}
            <div className="bg-black/60 backdrop-blur-sm rounded-none border border-white/10 flex">
              <SquadActions
                squadId={squad.id}
                initialLikes={squad.likes || 0}
                initialIsLiked={initialIsLiked}
                initialIsCollected={initialIsCollected}
                variant="card"
              />
            </div>

            <Link href={`/teams/${squad.id}`} className="relative z-20">
              <Button className="bg-[#FCEE21] text-black hover:bg-[#FCEE21]/90 font-bold rounded-none border-0 h-10 px-6">
                View Squad
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
