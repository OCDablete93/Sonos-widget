import { PlaybackState } from './sonos.types';

export class SonosNormalizer {
  static normalizePlayback(raw: any): PlaybackState {
    return {
      playbackState: raw.playbackState || 'STOPPED',
      positionMillis: raw.positionMillis || 0,
      track: {
        name: raw.currentItem?.track?.name || 'Unknown Title',
        artist: raw.currentItem?.track?.artist?.name || 'Unknown Artist',
        album: raw.currentItem?.track?.album?.name || '',
        imageUrl: raw.currentItem?.track?.imageUrl || '',
      }
    };
  }
}
