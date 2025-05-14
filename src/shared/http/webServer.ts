import { networkInterfaces } from 'node:os';
import { swaggerUI } from '@hono/swagger-ui';
import { type Hook, OpenAPIHono } from '@hono/zod-openapi';
import { logger } from '@shared/logger';
import type { Server } from 'bun';
import type { Env, MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { logger as httpAPILogger } from 'hono/logger';
import type { BaseController } from './baseController';
import type { HttpAPIResponseFormat } from './httpAPIResponse';

export type WebServerConfig = {
	port: number;
};

type GeneralHook = Hook<unknown, Env, string, Response | undefined>;

export class WebServer {
	private instance: Server | undefined;

	private hono: OpenAPIHono;
	private state: 'stopped' | 'started';

	constructor(private config: WebServerConfig) {
		this.hono = new OpenAPIHono({
			defaultHook: this.onBodyRequestSchemaError(),
		});

		this.state = 'stopped';

		this.initializeServer();
	}

	private onBodyRequestSchemaError(): GeneralHook {
		return (result, context) => {
			if (result.success) return;

			const errors = result.error.flatten().fieldErrors;

			const response: HttpAPIResponseFormat = {
				code: 400,
				data: { message: this.formatErrors(errors) },
			};

			return context.json(response, 400);
		};
	}

	private formatErrors(errors: Record<string, string[] | undefined>): Record<string, unknown> {
		const errorMessages: Record<string, unknown> = {};

		for (const key of Object.keys(errors)) {
			errorMessages[key] = errors[key] ? errors[key][0] : null;
		}

		return errorMessages;
	}

	private initializeServer(): void {
		this.hono.get('/', (c) => c.text('Server is UP!'));

		this.setupSwaggerDocRoute();

		this.hono.use(httpAPILogger());

		this.hono.use(cors());
	}

	private setupSwaggerDocRoute(): void {
		this.hono.doc('/openapi-doc', () => ({
			openapi: '3.0.0',
			info: {
				version: '1.0.0',
				title: 'REST API Documentation',
			},
		}));

		this.hono.get('/doc', swaggerUI({ url: '/openapi-doc' }));

		this.hono.openAPIRegistry.registerComponent('securitySchemes', 'authorizationToken', {
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			in: 'header',
		});
	}

	async start(): Promise<void> {
		this.instance = Bun.serve({
			port: this.config.port,
			fetch: this.hono.fetch,
		});

		this.state = 'started';

		const nets = networkInterfaces();
		const wifiIPV4Address = nets['Wi-Fi']?.find((net) => net.family === 'IPv4')?.address;

		logger.info(
			`Server started at ${
				wifiIPV4Address
					? `http://${wifiIPV4Address}:${this.config.port}`
					: `port ${this.config.port}`
			}`,
		);
	}

	setupRoutes(controllers: BaseController[]) {
		for (const controller of controllers) {
			this.setUpMiddlewares(controller.path, controller.middlewares);

			this.hono.openapi(controller.getRoute(), async (context) => controller.execute(context));
		}
	}

	private setUpMiddlewares(path: string, middlewares?: MiddlewareHandler[]) {
		if (middlewares) {
			const subApp = new OpenAPIHono();

			for (const middleware of middlewares) {
				subApp.use(middleware);
			}

			this.hono.route(path, subApp);
		}
	}
}
