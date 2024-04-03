import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {z} from "zod";
import { generateSlug } from '../util/generate-slug';
import { prisma } from '../database/prisma-client';
import { BadRequestError } from './_errors/bad-request';

export async function createEvent(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post('/events', {
    schema: {
      tags: ['events'],
      summary: 'Create an event',
      body: z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid()
        })
      }
    }
  }, async(request, reply)=>{
  
    const { details, title, maximumAttendees } = request.body
  
    const slug = generateSlug(title)
  
    const eventWithSameSlug =await prisma.event.findUnique({
      where:{
        slug
      }
    })
  
    if(eventWithSameSlug) throw new BadRequestError('Another event with same title already exists')
  
    const event = await prisma.event.create({
      data:{
        title,
        details,
        maximumAttendees,
        slug
      }
    })
  
    return reply.status(201).send({
      eventId: event.id
    })
  })
  
}