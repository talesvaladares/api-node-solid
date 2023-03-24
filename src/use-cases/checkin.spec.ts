import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemmoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckinUseCase } from './checkin';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let checkInUseCase: CheckinUseCase;
let gymsRepository: InMemmoryGymsRepository;
let checkInsRepository: InMemoryCheckInsRepository;

describe('CheckIn Use Case', () => {
  // eslint-disable-next-line prettier/prettier

  beforeEach(async () => {
    gymsRepository = new InMemmoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckinUseCase(gymsRepository, checkInsRepository);

    await gymsRepository.create({
      id: 'gym-1',
      title: 'javascript gym',
      description: '',
      phone: '',
      latitude: new Decimal(-19.1723428),
      longitude: new Decimal(-45.4415936),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -19.1723428,
      userLongitude: -45.4415936,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not be able to check in twice in the same day', async () => {
    // garante que ambas checkIns sejam criado exatamente na mesma data
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -19.1723428,
      userLongitude: -19.1723428,
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -19.1723428,
        userLongitude: -19.1723428,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('Should be able to check in twice but in different days', async () => {
    // garante que ambas checkIns sejam criado exatamente na mesma data
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -19.1723428,
      userLongitude: -19.1723428,
    });

    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -19.1723428,
      userLongitude: -19.1723428,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-2',
      title: 'javascript gym',
      description: '',
      phone: '',
      latitude: new Decimal(-19.1638302),
      longitude: new Decimal(-45.4406495),
    });

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-2',
        userId: 'user-1',
        userLatitude: -19.1920897,
        userLongitude: -45.6710153,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
