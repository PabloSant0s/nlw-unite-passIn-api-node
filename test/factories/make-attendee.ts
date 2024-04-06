import { UniqueEntityID } from '@/core/domain/unique-entity-id'
import { Attendee, AttendeeProps } from '@/domain/enterprise/entities/attendee'
import { faker } from '@faker-js/faker'
export function makeAttendee(props: Partial<AttendeeProps> = {}, id?: number) {
  return Attendee.create(
    {
      name: props.name ?? faker.person.fullName(),
      email: props.email ?? faker.internet.email(),
      eventId: props.eventId ?? new UniqueEntityID(),
      createdAt: props.createdAt,
    },
    id,
  )
}
