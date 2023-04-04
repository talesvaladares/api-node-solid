import { FastifyReply, FastifyRequest } from 'fastify';

export async function refresh(request: FastifyRequest, response: FastifyReply) {
  await request.jwtVerify({
    onlyCookie: true,
  });

  const { role } = request.user;

  const token = await response.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub,
      },
    }
  );

  const refreshToken = await response.jwtSign(
    {
      role,
    },
    {
      sign: {
        sub: request.user.sub,
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
}
