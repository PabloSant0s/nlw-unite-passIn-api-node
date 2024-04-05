import { DomainError } from '@/core/domain/errors/domain-error'

export class CheckInAlreadyCheckedError extends Error implements DomainError {
  constructor(message?: string) {
    super(message || 'Attendee already checked in!')
  }
}
