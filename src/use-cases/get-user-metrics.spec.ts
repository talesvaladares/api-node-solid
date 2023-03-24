import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { GetUserMetricsUseCase } from './get-user-metrics';

let getUserMetricsUseCase: GetUserMetricsUseCase;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Get User Metrics Use Case', () => {
  // eslint-disable-next-line prettier/prettier

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    });
  });

  it('Should be able to get check-ins count from metrics', async () => {
    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
