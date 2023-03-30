import { FastifyInstance } from 'fastify';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { search } from './search';
import { nearby } from './nearby';
import { create } from './create';

export async function gymsRoutes(app: FastifyInstance) {
  // rotas autenticadas
  // o onRequest executa antes do restante da rota
  // verificando se existe um jwt válido
  app.addHook('onRequest', verifyJWT);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);

  app.post('/gyms', create);
}
