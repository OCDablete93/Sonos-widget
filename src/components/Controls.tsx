// src/components/Controls.tsx
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { usePlaybackStore } from '../store/usePlaybackStore';
import { useHouseholdStore } from '../store/useHouseholdStore'; // Assuming this exists from Phase 3 plan
import { ApiClient } from '../api/client';
import { useState } from 'react';

export default function Controls() {
  const isPlaying = usePlaybackStore((state) => state.isPlaying);
  const volume = usePlaybackStore((state) => state.volume);
  
  // We need the activeGroupID to know WHERE to send commands
  // For scaffolding, we'll assume a hook or hardcoded ID if store isn't ready
  const activeGroupId = useHouseholdStore?.((state) => state.activeGroupId); 

  // Local state for slider dragging (prevents jitter while dragging)
  const [isDraggingVol, setIsDraggingVol] = useState(false);
  const [localVol, setLocalVol] = useState(volume);

  const handlePlayPause = () => {
    if (!activeGroupId) return;
    if (isPlaying) {
      ApiClient.pause(activeGroupId);
    } else {
      ApiClient.play(activeGroupId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setLocalVol(newVol);
    
    // Debounce this in production! 
    // For now, we send it on 'mouseUp' or 'change'
    if (activeGroupId) {
       // Ideally: call API only when user stops dragging
       // ApiClient.setVolume(activeGroupId, newVol); 
    }
  };

  const commitVolume = () => {
    setIsDraggingVol(false);
    if (activeGroupId) {
      ApiClient.setVolume(activeGroupId, localVol);
    }
  };

  const disabled = !activeGroupId;

  return (
    <div className="px-6 pb-8">
      {/* Progress Bar (Visual only for now) */}
      <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
        <div className="bg-black h-1 rounded-full w-0" style={{ width: '0%' }}></div>
      </div>

      {/* Main Buttons */}
      <div className="flex items-center justify-between mb-8 px-4">
        <button className="text-gray-400 hover:text-black transition disabled:opacity-30" disabled={disabled}>
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={handlePlayPause}
          disabled={disabled}
          className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition disabled:bg-gray-300"
        >
          {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
        </button>

        <button className="text-gray-400 hover:text-black transition disabled:opacity-30" disabled={disabled}>
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center space-x-3 text-gray-500">
        <Volume2 size={20} />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={isDraggingVol ? localVol : volume} 
          onChange={(e) => { setIsDraggingVol(true); handleVolumeChange(e); }}
          onMouseUp={commitVolume}
          onTouchEnd={commitVolume}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
        />
      </div>
    </div>
  );
}
