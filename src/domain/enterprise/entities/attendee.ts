import { UniqueEntityID } from '@/core/domain/unique-entity-id'
import { Optional } from '@prisma/client/runtime/library'

export interface AttendeeProps {
  name: string
  email: string
  createdAt: Date
  eventId: UniqueEntityID
}

export class Attendee {
  private _id: number
  private props: AttendeeProps

  private constructor(props: AttendeeProps, id?: number) {
    this._id = id ?? NaN
    this.props = props
  }

  static create(props: Optional<AttendeeProps, 'createdAt'>, id?: number) {
    return new Attendee(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
  }

  public get id() {
    return this._id
  }

  public get name() {
    return this.props.name
  }

  public get email() {
    return this.props.email
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public get eventId() {
    return this.props.eventId
  }

  public equals(entity: Attendee) {
    if (entity === this) return true

    if (this._id && this._id === entity.id) return true

    return false
  }
}
