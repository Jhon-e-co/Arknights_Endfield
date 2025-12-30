"use client";

import { useState } from "react";
import { ThumbsUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SquadActionsProps {
  squadId: string;
  initialLikes: number;
}

export function SquadActions({ squadId, initialLikes }: SquadActionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  return (
    <div className="flex items-center gap-3 pt-6 border-t border-zinc-200 mt-6">
      {/* 1. ENDORSE BUTTON (Split Design) */}
      <button
        onClick={() => {
            setIsLiked(!isLiked);
            setLikes(prev => isLiked ? prev - 1 : prev + 1);
        }}
        className="group flex items-center h-12 shadow-sm active:translate-y-0.5 transition-all"
      >
        <div className={cn(
            "h-full px-6 flex items-center gap-2 font-bold uppercase tracking-wider transition-colors",
            isLiked ? "bg-[#FCEE21] text-black" : "bg-zinc-900 text-[#FCEE21] group-hover:bg-zinc-800"
        )}>
          <ThumbsUp className="w-4 h-4" />
          <span>Endorse</span>
        </div>
        <div className="h-full px-4 flex items-center justify-center bg-[#FCEE21] text-black font-mono font-bold border-l-2 border-black min-w-[3rem]">
          {likes}
        </div>
      </button>

      {/* 2. COLLECT BUTTON (Square) */}
      <button
        onClick={() => setIsCollected(!isCollected)}
        className={cn(
            "h-12 px-4 flex items-center gap-2 border-2 border-zinc-900 font-bold uppercase transition-all active:translate-y-0.5",
            isCollected
                ? "bg-[#FCEE21] text-black border-[#FCEE21]"
                : "bg-transparent text-zinc-900 hover:bg-zinc-900 hover:text-[#FCEE21]"
        )}
        title="Add to Favorites"
      >
        <Star className={cn("w-5 h-5", isCollected && "fill-black")} />
        <span className="hidden md:inline">Collect</span>
      </button>
    </div>
  );
}
