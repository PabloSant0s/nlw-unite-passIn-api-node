import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { makeGetAttendeeBadge } from '@/factories/make-get-attendee-badge'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from './_errors/bad-request'

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/badge',
    {
      schema: {
        tags: ['attendees'],
        summary: 'Get attendee badge',
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string().min(4),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const baseUrl = `${request.protocol}://${request.hostname}`

      const getAttendeeBadgeUseCase = makeGetAttendeeBadge()

      const result = await getAttendeeBadgeUseCase.execute({
        attendeeId,
        baseUrl,
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

      const { badge } = result.value

      return reply.send({
        badge: {
          name: badge.name,
          email: badge.email,
          eventTitle: badge.eventTitle,
          checkInUrl: badge.checkInUrl,
        },
      })
    },
  )
}
