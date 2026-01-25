"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlueprintActionsProps {
  blueprintId: string;
  initialLikes: number;
  initialIsLiked?: boolean;
  initialIsCollected?: boolean;
}

export function BlueprintActions({ blueprintId, initialLikes, initialIsLiked = false, initialIsCollected = false }: BlueprintActionsProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isCollected, setIsCollected] = useState(initialIsCollected);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    const previousState = isLiked;
    const previousLikes = likes;
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);

    try {
      const response = await fetch('/api/likes/blueprints', {
        method: previousState ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blueprint_id: blueprintId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Operation failed');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      setIsLiked(previousState);
      setLikes(previousLikes);
      alert('Failed to update like. Please try again.');
    }
  };

  const handleCollect = async () => {
    const previousState = isCollected;
    setIsCollected(!isCollected);
    setIsLoading(true);

    try {
      const response = await fetch('/api/favorites/blueprints', {
        method: previousState ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blueprint_id: blueprintId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error('Operation failed');
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error updating favorite:', error);
      setIsCollected(previousState);
      alert('Failed to update favorite. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleLike}
        className={cn(
            "w-10 h-10 flex items-center justify-center border-2 font-bold transition-all active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
            isLiked
                ? "bg-[#FCEE21] text-black border-[#FCEE21]"
                : "border-zinc-700 text-zinc-400 hover:text-black hover:bg-[#FCEE21] hover:border-[#FCEE21]"
        )}
        title="Like"
      >
        <Heart className={cn("w-5 h-5", isLiked && "fill-black")} />
      </button>

      <span className="font-bold text-sm tabular-nums text-zinc-500">
        {likes}
      </span>

      <button
        onClick={handleCollect}
        disabled={isLoading}
        className={cn(
            "w-10 h-10 flex items-center justify-center border-2 font-bold transition-all active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed",
            isCollected
                ? "bg-[#FCEE21] text-black border-[#FCEE21]"
                : "border-zinc-700 text-zinc-400 hover:text-black hover:bg-[#FCEE21] hover:border-[#FCEE21]"
        )}
        title="Add to Favorites"
      >
        <Star className={cn("w-5 h-5", isCollected && "fill-black")} />
      </button>
    </div>
  );
}
