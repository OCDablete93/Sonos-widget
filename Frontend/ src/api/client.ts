const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1';

export class ApiClient {
  private static async request(endpoint: string, opts: RequestInit = {}) {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...opts.headers },
    });
    if (res.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
      throw new Error('Unauthorized');
    }
    if (res.status === 204) return;
    return res.json();
  }

  static login() { window.location.href = `${BACKEND_URL}/auth/sonos/login`; }
  static async getHouseholds() { return this.request('/households'); }
  static async getGroups(hid: string) { return this.request(`/households/${hid}/groups`); }
  static async play(gid: string) { return this.request(`/groups/${gid}/play`, { method: 'POST' }); }
  static async pause(gid: string) { return this.request(`/groups/${gid}/pause`, { method: 'POST' }); }
  static async setVolume(gid: string, vol: number) { 
    return this.request(`/groups/${gid}/volume`, { method: 'POST', body: JSON.stringify({ volume: vol }) }); 
  }
}
