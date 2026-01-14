// src/api/client.ts
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1';

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BACKEND_URL}${endpoint}`;
    
    // We assume the browser handles the Auth Cookie, 
    // OR you can store the JWT in localStorage and inject it here.
    // For this scaffold, we'll assume a "session" approach or simple fetch.
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Global trigger: User needs to log in again
      window.dispatchEvent(new Event('auth:unauthorized'));
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // handle empty 204 responses
    if (response.status === 204) return {} as T;

    return response.json();
  }

  // --- Auth & Discovery ---
  static login() {
    window.location.href = `${BACKEND_URL}/auth/sonos/login`;
  }

  static async getHouseholds() {
    return this.request<any[]>('/households');
  }

  static async getGroups(householdId: string) {
    return this.request<any[]>(`/households/${householdId}/groups`);
  }

  // --- Controls ---
  static async play(groupId: string) {
    return this.request(`/groups/${groupId}/play`, { method: 'POST' });
  }

  static async pause(groupId: string) {
    return this.request(`/groups/${groupId}/pause`, { method: 'POST' });
  }
}
