import { z } from '@hono/zod-openapi';
import { UserPassword } from '@modules/user/domain/user/userPassword';

export const signUpBodySchema = z.object({
	name: z.string().openapi({
		param: {
			name: 'name',
			in: 'query',
			required: true,
		},
		type: 'string',
		example: 'Monkey D Luffy',
	}),
	email: z.string().openapi({
		param: {
			name: 'email',
			in: 'query',
			required: true,
		},
		type: 'string',
		example: 'monkeydluffy@mugiwara.com',
	}),
	password: z
		.string()
		.min(UserPassword.minLength, {
			message: `Password criteria is min ${UserPassword.minLength} chars`,
		})
		.max(UserPassword.maxLength, {
			message: `Password criteria is max ${UserPassword.maxLength} chars`,
		})
		.openapi({
			param: {
				name: 'password',
				in: 'query',
				required: true,
			},
			type: 'string',
			example: '12345678',
		}),
});

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>;
