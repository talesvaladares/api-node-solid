import { z, z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createGymBodySchema = zod.object({
    title: zod.string(),
    description: zod.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { description, latitude, longitude, phone, title } =
    createGymBodySchema.parse(request.body);

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  });

  return response.status(201).send();
}
