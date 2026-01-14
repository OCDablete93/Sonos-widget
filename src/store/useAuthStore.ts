// src/store/useAuthStore.ts
import { create } from 'zustand';
import { ApiClient } from '../api/client';

interface AuthState {
  status: 'UNAUTHENTICATED' | 'AUTHENTICATED' | 'EXPIRED';
  login: () => void;
  checkStatus: () => void; // In real app, verify token validity
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'UNAUTHENTICATED', // Default state
  
  login: () => {
    // Redirects browser to Backend -> Sonos
    ApiClient.login();
  },

  checkStatus: () => {
    // For scaffolding, we assume if we have a token (or session), we are good.
    // In production, hit a /me endpoint or check cookie existence.
    // Here we fake it:
    set({ status: 'AUTHENTICATED' }); 
  }
}));
