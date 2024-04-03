import fastify from "fastify";
import cors from '@fastify/cors'
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from 'fastify-type-provider-zod'
import { createEvent,  } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";

export const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)

// app.setErrorHandler((error, _, reply) => {
//   if (error instanceof ZodError) {
//     return reply
//       .status(400)
//       .send({ message: 'Validation Errors', issues: error.format() })
//   }

//   if (env.NODE_ENV !== 'production') {
//     console.error(error)
//   } else {
//     // TODO: Here we should log to on external tool like DataDog/NewRelic/Sentry
//   }

//   return reply.status(500).send({ message: 'Insternal Server Error.' })
// })