import { z } from '@hono/zod-openapi';
import {
	BaseController,
	type ControllerRouteConfig,
	RequestMethod,
} from '@shared/http/baseController';
import type { Context, MiddlewareHandler } from 'hono';
import { type SignInBodySchema, signInBodySchema } from './signInBodySchema';
import { SignInErrors } from './signInErrors';
import { type SignInResponseSchema, signInResponseSchema } from './signInResponseSchema';
import type { SignInUseCase } from './signInUseCase';

export class SignInController extends BaseController {
	override path = '/sign-in';
	override method: RequestMethod = RequestMethod.Post;
	override middlewares?: MiddlewareHandler[] | undefined;

	constructor(private userCase: SignInUseCase) {
		super();
	}

	protected override async executeImpl(context: Context): Promise<Response> {
		const input = await context.req.json<SignInBodySchema>();

		const result = await this.userCase.execute({
			email: input.email,
			password: input.password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case SignInErrors.InvalidCredentials:
					return this.clientError(context, error.getErrorValue());
				default:
					return this.fail(context, error.getErrorValue());
			}
		}

		return this.ok<SignInResponseSchema>(context, result.value);
	}

	protected override getRouteImpl(): ControllerRouteConfig {
		return {
			isNeedAuth: false,
			tagName: 'User',
			request: {
				body: signInBodySchema,
			},
			successResponse: {
				code: 200,
				schema: signInResponseSchema,
			},
			failureResponses: [
				{
					code: 400,
					errorName: `Invalid credential`,
					schema: z.object({
						message: z.any().openapi({
							example: {
								password: `Invalid credentials. Please try again`,
							},
						}),
					}),
				},
			],
		};
	}
}
