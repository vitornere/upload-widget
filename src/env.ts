import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['test', 'development', 'production']).default('development'),
  DATABASE_URL: z.string().url().startsWith('postgres://').default('postgresql://docker:docker@localhost:5432/upload'),
});

export const env = envSchema.parse(process.env);
