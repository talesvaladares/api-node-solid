import { CheckIn, Prisma } from '@prisma/client';

// usas-se o UncheckedCreate quando precisamos usar a tipagem do relacionamento entre as tabelas do prisma
export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findByUserIdOnDate(userId: string, data: Date): Promise<CheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  findById(checkInId: string): Promise<CheckIn | null>;
  save(checkIn: CheckIn): Promise<CheckIn>;
}
