import { DomainError } from '@/core/domain/errors/domain-error'

export class MaximumNumberOfAttendeesReachedError
  extends Error
  implements DomainError
{
  constructor(message?: string) {
    super(
      message ||
        'The maximum number of attendees for this event has been reached.',
    )
  }
}
