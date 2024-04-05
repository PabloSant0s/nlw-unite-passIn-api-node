import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { makeGetEventAttendees } from '@/factories/make-get-event-attendees'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from './_errors/bad-request'

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId/attendees',
    {
      schema: {
        tags: ['events'],
        summary: 'Get event attendees',
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          pageIndex: z.string().nullish().default('0').transform(Number),
          query: z.string().nullish(),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { pageIndex, query } = request.query

      const getEventAttendeesUseCase = makeGetEventAttendees()

      const result = await getEventAttendeesUseCase.execute({
        eventId,
        query: query ?? undefined,
        page: pageIndex,
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

      const { attendees } = result.value

      return reply.status(200).send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkInAt: attendee.checkInAt ?? null,
          }
        }),
      })
    },
  )
}
