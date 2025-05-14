import { type RouteConfig, createRoute, z } from '@hono/zod-openapi';
import { logger } from '@shared/logger';
import type { Context, MiddlewareHandler } from 'hono';
import type { HttpAPIResponseFormat } from './httpAPIResponse';

export enum StatusCode {
	Ok = 200,
	Created = 201,
	BadRequest = 400,
	NotFound = 404,
	InternalServerError = 500,
}

export enum RequestMethod {
	Get = 'get',
	Post = 'post',
	Put = 'put',
	Patch = 'patch',
	Delete = 'delete',
}

export type ControllerRouteConfig = {
	isNeedAuth: boolean;
	tagName: string;
	request?: {
		queries?: {
			name: string;
			required: boolean;
			isArray?: boolean;
		}[];
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		body?: z.ZodObject<any>;
		params?: {
			name: string;
		};
	};
	successResponse?: ResponseFormat;
	failureResponses?: (ResponseFormat & { errorName: string })[];
	deprecated?: boolean;
};

type ResponseFormat = {
	code: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	schema: z.ZodObject<any>;
};

export abstract class BaseController {
	abstract path: string;
	abstract method: RequestMethod;
	abstract middlewares?: MiddlewareHandler[];

	protected abstract executeImpl(context: Context): Promise<Response>;

	async execute(context: Context): Promise<Response> {
		try {
			const res = await this.executeImpl(context);
			return res;
		} catch (error) {
			return this.fail(context, error as Error);
		}
	}

	protected abstract getRouteImpl(): ControllerRouteConfig;

	getRoute(): RouteConfig {
		const config = this.getRouteImpl();

		const security = config.isNeedAuth ? [{ authorizationToken: [] }] : undefined;

		const headers = config.isNeedAuth
			? z.object({
					authorization: z.string().openapi({
						example: `Bearer <jwt token> // don't input here, use lock icon on top right`,
					}),
				})
			: undefined;

		let responses = config.successResponse
			? {
					[config.successResponse.code.toString()]: {
						content: {
							'application/json': {
								schema: z.object({
									code: z.number().openapi({ example: config.successResponse.code }),
									data: config.successResponse.schema,
								}),
							},
						},
						description: 'Success',
					},
				}
			: {
					200: {
						content: {
							'application/json': {
								schema: z.object({
									code: z.number().openapi({ example: StatusCode.Ok }),
								}),
							},
						},
						description: 'Success',
					},
				};

		if (config.failureResponses) {
			for (const failureResponse of config.failureResponses) {
				responses = {
					...responses,
					[failureResponse.code.toString()]: {
						content: {
							'application/json': {
								schema: z.object({
									code: z.number().openapi({ example: failureResponse.code }),
									data: failureResponse.schema,
								}),
							},
						},
						description: failureResponse.errorName,
					},
				};
			}
		}

		const body = config.request?.body
			? {
					content: {
						'application/json': {
							schema: config.request.body,
						},
					},
				}
			: undefined;

		const params = config.request?.params
			? z.object({
					[config.request.params.name]: z.string().openapi({
						param: {
							name: config.request.params.name,
							in: 'path',
						},
						type: 'string',
						example: '1',
					}),
				})
			: undefined;

		let query = undefined;
		if (config.request?.queries) {
			const queryConfig: Record<
				string,
				| z.ZodOptional<z.ZodString>
				| z.ZodString
				| z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString>]>>>
				| z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString>]>>
			> = {};

			for (const query of config.request.queries) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				let querySchema: any;

				if (query.isArray) {
					querySchema = z
						.union([z.string(), z.array(z.string())])
						.transform((val) => (Array.isArray(val) ? val : [val]))
						.openapi({
							param: { name: query.name, in: 'query' },
							type: 'array',
							items: { type: 'string' },
						});
				} else {
					querySchema = z.string().openapi({
						param: { name: query.name, in: 'query' },
					});
				}

				if (!query.required) {
					querySchema = querySchema.optional();
				}

				queryConfig[query.name] = querySchema;
			}

			query = z.object(queryConfig);
		}

		const thisClass = Reflect.getPrototypeOf(this);
		const useCaseName = thisClass?.constructor.name.replace('Controller', '');

		return createRoute({
			method: this.method,
			path: this.path,
			security,
			summary: useCaseName,
			request: {
				headers,
				query,
				body,
				params,
			},
			responses,
			tags: [config.tagName],
			deprecated: config?.deprecated ?? false,
		});
	}

	static jsonResponse(context: Context, code: StatusCode, message: string) {
		const response: HttpAPIResponseFormat = {
			code,
			data: { message },
		};
		return context.json(response, code);
	}

	static plainTextResponse(context: Context, text: string) {
		return context.text(text);
	}

	ok<T>(context: Context, output?: T) {
		const response: HttpAPIResponseFormat = {
			code: StatusCode.Ok,
			data: output || null,
		};
		return context.json(response, StatusCode.Ok);
	}

	created(context: Context) {
		return BaseController.jsonResponse(context, StatusCode.Created, 'Created');
	}

	clientError(context: Context, message = 'Bad Request') {
		return BaseController.jsonResponse(context, StatusCode.BadRequest, message);
	}

	fail(context: Context, error: Error | string) {
		logger.error(error);

		const errorResponse =
			typeof error === 'string'
				? {
						message: error,
					}
				: {
						message: error.message,
						name: error.name,
						stacks: error.stack,
						cause: error.cause,
					};

		const response: HttpAPIResponseFormat = {
			code: StatusCode.InternalServerError,
			data: errorResponse,
		};

		return context.json(response, StatusCode.InternalServerError);
	}

	notFound(context: Context, message = 'Not Found') {
		return BaseController.jsonResponse(context, StatusCode.NotFound, message);
	}
}
