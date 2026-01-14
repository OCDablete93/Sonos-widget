// src/store/usePlaybackStore.ts
import { create } from 'zustand';

[span_1](start_span)// Matches the "Normalized Data Model" from Backend[span_1](end_span)
interface Track {
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
}

interface PlaybackState {
  isPlaying: boolean;
  status: 'PLAYING' | 'PAUSED' | 'STOPPED' | 'BUFFERING';
  track: Track;
  positionMillis: number;
  durationMillis: number;
  volume: number; // 0-100
}

interface PlaybackActions {
  // Called when WebSocket receives "PLAYBACK_UPDATED"
  updatePlayback: (payload: Partial<PlaybackState>) => void;
  // Called when WebSocket receives "VOLUME_UPDATED"
  updateVolume: (volume: number) => void;
}

const DEFAULT_TRACK: Track = {
  name: 'No Music Playing',
  artist: 'Select a group to start',
  album: '',
  imageUrl: '', // You could put a placeholder image URL here
};

export const usePlaybackStore = create<PlaybackState & PlaybackActions>((set) => ({
  // Initial State
  isPlaying: false,
  status: 'STOPPED',
  track: DEFAULT_TRACK,
  positionMillis: 0,
  durationMillis: 0,
  volume: 0,

  // Actions
  updatePlayback: (payload) => {
    set((state) => {
      // If the payload has a status, verify if it counts as "playing" for the UI
      const isPlaying = payload.status 
        ? payload.status === 'PLAYING' || payload.status === 'BUFFERING'
        : state.isPlaying;

      return { ...state, ...payload, isPlaying };
    });
  },

  updateVolume: (volume) => {
    set({ volume });
  }
}));
