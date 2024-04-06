import { makeEvent } from '../../../../test/factories/make-event'
import { InMemoryEventRepository } from '../../../../test/repositories/in-memory-event-repository'
import { CreateEventUseCase } from './create-event'
import { EventAlreadyExistsError } from './errors/event-already-exists-error'

describe('Create Event Use Case', () => {
  let eventRepository: InMemoryEventRepository
  let sut: CreateEventUseCase

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository()
    sut = new CreateEventUseCase(eventRepository)
  })

  it('should create a new event', async () => {
    const result = await sut.execute({
      title: 'Test Event',
      details: 'Details Event',
      maximumAttendees: 10,
    })

    expect(result.isRight()).toBeTruthy()
    expect(eventRepository.items).toHaveLength(1)
    expect(result.value).toEqual(
      expect.objectContaining({
        event: eventRepository.items[0],
      }),
    )
  })

  it('should not create a new event with same slug', async () => {
    const event = makeEvent({
      title: 'Test Event',
    })
    await eventRepository.create(event)

    const result = await sut.execute({
      title: 'Test Event',
      details: 'Details Event',
      maximumAttendees: 10,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(EventAlreadyExistsError)
  })
})
