import { prisma } from '@/database/prisma-client'
import { PrismaAttendeeRepository } from '@/database/repositories/prisma-attendee-repository'
import { PrismaEventRepository } from '@/database/repositories/prisma-event-repository'
import { RegisterAttendeeForEventUseCase } from '@/domain/application/use-cases/register-attendee-for-event'

export function makeRegisterForEvent() {
  const attendeeRepository = new PrismaAttendeeRepository(prisma)
  const eventRepository = new PrismaEventRepository(prisma)
  const registerForEvent = new RegisterAttendeeForEventUseCase(
    attendeeRepository,
    eventRepository,
  )
  return registerForEvent
}
