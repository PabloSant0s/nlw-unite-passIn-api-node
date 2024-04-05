import { prisma } from '@/database/prisma-client'
import { PrismaEventRepository } from '@/database/repositories/prisma-event-repository'
import { CreateEventUseCase } from '@/domain/application/use-cases/create-event'

export function makeCreateEvent() {
  const eventRepository = new PrismaEventRepository(prisma)
  const createEvent = new CreateEventUseCase(eventRepository)
  return createEvent
}
