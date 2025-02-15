import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image.',
        tags: ['uploads'],
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ url: z.string() }).describe('Image uploaded'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 2, // 2MB
        },
      })

      if (!uploadedFile) {
        return reply.code(400).send({
          message: 'File is required.',
        })
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (uploadedFile.file.truncated) {
        return reply.code(400).send({
          message: 'File size limit reached.',
        })
      }

      if (isRight(result)) {
        return reply.code(201).send({
          url: result.right.url,
        })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidFileFormat':
          return reply.code(400).send({
            message: error.message,
          })
      }
    }
  )
}
