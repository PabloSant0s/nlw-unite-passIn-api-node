import { EventRepository } from '@/domain/application/repositories/event-repository'
import { Event } from '@/domain/enterprise/entities/event'
import { PrismaClient } from '@prisma/client'
import { PrismaEventMapper } from '../mappers/prisma-event-mapper'

export class PrismaEventRepository implements EventRepository {
  constructor(private prisma: PrismaClient) {}
  async findBySlug(slug: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { slug },
    })

    if (!event) return null

    return PrismaEventMapper.toDomain(event)
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({
      where: { id },
    })

    if (!event) return null

    return PrismaEventMapper.toDomain(event)
  }

  async create(event: Event): Promise<Event> {
    const eventOnDatabase = await this.prisma.event.create({
      data: PrismaEventMapper.toPrisma(event),
    })

    return PrismaEventMapper.toDomain(eventOnDatabase)
  }
}
