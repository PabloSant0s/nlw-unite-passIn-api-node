import { CheckIn, CheckInProps } from '@/domain/enterprise/entities/check-in'
import { faker } from '@faker-js/faker'

export function makeCheckIn(props: Partial<CheckInProps> = {}, id?: number) {
  return CheckIn.create(
    {
      attendeeId: props.attendeeId ?? faker.number.int({ min: 1, max: 20 }),
      createdAt: props.createdAt,
    },
    id,
  )
}
