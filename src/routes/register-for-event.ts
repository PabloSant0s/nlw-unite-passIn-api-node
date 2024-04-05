import { ResourceNotFoundError } from '@/core/domain/errors/resource-not-found-error'
import { AttendeeAlreadyExistsError } from '@/domain/application/use-cases/errors/attendee-already-exists-error'
import { makeRegisterForEvent } from '@/factories/make-register-for-event'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from './_errors/bad-request'

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        tags: ['attendees'],
        summary: 'Register an attendee',
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const registerForEventUseCase = makeRegisterForEvent()

      const result = await registerForEventUseCase.execute({
        email,
        eventId,
        name,
      })

      if (result.isLeft()) {
        const error = result.value
        console.log(error)
        switch (error.constructor) {
          case ResourceNotFoundError:
            throw new BadRequestError(error.message)
          case AttendeeAlreadyExistsError:
            throw new BadRequestError(error.message)
          default:
            throw new Error('Internal Server Error')
        }
      }

      const { attendee } = result.value

      return reply.status(201).send({
        attendeeId: attendee.id,
      })
    },
  )
}
