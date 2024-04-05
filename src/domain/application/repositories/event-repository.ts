import { Event } from '@/domain/enterprise/entities/event'

export interface EventRepository {
  findBySlug(slug: string): Promise<Event | null>
  findById(id: string): Promise<Event | null>
  create(event: Event): Promise<Event>
}
