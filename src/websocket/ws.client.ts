// src/websocket/ws.client.ts
import { usePlaybackStore } from '../store/usePlaybackStore';

// In Vite, use import.meta.env. In Create-React-App, use process.env
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect() {
    if (this.socket) return; // Already connected

    console.log('🔌 Connecting to WebSocket...', WS_URL);
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      console.log('✅ WebSocket Connected');
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    this.socket.onclose = () => {
      console.log('⚠️ WebSocket Disconnected. Reconnecting in 3s...');
      this.socket = null;
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };
  }

  /**
   * Dispatches incoming events to the correct Zustand store
   */
  private handleMessage(message: any) {
    const { type, payload } = message;

    switch (type) {
      case 'PLAYBACK_UPDATED':
        // Payload matches the Normalized Playback State
        usePlaybackStore.getState().updatePlayback(payload);
        break;

      case 'VOLUME_UPDATED':
        usePlaybackStore.getState().updateVolume(payload.volume);
        break;

      case 'CONNECTED':
        // Optional: Trigger an initial fetch of state here
        break;

      default:
        console.warn('Unknown WebSocket event type:', type);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Singleton instance
export const wsClient = new WebSocketClient();
