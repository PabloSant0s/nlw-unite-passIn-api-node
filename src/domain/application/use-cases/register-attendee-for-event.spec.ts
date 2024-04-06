import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { makeAttendee } from '../../../../test/factories/make-attendee'
import { makeEvent } from '../../../../test/factories/make-event'
import { InMemoryAttendeeRepository } from '../../../../test/repositories/in-memory-attendee-repository'
import { InMemoryCheckInRepository } from '../../../../test/repositories/in-memory-checkIn-repository'
import { InMemoryEventRepository } from '../../../../test/repositories/in-memory-event-repository'
import { MaximumNumberOfAttendeesReachedError } from './errors/maximum-number-attendees-reached-error'
import { RegisterAttendeeForEventUseCase } from './register-attendee-for-event'
import { AttendeeAlreadyExistsError } from './errors/attendee-already-exists-error'

describe('Register Attendee for Event Use Case', () => {
  let eventRepository: InMemoryEventRepository
  let attendeeRepository: InMemoryAttendeeRepository
  let checkInRepository: InMemoryCheckInRepository
  let sut: RegisterAttendeeForEventUseCase

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository()
    attendeeRepository = new InMemoryAttendeeRepository(
      eventRepository,
      checkInRepository,
    )
    sut = new RegisterAttendeeForEventUseCase(
      attendeeRepository,
      eventRepository,
    )
  })

  it('should be able to register an attendee', async () => {
    const event = await eventRepository.create(makeEvent())
    const result = await sut.execute({
      email: 'John Doe',
      name: 'john.doe@example.com',
      eventId: event.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(attendeeRepository.items).toHaveLength(1)
    expect(result.value).toEqual(
      expect.objectContaining({
        attendee: attendeeRepository.items[0],
      }),
    )
  })
  it('should not be able to register an attendee if the maximum number of attendees is reached', async () => {
    const event = await eventRepository.create(
      makeEvent({
        maximumAttendees: 1,
      }),
    )
    await attendeeRepository.create(makeAttendee({ eventId: event.id }))
    const result = await sut.execute({
      email: 'John Doe',
      name: 'john.doe@example.com',
      eventId: event.id.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(MaximumNumberOfAttendeesReachedError)
  })

  it('should not be able to register an attendee if the event does not exist', async () => {
    const result = await sut.execute({
      email: 'John Doe',
      name: 'john.doe@example.com',
      eventId: 'uuid',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to register an attendee if the attendee already exists', async () => {
    const event = await eventRepository.create(makeEvent())
    const attendee = await attendeeRepository.create(
      makeAttendee({ eventId: event.id }),
    )
    const result = await sut.execute({
      email: attendee.email,
      name: attendee.name,
      eventId: event.id.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(AttendeeAlreadyExistsError)
  })
})
