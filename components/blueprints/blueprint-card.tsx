"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlueprintActions } from '@/components/blueprints/blueprint-actions';
import { DeleteButton } from '@/components/common/delete-button';
import { Blueprint } from '@/lib/mock-data';

interface BlueprintCardProps {
  blueprint: Blueprint;
  currentUserId?: string;
  currentUserRole?: string;
}

export function BlueprintCard({ blueprint, currentUserId, currentUserRole = 'user' }: BlueprintCardProps) {
  const canDelete = blueprint.author_id === currentUserId || currentUserRole === 'admin';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(blueprint.code);
      alert("Blueprint code copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative flex flex-col h-full border border-zinc-200 bg-white rounded-none shadow-sm">
      {canDelete && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteButton id={blueprint.id} type="blueprint" />
        </div>
      )}
      {/* Image Section */}
      <Link href={`/blueprints/${blueprint.id}`} className="block relative aspect-video bg-zinc-800 overflow-hidden">
        {blueprint.image ? (
          <Image
            src={blueprint.image}
            alt={blueprint.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-zinc-600 text-sm">No Preview</span>
          </div>
        )}
        {/* Version Tag */}
        <div className="absolute top-2 left-2 bg-[#FCEE21] text-black text-xs font-bold px-2 py-1">
          V1.0
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <Link href={`/blueprints/${blueprint.id}`} className="block mb-2">
          <h3 className="text-lg font-bold group-hover:text-zinc-600 transition-colors">
            {blueprint.title}
          </h3>
        </Link>

        {/* Author (Independent Link) */}
        <div className="text-sm text-zinc-500 mb-4">
          by <Link href={`/users/${blueprint.author_id}`} className="hover:text-black hover:underline">{blueprint.author}</Link>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blueprint.tags.map((tag, index) => (
            <Badge key={index} className="rounded-none bg-zinc-100 text-zinc-900 border-zinc-300">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Copy Button */}
        <Button
          variant="outline"
          className="rounded-none mb-4"
          onClick={handleCopyCode}
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Code
        </Button>

        {/* Blueprint Actions */}
        <div className="mt-auto">
          <BlueprintActions
            blueprintId={blueprint.id}
            initialLikes={blueprint.likes}
          />
        </div>
      </div>
    </div>
  );
}