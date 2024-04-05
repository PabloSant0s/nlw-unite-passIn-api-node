import { AttendeeWithCheckIn } from '@/domain/enterprise/value-objects/attendee-with-checkIn'

export type PrismaAttendeeWithCheckIn = {
  id: number
  name: string
  email: string
  createdAt: Date
  checkIn: {
    createdAt: Date
  } | null
}

export class PrismaAttendeeWithCheckInMapper {
  static toDomain(raw: PrismaAttendeeWithCheckIn): AttendeeWithCheckIn {
    return AttendeeWithCheckIn.create({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      createdAt: new Date(raw.createdAt),
      checkInAt: raw.checkIn ? new Date(raw.checkIn.createdAt) : null,
    })
  }
}
