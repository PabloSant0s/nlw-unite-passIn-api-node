import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { Either, left, right } from '@/core/logic/either'
import { AttendeeWithCheckIn } from '@/domain/enterprise/value-objects/attendee-with-checkIn'
import { EventRepository } from '../repositories/event-repository'
import { AttendeeRepository } from '../repositories/attendee-repository'

export interface GetEventAttendeesUseCaseRequest {
  eventId: string
  query?: string
  page?: number
  limit?: number
}
export type GetEventAttendeesUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    attendees: AttendeeWithCheckIn[]
  }
>

export class GetEventAttendeesUseCase {
  constructor(
    private eventRepository: EventRepository,
    private attendeesRepository: AttendeeRepository,
  ) {}

  async execute({
    eventId,
    query,
    page,
    limit,
  }: GetEventAttendeesUseCaseRequest): Promise<GetEventAttendeesUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId)

    if (!event) return left(new ResourceNotFoundError('Event not found!'))

    const attendees =
      await this.attendeesRepository.findManyWithCheckInByEventId({
        eventId,
        query,
        limit,
        page,
      })

    return right({
      attendees,
    })
  }
}
