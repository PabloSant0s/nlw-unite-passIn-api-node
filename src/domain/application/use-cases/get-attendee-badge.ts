import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { Either, left, right } from '@/core/logic/either'
import { Badge } from '@/domain/enterprise/value-objects/badge'
import { AttendeeRepository } from '../repositories/attendee-repository'

export interface GetAttendeeBadgeUseCaseRequest {
  attendeeId: number
  baseUrl: string
}

export type GetAttendeeBadgeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    badge: Badge
  }
>

export class GetAttendeeBadgeUseCase {
  constructor(private attendeeRepository: AttendeeRepository) {}

  async execute({
    attendeeId,
    baseUrl,
  }: GetAttendeeBadgeUseCaseRequest): Promise<GetAttendeeBadgeUseCaseResponse> {
    const attendee = await this.attendeeRepository.findWithEventById(attendeeId)

    if (!attendee) {
      return left(new ResourceNotFoundError('Attendee not found'))
    }

    const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseUrl)

    const badge = Badge.create({
      checkInUrl: checkInUrl.toString(),
      email: attendee.email,
      eventTitle: attendee.eventTitle,
      name: attendee.name,
    })

    return right({
      badge,
    })
  }
}
