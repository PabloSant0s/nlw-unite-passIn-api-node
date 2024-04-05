import { prisma } from '@/database/prisma-client'
import { PrismaAttendeeRepository } from '@/database/repositories/prisma-attendee-repository'
import { GetAttendeeBadgeUseCase } from '@/domain/application/use-cases/get-attendee-badge'

export function makeGetAttendeeBadge() {
  const attendeeRepository = new PrismaAttendeeRepository(prisma)
  const getAttendeeBadge = new GetAttendeeBadgeUseCase(attendeeRepository)
  return getAttendeeBadge
}
