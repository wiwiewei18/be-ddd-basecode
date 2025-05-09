import type { WebServerConfig } from '@shared/http/webServer';

type Environment = 'development' | 'test' | 'production';

export class Config {
	private env: Environment;

	constructor() {
		this.env = (process.env.NODE_ENV as Environment) || 'development';
	}

	getEnvironment(): Environment {
		return this.env;
	}

	getWebServerConfig(): WebServerConfig {
		return {
			port: Number(this.getRequiredConfig('PORT')),
		};
	}

	private getRequiredConfig(name: string): string {
		const configValue = process.env[name];

		if (!configValue) {
			throw new Error(`${name} is a required environment variable`);
		}

		return configValue;
	}
}
