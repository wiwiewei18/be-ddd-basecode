import type { WebServerConfig } from '@shared/http/webServer';

type Environment = 'development' | 'test' | 'production';

type DatabaseConfig = {
	host: string;
	database: string;
	user: string;
	password: string;
};

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

	getDatabaseConfig(): DatabaseConfig {
		return {
			host: this.getRequiredConfig('DB_HOST'),
			database: this.getRequiredConfig('DB_NAME'),
			user: this.getRequiredConfig('DB_USER'),
			password: this.getRequiredConfig('DB_PASSWORD'),
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
