import { z } from '@hono/zod-openapi';
import { UserPassword } from '@modules/user/domain/user/userPassword';
import {
	BaseController,
	type ControllerRouteConfig,
	RequestMethod,
} from '@shared/http/baseController';
import type { Context, MiddlewareHandler } from 'hono';
import { type SignUpBodySchema, signUpBodySchema } from './signUpBodySchema';
import type { SignUpUseCase } from './signUpUseCase';

export class SignUpController extends BaseController {
	override path = '/sign-up';
	override method: RequestMethod = RequestMethod.Post;
	override middlewares?: MiddlewareHandler[] | undefined;

	constructor(private useCase: SignUpUseCase) {
		super();
	}

	protected override async executeImpl(context: Context): Promise<Response> {
		const input = await context.req.json<SignUpBodySchema>();

		const result = await this.useCase.execute({
			name: input.name,
			email: input.email,
			password: input.password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				default:
					return this.fail(context, error.getErrorValue());
			}
		}

		return this.ok(context);
	}

	protected override getRouteImpl(): ControllerRouteConfig {
		return {
			isNeedAuth: false,
			tagName: 'User',
			failureResponses: [
				{
					code: 400,
					errorName: `Password criteria doesn't meet`,
					schema: z.object({
						message: z.any().openapi({
							example: {
								password: `Password criteria is min ${UserPassword.minLength} chars`,
							},
						}),
					}),
				},
			],
			request: {
				body: signUpBodySchema,
			},
		};
	}
}
