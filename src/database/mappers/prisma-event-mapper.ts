import { UniqueEntityID } from '@/core/domain/unique-entity-id'
import { Event } from '@/domain/enterprise/entities/event'
import { Slug } from '@/domain/enterprise/value-objects/slug'
import { Prisma, Event as PrismaEvent } from '@prisma/client'

export class PrismaEventMapper {
  static toDomain(raw: PrismaEvent): Event {
    return Event.create(
      {
        title: raw.title,
        slug: new Slug(raw.slug),
        details: raw.details,
        maximumAttendees: raw.maximumAttendees,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(event: Event): Prisma.EventUncheckedCreateInput {
    return {
      id: event.id.toValue(),
      slug: event.slug.toValue(),
      title: event.title,
      details: event.details,
      maximumAttendees: event.maximumAttendees,
    }
  }
}
