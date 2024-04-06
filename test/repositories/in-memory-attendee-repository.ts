import {
  AttendeeRepository,
  FindManyWithCheckInByEventIdParams,
} from '@/domain/application/repositories/attendee-repository'
import { Attendee } from '@/domain/enterprise/entities/attendee'
import { AttendeeWithCheckIn } from '@/domain/enterprise/value-objects/attendee-with-checkIn'
import { AttendeeWithEvent } from '@/domain/enterprise/value-objects/attendee-with-event'
import { InMemoryEventRepository } from './in-memory-event-repository'
import { InMemoryCheckInRepository } from './in-memory-checkIn-repository'

export class InMemoryAttendeeRepository implements AttendeeRepository {
  items: Attendee[] = []

  constructor(
    private eventRepository: InMemoryEventRepository,
    private checkInRepository: InMemoryCheckInRepository,
  ) {}

  async create(attendee: Attendee): Promise<Attendee> {
    const attendeeOnDatabase = Attendee.create(
      {
        email: attendee.email,
        name: attendee.name,
        createdAt: attendee.createdAt,
        eventId: attendee.eventId,
      },
      this.items.length + 1,
    )

    this.items.push(attendeeOnDatabase)
    return attendeeOnDatabase
  }

  async findById(id: number): Promise<Attendee | null> {
    const attendee = this.items.find((attendee) => attendee.id === id)
    if (!attendee) return null
    return attendee
  }

  async countByEventId(eventId: string): Promise<number> {
    const count = this.items.filter(
      (attendee) => attendee.eventId.toValue() === eventId,
    ).length

    return count
  }

  async findWithEventById(id: number): Promise<AttendeeWithEvent | null> {
    const attendeeOnDatabase = this.items.find((attendee) => attendee.id === id)

    if (!attendeeOnDatabase) return null

    const event = await this.eventRepository.findById(
      attendeeOnDatabase.eventId.toValue(),
    )

    return AttendeeWithEvent.create({
      id: attendeeOnDatabase.id,
      name: attendeeOnDatabase.name,
      email: attendeeOnDatabase.email,
      createdAt: attendeeOnDatabase.createdAt,
      eventTitle: event?.title || '',
    })
  }

  async findByEmailAndEventId(
    email: string,
    eventId: string,
  ): Promise<Attendee | null> {
    const attendeeOnDatabase = this.items.find(
      (attendee) =>
        attendee.email === email && attendee.eventId.toValue() === eventId,
    )

    if (!attendeeOnDatabase) return null

    return attendeeOnDatabase
  }

  async findManyWithCheckInByEventId(
    params: FindManyWithCheckInByEventIdParams,
  ): Promise<AttendeeWithCheckIn[]> {
    const { eventId, query, limit, page } = params

    let attendees = this.items.filter(
      (attendee) => attendee.eventId.toValue() === eventId,
    )

    if (query) {
      const filteredAttendees = attendees.filter((attendee) =>
        attendee.name.toLowerCase().includes(query.toLowerCase()),
      )

      attendees = filteredAttendees
    }

    const paginatedAttendees = this.paginate(attendees, limit, page)
    const paginatedAttendeesWithCheckIn = paginatedAttendees.map((attendee) => {
      const checkIn = this.checkInRepository.items.find(
        (item) => item.attendeeId === attendee.id,
      )
      return AttendeeWithCheckIn.create({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        createdAt: attendee.createdAt,
        checkInAt: checkIn?.createdAt ?? null,
      })
    })
    return paginatedAttendeesWithCheckIn.map((attendee) =>
      AttendeeWithCheckIn.create({
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        createdAt: attendee.createdAt,
        checkInAt: attendee.checkInAt,
      }),
    )
  }

  private paginate(list: Attendee[], limit = 10, page = 0) {
    return list.slice(limit * page, limit * (page + 1))
  }
}
