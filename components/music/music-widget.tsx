"use client";

import { useState } from "react";
import { Play, Pause, Music, Volume2, VolumeX, ChevronUp, ChevronDown, Repeat, Repeat1, Shuffle } from "lucide-react";
import { useMusic } from "@/context/music-context";
import { Slider } from "@/components/ui/slider";

export function MusicWidget() {
  const { isPlaying, currentTrack, volume, isExpanded, loopMode, playlist, togglePlay, playTrack, nextTrack, prevTrack, setVolume, toggleExpanded, toggleLoopMode } = useMusic();
  const [isMuted, setIsMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.4);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const getLoopModeIcon = () => {
    switch (loopMode) {
      case 'sequential':
        return <Repeat className="w-4 h-4" />;
      case 'single':
        return <Repeat1 className="w-4 h-4" />;
      case 'shuffle':
        return <Shuffle className="w-4 h-4" />;
    }
  };

  const getLoopModeLabel = () => {
    switch (loopMode) {
      case 'sequential':
        return 'Loop All';
      case 'single':
        return 'Loop One';
      case 'shuffle':
        return 'Shuffle';
    }
  };

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleExpanded();
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-black text-[#FCEE21] rounded-full hover:bg-zinc-900 transition-colors cursor-pointer"
      >
        <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
        <span className="text-xs font-medium max-w-[120px] truncate hidden sm:block">
          {currentTrack?.title || "No Track"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="flex items-center justify-center w-6 h-6 bg-[#FCEE21] text-black rounded-full hover:bg-white transition-colors"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {isExpanded && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={toggleExpanded}
          />
          <div className="absolute right-0 top-12 z-20 w-72 bg-white border-2 border-black shadow-lg">
            <div className="p-4 border-b-2 border-black bg-zinc-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Playlist</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLoopMode();
                    }}
                    className="p-1 hover:bg-zinc-200 rounded transition-colors"
                    title={getLoopModeLabel()}
                  >
                    {getLoopModeIcon()}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVolume(!showVolume);
                    }}
                    className="p-1 hover:bg-zinc-200 rounded transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {showVolume && (
                <div className="mt-3">
                  <Slider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleVolumeChange}
                  />
                </div>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {playlist.map((track, index) => (
                <button
                  key={track.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(track);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-zinc-100 transition-colors border-b border-zinc-200 ${
                    currentTrack?.id === track.id ? "bg-[#FCEE21]/10 border-l-4 border-l-[#FCEE21]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 font-mono">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${currentTrack?.id === track.id ? "text-black" : "text-zinc-700"}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
                    </div>
                    {currentTrack?.id === track.id && isPlaying && (
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-3 bg-[#FCEE21] animate-pulse" style={{ animationDelay: "0ms" }} />
                        <span className="w-0.5 h-4 bg-[#FCEE21] animate-pulse" style={{ animationDelay: "150ms" }} />
                        <span className="w-0.5 h-2 bg-[#FCEE21] animate-pulse" style={{ animationDelay: "300ms" }} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t-2 border-black bg-zinc-50 flex items-center justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevTrack();
                }}
                className="p-2 hover:bg-zinc-200 rounded transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-3 bg-black text-[#FCEE21] rounded-full hover:bg-zinc-900 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextTrack();
                }}
                className="p-2 hover:bg-zinc-200 rounded transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
