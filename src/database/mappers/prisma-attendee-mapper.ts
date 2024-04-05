import { UniqueEntityID } from '@/core/domain/unique-entity-id'
import { Attendee } from '@/domain/enterprise/entities/attendee'
import { Prisma, Attendee as PrismaAttendee } from '@prisma/client'

export class PrismaAttendeeMapper {
  static toDomain(raw: PrismaAttendee): Attendee {
    return Attendee.create(
      {
        email: raw.email,
        eventId: new UniqueEntityID(raw.eventId),
        name: raw.name,
        createdAt: new Date(raw.createdAt),
      },
      raw.id,
    )
  }

  static toPrisma(attendee: Attendee): Prisma.AttendeeUncheckedCreateInput {
    const id = isNaN(attendee.id) ? undefined : attendee.id
    return {
      id,
      email: attendee.email,
      eventId: attendee.eventId.toValue(),
      name: attendee.name,
      createdAt: attendee.createdAt,
    }
  }
}
