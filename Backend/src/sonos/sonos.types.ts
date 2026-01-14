export interface Household { id: string; name?: string; }
export interface Group { id: string; name: string; playbackState: string; }
export interface PlaybackState {
  playbackState: string;
  positionMillis: number;
  track?: { name: string; artist?: string; album?: string; imageUrl?: string; };
}
