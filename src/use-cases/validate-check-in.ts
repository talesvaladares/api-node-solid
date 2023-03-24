/* eslint-disable prettier/prettier */
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { CheckIn } from "@prisma/client";
import dayjs from 'dayjs';
import { LateCheckInValidateError } from './errors/late-check-in-validate-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';


interface ValidateCheckinUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckinUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckinUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({ checkInId }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {

    const checkIn = await  this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutsFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (distanceInMinutsFromCheckInCreation > 20) {
      throw new LateCheckInValidateError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn)
    
    return { checkIn }

  }
}