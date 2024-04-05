import { prisma } from '@/database/prisma-client'
import { PrismaAttendeeRepository } from '@/database/repositories/prisma-attendee-repository'
import { PrismaEventRepository } from '@/database/repositories/prisma-event-repository'
import { GetEventUseCase } from '@/domain/application/use-cases/get-event'

export function makeGetEvent() {
  const attendeeRepository = new PrismaAttendeeRepository(prisma)
  const eventRepository = new PrismaEventRepository(prisma)
  const getEvent = new GetEventUseCase(eventRepository, attendeeRepository)
  return getEvent
}
