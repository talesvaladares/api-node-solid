import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepsitory: InMemoryUsersRepository;
let authUserCase: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  // eslint-disable-next-line prettier/prettier

  beforeEach(() => {
    usersRepsitory = new InMemoryUsersRepository();
    authUserCase = new AuthenticateUseCase(usersRepsitory);
  });

  it('Should be able to authenticate', async () => {
    await usersRepsitory.create({
      email: 'jondoe@example.com',
      name: 'jon doe',
      password_hash: await hash('1234567', 6),
    });

    const { user } = await authUserCase.execute({
      email: 'jondoe@example.com',
      password: '1234567',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authUserCase.execute({
        email: 'jondoe@example.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await usersRepsitory.create({
      email: 'jondoe@example.com',
      name: 'jon doe',
      password_hash: await hash('1234567', 6),
    });

    await expect(() =>
      authUserCase.execute({
        email: 'jondoe@example.com',
        password: '87654321',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
