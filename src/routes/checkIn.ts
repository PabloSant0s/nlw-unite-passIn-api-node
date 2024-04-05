import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { BadRequestError } from './_errors/bad-request'
import { makeCheckIn } from '@/factories/make-checkIn'
import { CheckInAlreadyCheckedError } from '@/domain/application/use-cases/errors/checkIn-already-checked-error'

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/check-in',
    {
      schema: {
        tags: ['check-ins'],
        summary: 'Check-in an attendee',
        params: z.object({
          attendeeId: z.coerce.number(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const checkInUseCase = makeCheckIn()

      const result = await checkInUseCase.execute({
        attendeeId,
      })

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case CheckInAlreadyCheckedError:
            throw new BadRequestError(error.message)
          default:
            throw new Error('Internal Server Error')
        }
      }

      return reply.status(201).send()
    },
  )
}
