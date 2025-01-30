import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeUpload(
  overrides?: Partial<InferInsertModel<typeof schema.uploads>>
) {
  const fileName = overrides?.name || faker.system.fileName()
  const remoteKey = `${randomUUID()}-${fileName}`
  const result = await db
    .insert(schema.uploads)
    .values({
      name: fileName,
      remoteKey: `images/${remoteKey}`,
      remoteUrl: `${faker.internet.url()}/${remoteKey}`,
      ...overrides,
    })
    .returning()
  return result[0]
}
