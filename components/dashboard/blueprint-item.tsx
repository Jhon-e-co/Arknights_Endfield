"use client";

import React from 'react';
import { BlueprintCard } from '@/components/blueprints/blueprint-card';
import { DeleteButton } from '@/components/common/delete-button';

interface BlueprintItemProps {
  blueprint: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  currentUserRole?: string;
  currentUserId?: string;
}

export function BlueprintItem({ blueprint, currentUserRole, currentUserId }: BlueprintItemProps) {
  const canDelete = blueprint.author_id === currentUserId || currentUserRole === 'admin';

  return (
    <div className="relative group">
      <BlueprintCard blueprint={blueprint} />
      {canDelete && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteButton id={blueprint.id} type="blueprint" />
        </div>
      )}
    </div>
  );
}
