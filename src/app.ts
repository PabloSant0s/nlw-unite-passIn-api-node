import fastify from "fastify";
import cors from '@fastify/cors'
import { ZodError, z } from "zod";
import { env } from "./env";
import { prisma } from "./database/prisma-client";

export const app = fastify()

app.register(cors, {
  origin: '*'
})

app.post('/events', async(req, rep)=>{
  const bodySchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable()
  })

  const { details, title, maximumAttendees } = bodySchema.parse(req.body)

  const event = await prisma.event.create({
    data:{
      title,
      details,
      maximumAttendees,
      slug: new Date().toISOString()
    }
  })

  return rep.status(201).send({
    eventId: event.id
  })
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Errors', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to on external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Insternal Server Error.' })
})