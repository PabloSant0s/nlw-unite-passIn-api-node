import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/domain/unique-entity-id'
import { Either, left, right } from '@/core/logic/either'
import { Attendee } from '@/domain/enterprise/entities/attendee'
import { AttendeeRepository } from '../repositories/attendee-repository'
import { EventRepository } from '../repositories/event-repository'
import { AttendeeAlreadyExistsError } from './errors/attendee-already-exists-error'
import { MaximumNumberOfAttendeesReachedError } from './errors/maximum-number-attendees-reached-error'

export interface RegisterAttendeeForEventUseCaseRequest {
  name: string
  email: string
  eventId: string
}

export type RegisterAttendeeForEventUseCaseResponse = Either<
  AttendeeAlreadyExistsError | ResourceNotFoundError,
  {
    attendee: Attendee
  }
>

export class RegisterAttendeeForEventUseCase {
  constructor(
    private attendeeRepository: AttendeeRepository,
    private eventRepository: EventRepository,
  ) {}

  async execute({
    email,
    name,
    eventId,
  }: RegisterAttendeeForEventUseCaseRequest): Promise<RegisterAttendeeForEventUseCaseResponse> {
    const attendeeWithSameEmail =
      await this.attendeeRepository.findByEmailAndEventId(email, eventId)

    if (attendeeWithSameEmail) {
      return left(
        new AttendeeAlreadyExistsError(
          'This e-mail is already registered for this event.',
        ),
      )
    }

    const [event, amountOfAttendeesForEvent] = await Promise.all([
      this.eventRepository.findById(eventId),
      this.attendeeRepository.countByEventId(eventId),
    ])

    if (!event) return left(new ResourceNotFoundError('Event not found'))

    if (
      event.maximumAttendees &&
      amountOfAttendeesForEvent >= event.maximumAttendees
    )
      return left(new MaximumNumberOfAttendeesReachedError())

    const attendee = await this.attendeeRepository.create(
      Attendee.create({
        email,
        eventId: new UniqueEntityID(eventId),
        name,
      }),
    )

    return right({
      attendee,
    })
  }
}
