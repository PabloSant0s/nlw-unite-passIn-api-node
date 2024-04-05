import { AttendeeWithEvent } from '@/domain/enterprise/value-objects/attendee-with-event'

export type PrismaAttendeeWithEvent = {
  id: number
  name: string
  email: string
  createdAt: Date
  event: {
    title: string
  }
}

export class PrismaAttendeeWithEventMapper {
  static toDomain(raw: PrismaAttendeeWithEvent): AttendeeWithEvent {
    return AttendeeWithEvent.create({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      eventTitle: raw.event.title,
      createdAt: new Date(raw.createdAt),
    })
  }
}
