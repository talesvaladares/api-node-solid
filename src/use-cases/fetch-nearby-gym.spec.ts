import { InMemmoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gym';

let gymsRepository: InMemmoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemmoryGymsRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('Fetch Nearby Gyms Use case', async () => {
    await gymsRepository.create({
      id: `gym-1`,
      title: `near gym`,
      latitude: -19.1680054,
      longitude: -45.440392,
    });

    await gymsRepository.create({
      id: `gym-2`,
      title: `far gym`,
      latitude: -19.0741933,
      longitude: -45.5392029,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -19.1680054,
      userLongitude: -45.440392,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'near gym' })]);
  });

});
