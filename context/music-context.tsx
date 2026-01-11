"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isExpanded: boolean;
  playlist: Track[];
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleExpanded: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const DEFAULT_PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Industrial Dreams",
    artist: "Endfield Lab",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Factory Rhythms",
    artist: "Endfield Lab",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Mechanical Heart",
    artist: "Endfield Lab",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEFAULT_PLAYLIST[0]);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = DEFAULT_PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % DEFAULT_PLAYLIST.length;
    playTrack(DEFAULT_PLAYLIST[nextIndex]);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const currentIndex = DEFAULT_PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + DEFAULT_PLAYLIST.length) % DEFAULT_PLAYLIST.length;
    playTrack(DEFAULT_PLAYLIST[prevIndex]);
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        isExpanded,
        playlist: DEFAULT_PLAYLIST,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
        setVolume,
        toggleExpanded,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
