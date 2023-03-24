import { InMemmoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { SearchGymUseCase } from './search-gym';

let gymsRepository: InMemmoryGymsRepository;
let searchGymUseCase: SearchGymUseCase;

describe('Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemmoryGymsRepository();
    searchGymUseCase = new SearchGymUseCase(gymsRepository);
  });

  it('Should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: `gym-1`,
      title: `javascript`,
      latitude: 1,
      longitude: 1,
    });

    await gymsRepository.create({
      id: `gym-2`,
      title: `typescript gym`,
      latitude: 1,
      longitude: 1,
    });

    const { gyms } = await searchGymUseCase.execute({
      query: 'javascript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'javascript' })]);
  });

  it('Should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `typescript gym ${i}`,
        latitude: 1,
        longitude: 1,
      });
    }

    const { gyms } = await searchGymUseCase.execute({
      query: 'typescript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'typescript gym 21' }),
      expect.objectContaining({ title: 'typescript gym 22' }),
    ]);
  });
});
