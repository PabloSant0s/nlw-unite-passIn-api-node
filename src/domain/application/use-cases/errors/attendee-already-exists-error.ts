import { DomainError } from '@/core/domain/errors/domain-error'

export class AttendeeAlreadyExistsError extends Error implements DomainError {
  constructor(message?: string) {
    super(message || 'Attendee already exists')
  }
}
