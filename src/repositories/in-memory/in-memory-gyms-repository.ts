import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import {Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';

export class InMemoryGymsRepository implements GymsRepository {

  public items: Gym[] = [];
  
  async findById(gymId: string): Promise<Gym | null> {
    const gym = this.items.find(gym => gym.id === gymId);

    if(!gym) {
      return null
    }

    return gym;
  }
 
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
  
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date()
    }

    this.items.push(gym);

    return gym;
    
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items.filter(item => item.title.includes(query)).slice((page - 1) * 20, page * 20)
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    
    const MAX_DISTANCE_IN_KILOMETERS = 10;
    
    return this.items.filter(item => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        }
      )

      return distance < MAX_DISTANCE_IN_KILOMETERS
    })
  }

}