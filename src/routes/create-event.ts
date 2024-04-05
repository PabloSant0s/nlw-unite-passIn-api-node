import { EventAlreadyExistsError } from '@/domain/application/use-cases/errors/event-already-exists-error'
import { makeCreateEvent } from '@/factories/make-create-event'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from './_errors/bad-request'

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        tags: ['events'],
        summary: 'Create an event',
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { details, title, maximumAttendees } = request.body

      const createEventUseCase = makeCreateEvent()

      const result = await createEventUseCase.execute({
        title,
        details,
        maximumAttendees,
      })

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case EventAlreadyExistsError:
            throw new BadRequestError(error.message)
          default:
            throw new Error('Internal Server Error')
        }
      }

      const { event } = result.value

      return reply.status(201).send({
        eventId: event.id.toValue(),
      })
    },
  )
}
