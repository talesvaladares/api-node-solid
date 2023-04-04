import { z, z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, response: FastifyReply) {
  const checkInHistoryQuerySchema = zod.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const historyUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await historyUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return response.status(200).send({
    checkIns,
  });
}
