import { Entity } from '@/core/domain/entity'
import { Slug } from '../value-objects/slug'
import { Optional } from '@/core/logic/optional'
import { UniqueEntityID } from '@/core/domain/unique-entity-id'

export interface EventProps {
  title: string
  details?: string | null
  slug: Slug
  maximumAttendees?: number | null
}

export class Event extends Entity<EventProps> {
  static create(props: Optional<EventProps, 'slug'>, id?: UniqueEntityID) {
    return new Event(
      {
        ...props,
        slug: props.slug || Slug.createFromText(props.title),
      },
      id,
    )
  }

  public get title() {
    return this.props.title
  }

  public get slug() {
    return this.props.slug
  }

  public get details() {
    return this.props.details
  }

  public get maximumAttendees() {
    return this.props.maximumAttendees
  }
}
