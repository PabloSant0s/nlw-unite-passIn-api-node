import { PaginatorParams } from '@/core/domain/repositories/paginator-params'
import { Attendee } from '@/domain/enterprise/entities/attendee'
import { AttendeeWithCheckIn } from '@/domain/enterprise/value-objects/attendee-with-checkIn'
import { AttendeeWithEvent } from '@/domain/enterprise/value-objects/attendee-with-event'

export interface FindManyWithCheckInByEventIdParams extends PaginatorParams {
  eventId: string
  query?: string
}

export interface AttendeeRepository {
  create(attendee: Attendee): Promise<Attendee>
  findById(id: number): Promise<Attendee | null>
  countByEventId(eventId: string): Promise<number>
  findWithEventById(id: number): Promise<AttendeeWithEvent | null>
  findByEmailAndEventId(
    email: string,
    eventId: string,
  ): Promise<Attendee | null>
  findManyWithCheckInByEventId(
    params: FindManyWithCheckInByEventIdParams,
  ): Promise<AttendeeWithCheckIn[]>
}
