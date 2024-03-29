import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUseCase } from './register';

let usersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(usersRepository);
  });

  it('Should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'jon doe',
      email: 'jon@doe.email.com',
      password: '12345678',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'jon doe',
      email: 'jon@doe.email.com',
      password: '12345678',
    });

    const isPasswordCorretlyHashed = await compare(
      '12345678',
      user.password_hash
    );

    expect(isPasswordCorretlyHashed).toBe(true);
  });

  it('Should not be able to register with same email twiche', async () => {
    const email = 'jondoe@example.com';

    await registerUseCase.execute({
      name: 'jon doe',
      email,
      password: '12345678',
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'jon doe',
        email,
        password: '12345678',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
