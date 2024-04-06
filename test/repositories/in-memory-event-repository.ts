import { EventRepository } from '@/domain/application/repositories/event-repository'
import { Event } from '@/domain/enterprise/entities/event'

export class InMemoryEventRepository implements EventRepository {
  items: Event[] = []
  async findBySlug(slug: string): Promise<Event | null> {
    const event = this.items.find((item) => item.slug.toValue() === slug)
    if (!event) return null
    return event
  }

  async findById(id: string): Promise<Event | null> {
    const event = this.items.find((item) => item.id.toValue() === id)
    if (!event) return null
    return event
  }

  async create(event: Event): Promise<Event> {
    this.items.push(event)
    return event
  }
}
