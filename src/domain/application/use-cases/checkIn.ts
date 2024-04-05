import { Either, left, right } from '@/core/logic/either'
import { CheckInAlreadyCheckedError } from './errors/checkIn-already-checked-error'
import { CheckInRepository } from '../repositories/checkIn-repository'
import { CheckIn } from '@/domain/enterprise/entities/check-in'

export interface CheckInUseCaseRequest {
  attendeeId: number
}

export type CheckInUseCaseResponse = Either<
  CheckInAlreadyCheckedError,
  {
    checkIn: CheckIn
  }
>

export class CheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    attendeeId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
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
