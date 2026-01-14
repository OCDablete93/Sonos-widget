import { usePlaybackStore } from '../store/usePlaybackStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

export class WebSocketClient {
  private socket: WebSocket | null = null;

  connect() {
    if (this.socket) return;
    this.socket = new WebSocket(WS_URL);
    this.socket.onmessage = (e) => {
      const { type, payload } = JSON.parse(e.data);
      if (type === 'PLAYBACK_UPDATED') usePlaybackStore.getState().updatePlayback(payload);
      if (type === 'VOLUME_UPDATED') usePlaybackStore.getState().updateVolume(payload.volume);
    };
  }

  disconnect() { this.socket?.close(); this.socket = null; }
}
export const wsClient = new WebSocketClient();
