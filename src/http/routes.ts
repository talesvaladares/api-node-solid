import { FastifyInstance } from 'fastify';
import { register } from './controllers/register';
import { authenticate } from './controllers/authenticate';
import { profile } from './controllers/profile';
import { verifyJWT } from './middlewares/verify-jwt';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);

  // rotas autenticadas
  // o onRequest executa antes do restante da rota
  // verificando se existe um jwt válido
  app.get('/me', { onRequest: [verifyJWT] }, profile);
}
