import {
  AttendeeRepository,
  FindManyWithCheckInByEventIdParams,
} from '@/domain/application/repositories/attendee-repository'
import { Attendee } from '@/domain/enterprise/entities/attendee'
import { AttendeeWithCheckIn } from '@/domain/enterprise/value-objects/attendee-with-checkIn'
import { AttendeeWithEvent } from '@/domain/enterprise/value-objects/attendee-with-event'
import { PrismaClient } from '@prisma/client'
import { PrismaAttendeeMapper } from '../mappers/prisma-attendee-mapper'
import { PrismaAttendeeWithEventMapper } from '../mappers/prisma-attendee-with-event-mapper'
import { PrismaAttendeeWithCheckInMapper } from '../mappers/prisma-attendee-with-checkIn-mapper'

export class PrismaAttendeeRepository implements AttendeeRepository {
  constructor(private prisma: PrismaClient) {}
  async create(attendee: Attendee): Promise<Attendee> {
    console.log(PrismaAttendeeMapper.toPrisma(attendee))
    const attendeeOnDatabase = await this.prisma.attendee.create({
      data: PrismaAttendeeMapper.toPrisma(attendee),
    })

    return PrismaAttendeeMapper.toDomain(attendeeOnDatabase)
  }

  async findById(id: number): Promise<Attendee | null> {
    const attendee = await this.prisma.attendee.findUnique({
      where: { id },
    })

    if (!attendee) return null

    return PrismaAttendeeMapper.toDomain(attendee)
  }

  async countByEventId(eventId: string): Promise<number> {
    const count = await this.prisma.attendee.count({
      where: {
        eventId,
      },
    })

    return count
  }

  async findWithEventById(id: number): Promise<AttendeeWithEvent | null> {
    const attendeeWithEvent = await this.prisma.attendee.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        event: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id,
      },
    })

    if (!attendeeWithEvent) return null

    return PrismaAttendeeWithEventMapper.toDomain(attendeeWithEvent)
  }

  async findByEmailAndEventId(
    email: string,
    eventId: string,
  ): Promise<Attendee | null> {
    const attendee = await this.prisma.attendee.findUnique({
      where: {
        eventId_email: {
          eventId,
          email,
        },
      },
    })

    if (!attendee) return null

    return PrismaAttendeeMapper.toDomain(attendee)
  }

  async findManyWithCheckInByEventId({
    eventId,
    query,
    limit = 10,
    page = 0,
  }: FindManyWithCheckInByEventIdParams): Promise<AttendeeWithCheckIn[]> {
    const attendees = await this.prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        checkIn: {
          select: {
            createdAt: true,
          },
        },
      },
      where: query
        ? {
            eventId,
            name: {
              contains: query,
            },
          }
        : {
            eventId,
          },
      take: limit,
      skip: page * limit,
    })

    return attendees.map(PrismaAttendeeWithCheckInMapper.toDomain)
  }
}
