import { z as zod } from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';

export async function authenticate(
  request: FastifyRequest,
  response: FastifyReply
) {
  const authBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { email, password } = authBodySchema.parse(request.body);

  try {
    const authUseCase = makeAuthenticateUseCase();

    const { user } = await authUseCase.execute({
      email,
      password,
    });

    const token = await response.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    const refreshToken = await response.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // 7 dias
        },
      }
    );

    return response
      .setCookie('refreshToken', refreshToken, {
        path: '/', // todas rodas podem acessar o cookie
        secure: true, // encripitado com https
        sameSite: true, // acessivel apenas dentro do mesmo dominio
        httpOnly: true, // acessivel somente no backend
      })
      .status(200)
      .send({
        token,
      });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      // 400 bad request
      return response.status(400).send({
        message: error.message,
      });
    }
  }

  return response.status(200);
}
