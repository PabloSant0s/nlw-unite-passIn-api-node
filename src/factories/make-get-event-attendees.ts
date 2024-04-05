import { prisma } from '@/database/prisma-client'
import { PrismaAttendeeRepository } from '@/database/repositories/prisma-attendee-repository'
import { PrismaEventRepository } from '@/database/repositories/prisma-event-repository'
import { GetEventAttendeesUseCase } from '@/domain/application/use-cases/get-event-attendees'

export function makeGetEventAttendees() {
  const attendeeRepository = new PrismaAttendeeRepository(prisma)
  const eventRepository = new PrismaEventRepository(prisma)
  const getEventAttendees = new GetEventAttendeesUseCase(
    eventRepository,
    attendeeRepository,
  )
  return getEventAttendees
}
