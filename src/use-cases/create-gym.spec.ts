import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let createGymUseCase: CreateGymUseCase;

describe('Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    createGymUseCase = new CreateGymUseCase(gymsRepository);
  });

  it('Should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'javascript',
      description: 'javascript',
      phone: '12345678',
      latitude: 1234,
      longitude: 1234,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
