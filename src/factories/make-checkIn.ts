import { prisma } from '@/database/prisma-client'
import { PrismaCheckInRepository } from '@/database/repositories/prisma-checkIn-repository'
import { CheckInUseCase } from '@/domain/application/use-cases/checkIn'

export function makeCheckIn() {
  const checkInRepository = new PrismaCheckInRepository(prisma)
  const checkIn = new CheckInUseCase(checkInRepository)
  return checkIn
}
