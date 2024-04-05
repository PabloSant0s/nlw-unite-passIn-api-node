import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { makeGetEvent } from '@/factories/make-get-event'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from './_errors/bad-request'

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',
    {
      schema: {
        tags: ['events'],
        summary: 'Get an Event',
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesCount: z.number().int(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params

      const getEventUseCase = makeGetEvent()

      const result = await getEventUseCase.execute({
        eventId,
      })

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case ResourceNotFoundError:
            throw new BadRequestError(error.message)
          default:
            throw new Error('Internal Server Error')
        }
      }

      const { attendeesCount, event } = result.value

      return reply.send({
        event: {
          id: event.id.toValue(),
          title: event.title,
          slug: event.slug.toValue(),
          details: event.details || null,
          maximumAttendees: event.maximumAttendees || null,
          attendeesCount,
        },
      })
    },
  )
}
