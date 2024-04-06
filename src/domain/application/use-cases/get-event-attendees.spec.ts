import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { CheckIn } from '@/domain/enterprise/entities/check-in'
import { makeAttendee } from '../../../../test/factories/make-attendee'
import { makeEvent } from '../../../../test/factories/make-event'
import { InMemoryAttendeeRepository } from '../../../../test/repositories/in-memory-attendee-repository'
import { InMemoryCheckInRepository } from '../../../../test/repositories/in-memory-checkIn-repository'
import { InMemoryEventRepository } from '../../../../test/repositories/in-memory-event-repository'
import { GetEventAttendeesUseCase } from './get-event-attendees'

describe('Get Event Attendees Use Case', () => {
  let eventRepository: InMemoryEventRepository
  let attendeeRepository: InMemoryAttendeeRepository
  let checkInRepository: InMemoryCheckInRepository
  let sut: GetEventAttendeesUseCase

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository()
    checkInRepository = new InMemoryCheckInRepository()
    attendeeRepository = new InMemoryAttendeeRepository(
      eventRepository,
      checkInRepository,
    )
    sut = new GetEventAttendeesUseCase(eventRepository, attendeeRepository)
  })

  it('should be able to get event attendees', async () => {
    const event = await eventRepository.create(
      makeEvent({
        maximumAttendees: 20,
      }),
    )

    const attendee = await attendeeRepository.create(
      makeAttendee({
        eventId: event.id,
      }),
    )

    await checkInRepository.create(
      CheckIn.create({
        attendeeId: attendee.id,
      }),
    )

    const response = await sut.execute({
      eventId: event.id.toValue(),
      page: 0,
      limit: 10,
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.attendees).toHaveLength(1)
  })

  it('should be able to get event attendees paginated', async () => {
    const event = await eventRepository.create(
      makeEvent({
        maximumAttendees: 20,
      }),
    )

    for (let index = 1; index <= 12; index++) {
      const attendee = await attendeeRepository.create(
        makeAttendee({
          eventId: event.id,
        }),
      )

      await checkInRepository.create(
        CheckIn.create({
          attendeeId: attendee.id,
        }),
      )
    }

    const response = await sut.execute({
      eventId: event.id.toValue(),
      page: 1,
      limit: 10,
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.attendees).toHaveLength(2)
  })

  it('should be able to get event attendees filtered', async () => {
    const event = await eventRepository.create(
      makeEvent({
        maximumAttendees: 20,
      }),
    )

    for (let index = 1; index <= 10; index++) {
      const attendee = await attendeeRepository.create(
        makeAttendee({
          eventId: event.id,
        }),
      )

      await checkInRepository.create(
        CheckIn.create({
          attendeeId: attendee.id,
        }),
      )
    }

    const attendee = await attendeeRepository.create(
      makeAttendee({
        eventId: event.id,
        name: 'John Smith',
      }),
    )

    await checkInRepository.create(
      CheckIn.create({
        attendeeId: attendee.id,
      }),
    )

    const response = await sut.execute({
      eventId: event.id.toValue(),
      query: 'Smith',
      page: 0,
      limit: 10,
    })

    expect(response.isRight()).toBeTruthy()
    expect(response.isRight() && response.value.attendees).toHaveLength(1)
  })

  it('should not be able to get event not found', async () => {
    const response = await sut.execute({
      eventId: 'uuid',
      page: 0,
      limit: 10,
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
