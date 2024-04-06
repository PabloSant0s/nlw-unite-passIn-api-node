import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { makeAttendee } from '../../../../test/factories/make-attendee'
import { InMemoryAttendeeRepository } from '../../../../test/repositories/in-memory-attendee-repository'
import { InMemoryCheckInRepository } from '../../../../test/repositories/in-memory-checkIn-repository'
import { InMemoryEventRepository } from '../../../../test/repositories/in-memory-event-repository'
import { GetAttendeeBadgeUseCase } from './get-attendee-badge'

describe('Get Attendee Badge Use Case', () => {
  let eventRepository: InMemoryEventRepository
  let attendeeRepository: InMemoryAttendeeRepository
  let checkInRepository: InMemoryCheckInRepository
  let sut: GetAttendeeBadgeUseCase

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository()
    checkInRepository = new InMemoryCheckInRepository()
    attendeeRepository = new InMemoryAttendeeRepository(
      eventRepository,
      checkInRepository,
    )
    sut = new GetAttendeeBadgeUseCase(attendeeRepository)
  })

  it('should be able to get an attendee badge', async () => {
    const attendee = await attendeeRepository.create(makeAttendee())

    const response = await sut.execute({
      attendeeId: attendee.id,
      baseUrl: 'http://localhost:3000',
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.value).toHaveProperty('badge')
  })
  it('should not be able to get an attendee badge if the attendee does not exist', async () => {
    const response = await sut.execute({
      attendeeId: 1,
      baseUrl: 'http://localhost:3000',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
