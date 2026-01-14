import { create } from 'zustand';
import { ApiClient } from '../api/client';

interface AuthState {
  status: 'UNAUTHENTICATED' | 'AUTHENTICATED' | 'EXPIRED';
  login: () => void;
  checkStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'UNAUTHENTICATED',
  login: () => ApiClient.login(),
  checkStatus: () => set({ status: 'AUTHENTICATED' }) // Mock check
}));
