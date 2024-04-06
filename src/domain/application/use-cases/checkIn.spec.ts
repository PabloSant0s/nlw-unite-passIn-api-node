import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { Attendee } from '@/domain/enterprise/entities/attendee'
import { CheckIn } from '@/domain/enterprise/entities/check-in'
import { makeAttendee } from '../../../../test/factories/make-attendee'
import { makeEvent } from '../../../../test/factories/make-event'
import { InMemoryAttendeeRepository } from '../../../../test/repositories/in-memory-attendee-repository'
import { InMemoryCheckInRepository } from '../../../../test/repositories/in-memory-checkIn-repository'
import { InMemoryEventRepository } from '../../../../test/repositories/in-memory-event-repository'
import { CheckInUseCase } from './checkIn'
import { CheckInAlreadyCheckedError } from './errors/checkIn-already-checked-error'

describe('CheckIn Use Case', () => {
  let eventRepository: InMemoryEventRepository
  let attendeeRepository: InMemoryAttendeeRepository
  let checkInRepository: InMemoryCheckInRepository
  let sut: CheckInUseCase

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository()
    checkInRepository = new InMemoryCheckInRepository()
    attendeeRepository = new InMemoryAttendeeRepository(
      eventRepository,
      checkInRepository,
    )
    sut = new CheckInUseCase(checkInRepository, attendeeRepository)
  })

  it('should be able to check in an attendee', async () => {
    const event = makeEvent()
    await eventRepository.create(event)

    const attendee = await attendeeRepository.create(
      Attendee.create(makeAttendee({ eventId: event.id })),
    )

    const result = await sut.execute({
      attendeeId: attendee.id,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        checkIn: checkInRepository.items[0],
      }),
    )
  })

  it('should not be able to check in an attendee that already checked in', async () => {
    const event = makeEvent()
    await eventRepository.create(event)

    const attendee = await attendeeRepository.create(
      Attendee.create(makeAttendee({ eventId: event.id })),
    )

    await checkInRepository.create(
      CheckIn.create({
        attendeeId: attendee.id,
      }),
    )

    const result = await sut.execute({
      attendeeId: attendee.id,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(CheckInAlreadyCheckedError)
  })

  it('should not be able to check in an attendee that does not exist', async () => {
    const event = makeEvent()
    await eventRepository.create(event)

    const result = await sut.execute({
      attendeeId: 1,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
