import { create } from 'zustand';

interface PlaybackState {
  isPlaying: boolean;
  track: { name: string; artist: string; imageUrl: string };
  volume: number;
  updatePlayback: (payload: any) => void;
  updateVolume: (vol: number) => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  isPlaying: false,
  track: { name: '', artist: '', imageUrl: '' },
  volume: 0,
  updatePlayback: (p) => set((s) => ({ ...s, ...p, isPlaying: p.playbackState === 'PLAYING' })),
  updateVolume: (v) => set({ volume: v })
}));
