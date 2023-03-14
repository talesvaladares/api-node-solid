import { z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export async function register(
  request: FastifyRequest,
  response: FastifyReply
) {
  const registerBodySchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);
    await registerUseCase.execute({
      name,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      // 409 é status de conflito
      return response.status(409).send({
        message: error.message,
      });
    }

    return response.status(500).send();
  }

  return response.status(201).send();
}
