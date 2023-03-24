import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { describe, expect, it, beforeEach } from 'vitest';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepsitory: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  // eslint-disable-next-line prettier/prettier

  beforeEach(() => {
    usersRepsitory = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepsitory);
  });

  it('Should be able to get user profile', async () => {
    const { id } = await usersRepsitory.create({
      email: 'jondoe@example.com',
      name: 'jon doe',
      password_hash: await hash('1234567', 6),
    });

    const { user } = await getUserProfileUseCase.execute({ userId: id });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('jon doe');
  });

  it('Should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({ userId: 'non-existing-id' })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
