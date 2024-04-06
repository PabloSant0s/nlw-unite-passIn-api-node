import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { makeAttendee } from '../../../../test/factories/make-attendee'
import { makeEvent } from '../../../../test/factories/make-event'
import { InMemoryAttendeeRepository } from '../../../../test/repositories/in-memory-attendee-repository'
import { InMemoryCheckInRepository } from '../../../../test/repositories/in-memory-checkIn-repository'
import { InMemoryEventRepository } from '../../../../test/repositories/in-memory-event-repository'
import { GetEventUseCase } from './get-event'

describe('Get Event Use Case', () => {
  let eventRepository: InMemoryEventRepository
  let attendeeRepository: InMemoryAttendeeRepository
  let checkInRepository: InMemoryCheckInRepository
  let sut: GetEventUseCase

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository()
    checkInRepository = new InMemoryCheckInRepository()
    attendeeRepository = new InMemoryAttendeeRepository(
      eventRepository,
      checkInRepository,
    )
    sut = new GetEventUseCase(eventRepository, attendeeRepository)
  })

  it('should be able to get an event', async () => {
    const event = makeEvent()
    await eventRepository.create(event)

    await attendeeRepository.create(
      makeAttendee({
        eventId: event.id,
      }),
    )

    const result = await sut.execute({
      eventId: event.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        event: eventRepository.items[0],
        attendeesCount: 1,
      }),
    )
  })

  it('should not be able to get an event that does not exist', async () => {
    const result = await sut.execute({
      eventId: 'invalid-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
