import { z } from 'zod';

const envSchema = z.object({
  VITE_VERCEL_PROJECT_PRODUCTION_URL: z.string(),
  PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);
export default env;
