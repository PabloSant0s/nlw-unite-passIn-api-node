import { CheckInRepository } from '@/domain/application/repositories/checkIn-repository'
import { CheckIn } from '@/domain/enterprise/entities/check-in'
import { PrismaClient } from '@prisma/client'
import { PrismaCheckInMapper } from '../mappers/prisma-checkIn-mapper'

export class PrismaCheckInRepository implements CheckInRepository {
  constructor(private prisma: PrismaClient) {}
  async create(checkIn: CheckIn): Promise<CheckIn> {
    const checkInOnDatabase = await this.prisma.checkIn.create({
      data: PrismaCheckInMapper.toPrisma(checkIn),
    })
    return PrismaCheckInMapper.toDomain(checkInOnDatabase)
  }

  async findByAttendeeId(attendeeId: number): Promise<CheckIn | null> {
    const checkIn = await this.prisma.checkIn.findUnique({
      where: {
        attendeeId,
      },
    })

    if (!checkIn) return null

    return PrismaCheckInMapper.toDomain(checkIn)
  }
}
