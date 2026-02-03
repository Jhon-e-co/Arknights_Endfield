"use client";

import React from 'react';
import { TeamCard } from '@/components/teams/team-card';

interface SquadItemProps {
  squad: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  currentUserRole?: string;
  currentUserId?: string;
}

export function SquadItem({ squad, currentUserRole, currentUserId }: SquadItemProps) {
  return (
    <div className="relative group">
      <TeamCard squad={squad} currentUserRole={currentUserRole} currentUserId={currentUserId} />
      {/* 编辑和删除按钮已由 TeamCard 内部处理 */}
    </div>
  );
}
