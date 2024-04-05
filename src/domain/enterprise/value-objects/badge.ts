import { ValueObject } from '@/core/domain/value-object'

export interface BadgeProps {
  name: string
  email: string
  eventTitle: string
  checkInUrl: string
}

export class Badge extends ValueObject<BadgeProps> {
  static create(props: BadgeProps): Badge {
    return new Badge(props)
  }

  public get name() {
    return this.props.name
  }

  public get email() {
    return this.props.email
  }

  public get eventTitle() {
    return this.props.eventTitle
  }

  public get checkInUrl() {
    return this.props.checkInUrl
  }
}
