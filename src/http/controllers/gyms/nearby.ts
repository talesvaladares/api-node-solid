import { z, z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';

export async function nearby(request: FastifyRequest, response: FastifyReply) {
  const nearbyGymsQuerySchema = zod.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body);

  const fetchNearbyGumsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGumsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return response.status(200).send(gyms);
}
