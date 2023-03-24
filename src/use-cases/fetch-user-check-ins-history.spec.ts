import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';

let checkInsRespository: InMemoryCheckInsRepository;
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

describe('Fetch User Check-in History Use Case', () => {
  // eslint-disable-next-line prettier/prettier

  beforeEach(async () => {
    checkInsRespository = new InMemoryCheckInsRepository();
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRespository
    );
  });

  it('Should be able to fech check in history', async () => {
    await checkInsRespository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    });

    await checkInsRespository.create({
      gym_id: 'gym-2',
      user_id: 'user-1',
    });

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'user-1',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-1' }),
      expect.objectContaining({ gym_id: 'gym-2' }),
    ]);
  });

  it('Should be able to fech paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRespository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-1',
      });
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'user-1',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});
