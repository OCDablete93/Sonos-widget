import { Household, Group, PlaybackState } from './sonos.types';

const SONOS_API_BASE = 'https://api.ws.sonos.com/control/api/v1';

export class SonosClient {
  constructor(private accessToken: string) {}

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${SONOS_API_BASE}${endpoint}`, {
      ...options,
      headers: { 
        'Authorization': `Bearer ${this.accessToken}`, 
        'Content-Type': 'application/json',
        ...options.headers
      },
    });
    if (res.status === 204) return {} as T;
    if (!res.ok) throw new Error(`Sonos API Error: ${res.status}`);
    return await res.json();
  }

  async getHouseholds(): Promise<Household[]> {
    const data = await this.request<{ households: Household[] }>('/households');
    return data.households;
  }
  
  async getGroups(householdId: string): Promise<Group[]> {
    const data = await this.request<{ groups: Group[] }>(`/households/${householdId}/groups`);
    return data.groups;
  }

  async getPlayback(groupId: string): Promise<PlaybackState> {
    return this.request<PlaybackState>(`/groups/${groupId}/playback`);
  }

  async play(groupId: string): Promise<void> {
    await this.request(`/groups/${groupId}/playback/play`, { method: 'POST' });
  }

  async pause(groupId: string): Promise<void> {
    await this.request(`/groups/${groupId}/playback/pause`, { method: 'POST' });
  }

  async setVolume(groupId: string, volume: number): Promise<void> {
    await this.request(`/groups/${groupId}/groupVolume`, {
      method: 'POST', body: JSON.stringify({ volume })
    });
  }
}
