import { getUploads } from '@/app/functions/get-uploads'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getUploadsRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/uploads',
    {
      schema: {
        summary: 'Get uploads.',
        tags: ['uploads'],
        querystring: z.object({
          page: z.coerce.number().min(1).optional().default(1),
          searchQuery: z.string().optional(),
          sortBy: z.enum(['createdAt']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            uploads: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                remoteKey: z.string(),
                remoteUrl: z.string(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, searchQuery, sortBy, sortDirection, pageSize } =
        request.query

      const result = await getUploads({
        page,
        searchQuery,
        sortBy,
        sortDirection,
        pageSize,
      })

      const { uploads, total } = unwrapEither(result)

      return reply.code(200).send({
        uploads,
        total,
      })
    }
  )
}
