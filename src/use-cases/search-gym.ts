import { GymsRepository } from '@/repositories/gyms-repository';
import { Gym } from '@prisma/client';

interface SearchGymUseCaseRequest {
  query: string;
  page: number;
}

interface SearchGymUserCaseResponse {
  gyms: Gym[];
}

export class SearchGymUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private gymsRepository: GymsRepository) {
    
  }

  async execute({ 
    query,
    page
  }: SearchGymUseCaseRequest): Promise<SearchGymUserCaseResponse> {
    

    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms };
  }
}
