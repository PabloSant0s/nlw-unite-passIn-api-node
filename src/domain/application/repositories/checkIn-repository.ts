import { CheckIn } from '@/domain/enterprise/entities/check-in'

export interface CheckInRepository {
  create(checkIn: CheckIn): Promise<CheckIn>
  findByAttendeeId(attendeeId: number): Promise<CheckIn | null>
}
