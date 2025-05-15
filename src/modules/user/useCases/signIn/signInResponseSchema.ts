import { z } from '@hono/zod-openapi';
import { tokenSchema } from '@modules/user/dtos/tokenDTO';
import { userSchema } from '@modules/user/dtos/userDTO';

export const signInResponseSchema = z.object({
	user: userSchema,
	token: tokenSchema,
});

export type SignInResponseSchema = z.infer<typeof signInResponseSchema>;
