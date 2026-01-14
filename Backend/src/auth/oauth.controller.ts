import { FastifyInstance } from 'fastify';
import { OAuthService } from './oauth.service'; // (Assume standard impl)
import { TokenStore } from './token.store';

const oauthService = new OAuthService(new TokenStore()); // Logic to build URL omitted for brevity

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/sonos/login', async (req, reply) => {
    const url = oauthService.getLoginUrl('state');
    return reply.redirect(url);
  });

  fastify.get('/sonos/callback', async (req: any, reply) => {
    await oauthService.handleCallback(req.query.code, 'user_123');
    return reply.send({ message: 'Connected' });
  });
}
