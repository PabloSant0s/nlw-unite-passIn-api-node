import { ValueObject } from '@/core/domain/value-object'

export interface AttendeeWithEventProps {
  id: number
  name: string
  email: string
  createdAt: Date
  eventTitle: string
}

export class AttendeeWithEvent extends ValueObject<AttendeeWithEventProps> {
  static create(props: AttendeeWithEventProps): AttendeeWithEvent {
    return new AttendeeWithEvent(props)
  }

  public get id() {
    return this.props.id
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

  public get eventTitle() {
    return this.props.eventTitle
  }
}
