import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';
import { authRoutes } from './auth/oauth.controller';
import { householdsRoutes } from './households/households.routes';
import { playbackRoutes } from './playback/playback.routes';
import { webhookRoutes } from './webhooks/sonos.webhook';
import { WebSocketGateway } from './realtime/websocket.gateway';

dotenv.config();

const startServer = async () => {
  const server: FastifyInstance = Fastify({
    logger: { level: process.env.LOG_LEVEL || 'info' },
  });

  try {
    // Plugins
    await server.register(cors, { origin: process.env.FRONTEND_URL || '*' });
    await server.register(websocket);

    // Routes
    await server.register(authRoutes, { prefix: '/api/v1/auth' });
    await server.register(householdsRoutes, { prefix: '/api/v1/households' });
    await server.register(playbackRoutes, { prefix: '/api/v1/groups' });
    await server.register(webhookRoutes, { prefix: '/api/v1/webhooks' });

    // WebSocket Gateway
    await WebSocketGateway.register(server);

    // Health
    server.get('/health', async () => ({ status: 'ok', service: 'sonos-backend' }));

    const PORT = parseInt(process.env.PORT || '3000', 10);
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);

  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
