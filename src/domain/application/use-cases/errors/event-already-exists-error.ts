import { DomainError } from '@/core/domain/errors/domain-error'
export class EventAlreadyExistsError extends Error implements DomainError {
  constructor(message?: string) {
    super(message || 'Event already exists')
  }
}
