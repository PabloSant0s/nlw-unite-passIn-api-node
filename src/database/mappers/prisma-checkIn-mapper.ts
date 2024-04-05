import { CheckIn } from '@/domain/enterprise/entities/check-in'
import { Prisma, CheckIn as PrismaCheckIn } from '@prisma/client'
export class PrismaCheckInMapper {
  static toDomain(raw: PrismaCheckIn): CheckIn {
    return CheckIn.create(
      {
        attendeeId: raw.attendeeId,
        createdAt: new Date(raw.createdAt),
      },
      raw.id,
    )
  }

  static toPrisma(checkIn: CheckIn): Prisma.CheckInUncheckedCreateInput {
    const id = isNaN(checkIn.id) ? undefined : checkIn.id
    return {
      id,
      attendeeId: checkIn.attendeeId,
      createdAt: checkIn.createdAt,
    }
  }
}
