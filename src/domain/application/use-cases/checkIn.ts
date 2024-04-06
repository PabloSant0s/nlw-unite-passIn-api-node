import { Either, left, right } from '@/core/logic/either'
import { CheckInAlreadyCheckedError } from './errors/checkIn-already-checked-error'
import { CheckInRepository } from '../repositories/checkIn-repository'
import { CheckIn } from '@/domain/enterprise/entities/check-in'
import { AttendeeRepository } from '../repositories/attendee-repository'
import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'

export interface CheckInUseCaseRequest {
  attendeeId: number
}

export type CheckInUseCaseResponse = Either<
  ResourceNotFoundError | CheckInAlreadyCheckedError,
  {
    checkIn: CheckIn
  }
>

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private attendeeRepository: AttendeeRepository,
  ) {}

  async execute({
    attendeeId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const attendee = await this.attendeeRepository.findById(attendeeId)

    if (!attendee) {
      return left(new ResourceNotFoundError('Attendee not found'))
    }

    const attendeeCheckIn =
      await this.checkInRepository.findByAttendeeId(attendeeId)

    if (attendeeCheckIn) {
      return left(new CheckInAlreadyCheckedError())
    }

    const checkIn = await this.checkInRepository.create(
      CheckIn.create({
        attendeeId,
      }),
    )

    return right({
      checkIn,
    })
  }
}
