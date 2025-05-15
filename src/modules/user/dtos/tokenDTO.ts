import { z } from '@hono/zod-openapi';

export const tokenSchema = z.object({
	access: z.string(),
	expires: z.string(),
});

export type TokenDTO = z.infer<typeof tokenSchema>;
