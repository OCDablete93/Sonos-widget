import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { wsClient } from '../websocket/ws.client';
import { ApiClient } from '../api/client';
import NowPlaying from '../components/NowPlaying';
import Controls from '../components/Controls';
import { Loader2 } from 'lucide-react';

export default function WidgetRoot() {
  const { status, login, checkStatus } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>('');

  useEffect(() => {
    checkStatus();
    if (status === 'AUTHENTICATED') {
      wsClient.connect();
      setLoading(true);
      ApiClient.getHouseholds()
        .then(homes => homes[0] && ApiClient.getGroups(homes[0].id))
        .then(groups => {
          if (groups && groups.length) setActiveGroup(groups[0].name);
          setLoading(false);
        });
    }
    return () => wsClient.disconnect();
  }, [status]);

  if (status !== 'AUTHENTICATED') {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-lg border">
        <h2 className="text-xl font-bold mb-4">Sonos Widget</h2>
        <button onClick={login} className="px-6 py-2 bg-black text-white rounded-full">
          Connect Sonos
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-4 bg-gray-50 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
        <span>{activeGroup || 'Select Group'}</span>
        {loading && <Loader2 className="animate-spin" size={14} />}
      </div>
      <NowPlaying />
      <Controls />
    </div>
  );
}

