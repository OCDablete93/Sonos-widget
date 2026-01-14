// src/components/NowPlaying.tsx
import { usePlaybackStore } from '../store/usePlaybackStore';
import { Music2 } from 'lucide-react'; // Generic icon for missing art

export default function NowPlaying() {
  // 1. Subscribe only to the specific data we need (Performance optimization)
  const track = usePlaybackStore((state) => state.track);
  const isPlaying = usePlaybackStore((state) => state.isPlaying);

  // 2. Handle the "Nothing Playing" state
  if (!track || !track.name) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-gray-50 text-gray-400">
        <Music2 size={48} className="mb-2 opacity-50" />
        <p className="text-sm font-medium">No music playing</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center text-center">
      {/* Album Art with Shadow that pulses when playing */}
      <div className={`relative w-48 h-48 mb-6 rounded-lg shadow-xl overflow-hidden transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-95 grayscale'}`}>
        {track.imageUrl ? (
          <img 
            src={track.imageUrl} 
            alt={track.album} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Music2 size={64} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-1 w-full overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 truncate w-full">
          {track.name}
        </h3>
        <p className="text-sm text-gray-500 truncate font-medium">
          {track.artist}
        </p>
        {track.album && (
          <p className="text-xs text-gray-400 truncate">
            {track.album}
          </p>
        )}
      </div>
    </div>
  );
}
