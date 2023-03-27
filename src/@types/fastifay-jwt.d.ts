import '@fastify/jwt';

declare module '@fastify/jwt' {
  // eslint-disable-next-line prettier/prettier
  export interface FastifyJWT {
    user: {
      sub: string
    }
  }
}