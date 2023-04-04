import { z, z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';

export async function validate(
  request: FastifyRequest,
  response: FastifyReply
) {
  const validadeCheckInParamsSchema = zod.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validadeCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    checkInId,
  });

  // 204 atualizado com sucesso e não retorna nada
  return response.status(204).send();
}
