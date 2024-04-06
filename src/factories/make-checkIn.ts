import { prisma } from '@/database/prisma-client'
import { PrismaAttendeeRepository } from '@/database/repositories/prisma-attendee-repository'
import { PrismaCheckInRepository } from '@/database/repositories/prisma-checkIn-repository'
import { CheckInUseCase } from '@/domain/application/use-cases/checkIn'

export function makeCheckIn() {
  const checkInRepository = new PrismaCheckInRepository(prisma)
  const attendeeRepository = new PrismaAttendeeRepository(prisma)
  const checkIn = new CheckInUseCase(checkInRepository, attendeeRepository)
  return checkIn
}
