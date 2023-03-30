import { z, z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gym-use-case';

export async function search(request: FastifyRequest, response: FastifyReply) {
  const searchGymsQuerySchema = zod.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { page, query } = searchGymsQuerySchema.parse(request.body);

  const searchGymsUseCase = makeSearchGymsUseCase();

  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  });

  return response.status(200).send(gyms);
}
