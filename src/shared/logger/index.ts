import { Config } from '@shared/config';
import pino from 'pino';

const config = new Config();

export const logger =
	config.getEnvironment() === 'test'
		? {
				error: () => {},
				info: () => {},
			}
		: pino(
				pino.transport({
					targets: [
						{
							level: 'error',
							target: 'pino/file',
							options: {
								colorize: false,
								destination: 'logs/error.log',
								translateTime: 'SYS:standard',
								mkdir: true,
							},
						},
						{
							level: 'info',
							target: 'pino/file',
							options: {
								colorize: false,
								destination: 'logs/all.log',
								translateTime: 'SYS:standard',
								mkdir: true,
							},
						},
						{
							target: 'pino-pretty',
							options: {
								colorize: true,
								ignore: 'pid,hostname',
							},
						},
					],
				}),
			);
