import { DomainError } from '@/core/domain/errors/domain-error'

export class ResourceNotFoundError extends Error implements DomainError {
  constructor(message?: string) {
    super(message || 'Resource not found')
  }
}
