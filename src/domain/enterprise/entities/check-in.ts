import { Optional } from '@prisma/client/runtime/library'

export interface CheckInProps {
  attendeeId: number
  createdAt: Date
}

export class CheckIn {
  private _id: number
  private props: CheckInProps

  private constructor(props: CheckInProps, id?: number) {
    this._id = id ?? NaN
    this.props = props
  }

  static create(props: Optional<CheckInProps, 'createdAt'>, id?: number) {
    return new CheckIn(
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

  public get attendeeId() {
    return this.props.attendeeId
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public equals(checkIn: CheckIn) {
    if (this === checkIn) return true

    if (this._id && checkIn._id === this._id) return true

    return false
  }
}
