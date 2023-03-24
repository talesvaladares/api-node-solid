import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { LateCheckInValidateError } from './errors/late-check-in-validate-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ValidateCheckinUseCase } from './validate-check-in';

let validateCheckInUseCase: ValidateCheckinUseCase;
let checkInsRepository: InMemoryCheckInsRepository;

describe('Validade Check In Use Case', () => {
  // eslint-disable-next-line prettier/prettier

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckinUseCase(checkInsRepository);

    // await gymsRepository.create({
    //   id: 'gym-1',
    //   title: 'javascript gym',
    //   description: '',
    //   phone: '',
    //   latitude: new Decimal(-19.1723428),
    //   longitude: new Decimal(-45.4415936),
    // });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    });

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('Should be able to validate an inexistent check-in', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able to validate the check-in after 20 minutos of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-1',
      user_id: 'user-1',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidateError);
  });
});
