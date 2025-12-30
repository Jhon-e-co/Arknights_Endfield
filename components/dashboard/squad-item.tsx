"use client";

import React from 'react';
import { TeamCard } from '@/components/teams/team-card';
import { DeleteButton } from '@/components/common/delete-button';

interface SquadItemProps {
  squad: any;
  currentUserRole?: string;
  currentUserId?: string;
}

export function SquadItem({ squad, currentUserRole, currentUserId }: SquadItemProps) {
  return (
    <div className="relative group">
      <TeamCard squad={squad} currentUserRole={currentUserRole} currentUserId={currentUserId} />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DeleteButton id={squad.id} type="squad" />
      </div>
    </div>
  );
}
