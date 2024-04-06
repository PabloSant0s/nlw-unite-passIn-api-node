import { UniqueEntityID } from '@/core/domain/unique-entity-id'
import { Event, EventProps } from '@/domain/enterprise/entities/event'
import { faker } from '@faker-js/faker'

export function makeEvent(
  props: Partial<EventProps> = {},
  id?: UniqueEntityID,
) {
  return Event.create(
    {
      title: props.title ?? faker.lorem.sentence({ min: 1, max: 3 }),
      details: props.details ?? faker.lorem.text(),
      maximumAttendees:
        props.maximumAttendees ?? faker.number.int({ min: 1, max: 300 }),
    },
    id,
  )
}
