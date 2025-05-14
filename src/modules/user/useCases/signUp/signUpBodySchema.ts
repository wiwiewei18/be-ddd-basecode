import { z } from '@hono/zod-openapi';
import { UserPassword } from '@modules/user/domain/user/userPassword';

export const signUpBodySchema = z.object({
	name: z
		.string()
		.nonempty('Name is required')
		.openapi({
			param: {
				name: 'name',
				in: 'query',
				required: true,
			},
			type: 'string',
			example: 'Monkey D Luffy',
		}),
	email: z
		.string()
		.nonempty('Email is required')
		.regex(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/,
			'Email format is invalid',
		)
		.openapi({
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
