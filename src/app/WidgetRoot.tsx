// src/app/WidgetRoot.tsx
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { wsClient } from '../websocket/ws.client';
import { ApiClient } from '../api/client';

export default function WidgetRoot() {
  const { status, login, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
    
    // 1. Connect WebSocket only if Authenticated
    if (status === 'AUTHENTICATED') {
      wsClient.connect();
    }
    // Cleanup on unmount
    return () => {
      wsClient.disconnect();
    };
  }, [status, checkStatus]);

    // 2. Listen for 401 errors from the API Client
    const handleLogout = () => useAuthStore.setState({ status: 'EXPIRED' });
    window.addEventListener('auth:unauthorized', handleLogout);
    return () => window.removeEventListener('auth:unauthorized', handleLogout);
  }, [checkStatus]);

  if (status === 'UNAUTHENTICATED' || status === 'EXPIRED') {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Sonos Widget</h2>
        <p className="mb-4 text-gray-600">Please connect your Sonos account.</p>
        <button 
          onClick={login}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Connect Sonos
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
      {/* Components will go here in the next step */}
      <div className="p-4 bg-gray-50 text-center text-gray-500">
        ✅ Authenticated! Loading Player...
      </div>
    </div>
  );
}
