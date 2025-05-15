import { z } from '@hono/zod-openapi';

export const userSchema = z.object({
	user_id: z.string(),
	name: z.string(),
});

export type UserDTO = z.infer<typeof userSchema>;
