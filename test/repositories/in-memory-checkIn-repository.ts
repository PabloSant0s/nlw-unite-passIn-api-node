import { CheckInRepository } from '@/domain/application/repositories/checkIn-repository'
import { CheckIn } from '@/domain/enterprise/entities/check-in'

export class InMemoryCheckInRepository implements CheckInRepository {
  items: CheckIn[] = []
  async create(checkIn: CheckIn): Promise<CheckIn> {
    const checkInOnDatabase = CheckIn.create(
      {
        attendeeId: checkIn.attendeeId,
        createdAt: new Date(checkIn.createdAt),
      },
      this.items.length + 1,
    )
    this.items.push(checkInOnDatabase)
    return checkInOnDatabase
  }

  async findByAttendeeId(attendeeId: number): Promise<CheckIn | null> {
    const checkIn = this.items.find((item) => item.attendeeId === attendeeId)
    if (!checkIn) return null
    return checkIn
  }
}
