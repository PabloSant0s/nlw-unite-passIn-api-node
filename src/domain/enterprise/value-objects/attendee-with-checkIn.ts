import { ValueObject } from '@/core/domain/value-object'

export interface AttendeeWithCheckInProps {
  id: number
  name: string
  email: string
  createdAt: Date
  checkInAt?: Date | null
}

export class AttendeeWithCheckIn extends ValueObject<AttendeeWithCheckInProps> {
  static create(props: AttendeeWithCheckInProps): AttendeeWithCheckIn {
    return new AttendeeWithCheckIn(props)
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

  public get checkInAt() {
    return this.props.checkInAt
  }
}
