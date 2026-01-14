// src/app/WidgetRoot.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useHouseholdStore } from '../store/useHouseholdStore'; // Assumed from Blueprint Phase 3
import { wsClient } from '../websocket/ws.client';
import { ApiClient } from '../api/client';
import NowPlaying from '../components/NowPlaying';
import Controls from '../components/Controls';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';

export default function WidgetRoot() {
  // 1. Global State Hooks
  const { status, login, checkStatus } = useAuthStore();
  
  // We need a place to store/select the active group. 
  // In a real app, this comes from useHouseholdStore. 
  // For this scaffold, we fetch and auto-select the first group found.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGroupName, setActiveGroupName] = useState<string>('Select Group');

  // 2. Bootstrap Logic (Auth & Connectivity)
  useEffect(() => {
    // Initial Auth Check
    checkStatus();

    // Global Event Listener for 401 Unauthorized (triggered by ApiClient)
    const handleLogout = () => useAuthStore.setState({ status: 'EXPIRED' });
    window.addEventListener('auth:unauthorized', handleLogout);

    return () => {
      window.removeEventListener('auth:unauthorized', handleLogout);
      wsClient.disconnect(); // Cleanup WS on unmount
    };
  }, [checkStatus]);

  // 3. Data Loading Logic (Runs once Authenticated)
  useEffect(() => {
    if (status === 'AUTHENTICATED') {
      const initializeWidget = async () => {
        setLoading(true);
        try {
          // A. Connect Real-time Updates
          wsClient.connect();

          // B. Fetch Topology (Households & Groups)
          // In a full implementation, these would save to useHouseholdStore
          const households = await ApiClient.getHouseholds();
          if (households.length > 0) {
            const groups = await ApiClient.getGroups(households[0].id);
            
            // Auto-select first group for instant gratification
            if (groups.length > 0) {
              setActiveGroupName(groups[0].name);
              // useHouseholdStore.getState().setActiveGroup(groups[0].id);
            }
          }
        } catch (err) {
          console.error('Failed to init widget:', err);
          setError('Could not connect to Sonos system.');
        } finally {
          setLoading(false);
        }
      };

      initializeWidget();
    }
  }, [status]);

  // --- RENDER STATES ---

  // State 1: Loading
  if (status === 'UNAUTHENTICATED' && loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-3xl border border-gray-100">
        <Loader2 className="animate-spin text-gray-400 mb-2" size={32} />
        <p className="text-sm text-gray-500 font-medium">Connecting to Sonos...</p>
      </div>
    );
  }

  // State 2: Login Required (Unauthenticated or Expired)
  if (status === 'UNAUTHENTICATED' || status === 'EXPIRED') {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-gray-200 shadow-xl p-8 text-center">
        <div className="bg-black text-white p-4 rounded-full mb-6 shadow-lg">
          <WifiOff size={32} />
        </div>
        <h2 className="text-2xl font-bold mb

