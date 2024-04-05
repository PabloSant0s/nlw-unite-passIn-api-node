import { Either, left, right } from '@/core/logic/either'
import { EventRepository } from '../repositories/event-repository'
import { EventAlreadyExistsError } from './errors/event-already-exists-error'
import { Slug } from '@/domain/enterprise/value-objects/slug'
import { Event } from '@/domain/enterprise/entities/event'

export interface CreateEventUseCaseRequest {
  title: string
  details?: string | null
  maximumAttendees?: number | null
}

export type CreateEventUseCaseResponse = Either<
  EventAlreadyExistsError,
  {
    event: Event
  }
>

export class CreateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({
    title,
    details,
    maximumAttendees,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const slug = Slug.createFromText(title)

    const eventWithSameSlug = await this.eventRepository.findBySlug(
      slug.toValue(),
    )

    if (eventWithSameSlug) {
      return left(
        new EventAlreadyExistsError(
          'Another event with same title already exists',
        ),
      )
    }

    let event = Event.create({
      title,
      slug,
      details,
      maximumAttendees,
    })

    event = await this.eventRepository.create(event)

    return right({
      event,
    })
  }
}
