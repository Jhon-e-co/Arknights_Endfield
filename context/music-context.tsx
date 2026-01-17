"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useMemo, useCallback } from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

type LoopMode = 'sequential' | 'single' | 'shuffle';

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isExpanded: boolean;
  loopMode: LoopMode;
  playlist: Track[];
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleExpanded: () => void;
  toggleLoopMode: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const DEFAULT_PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Give Me Something",
    artist: "OneRepublic",
    url: "/music/Give Me Something.mp3",
  },
];

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEFAULT_PLAYLIST[0]);
  const [volume, setVolume] = useState(0.4);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('sequential');
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (loopMode === 'single') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [loopMode]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentTrack || DEFAULT_PLAYLIST.length === 0) return;

    if (loopMode === 'shuffle') {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * DEFAULT_PLAYLIST.length);
      } while (randomIndex === DEFAULT_PLAYLIST.findIndex((t) => t.id === currentTrack.id) && DEFAULT_PLAYLIST.length > 1);
      playTrack(DEFAULT_PLAYLIST[randomIndex]);
    } else {
      const currentIndex = DEFAULT_PLAYLIST.findIndex((t) => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % DEFAULT_PLAYLIST.length;
      playTrack(DEFAULT_PLAYLIST[nextIndex]);
    }
  }, [currentTrack, loopMode, playTrack]);

  const prevTrack = useCallback(() => {
    if (!currentTrack) return;
    const currentIndex = DEFAULT_PLAYLIST.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + DEFAULT_PLAYLIST.length) % DEFAULT_PLAYLIST.length;
    playTrack(DEFAULT_PLAYLIST[prevIndex]);
  }, [currentTrack, playTrack]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleLoopMode = useCallback(() => {
    setLoopMode((prev) => {
      if (prev === 'sequential') return 'single';
      if (prev === 'single') return 'shuffle';
      return 'sequential';
    });
  }, []);

  const setVolumeCallback = useCallback((volume: number) => {
    setVolume(volume);
  }, []);

  const contextValue = useMemo(() => ({
    isPlaying,
    currentTrack,
    volume,
    isExpanded,
    loopMode,
    playlist: DEFAULT_PLAYLIST,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    setVolume: setVolumeCallback,
    toggleExpanded,
    toggleLoopMode,
  }), [isPlaying, currentTrack, volume, isExpanded, loopMode, togglePlay, playTrack, nextTrack, prevTrack, setVolumeCallback, toggleExpanded, toggleLoopMode]);

  return (
    <MusicContext.Provider value={contextValue}>
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
