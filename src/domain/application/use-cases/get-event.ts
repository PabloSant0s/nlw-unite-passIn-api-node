import { Either, left, right } from '@/core/logic/either'
import { Event } from '@/domain/enterprise/entities/event'
import { EventRepository } from '../repositories/event-repository'
import { AttendeeRepository } from '../repositories/attendee-repository'
import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'

export interface GetEventUseCaseRequest {
  eventId: string
}

export type GetEventUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    event: Event
    attendeesCount: number
  }
>

export class GetEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private attendeesRepository: AttendeeRepository,
  ) {}

  async execute({
    eventId,
  }: GetEventUseCaseRequest): Promise<GetEventUseCaseResponse> {
    const [event, attendeesCount] = await Promise.all([
      this.eventRepository.findById(eventId),
      this.attendeesRepository.countByEventId(eventId),
    ])

    if (!event) return left(new ResourceNotFoundError('Event not found'))

    return right({
      event,
      attendeesCount,
    })
  }
}
