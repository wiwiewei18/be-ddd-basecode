import type { AuthConfig } from '@modules/user/services/authService/jwtAuthService';
import type { WebServerConfig } from '@shared/http/webServer';

type Environment = 'development' | 'test' | 'production';

type DatabaseConfig = {
	host: string;
	user: string;
	password: string;
	database: string;
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
			user: this.getRequiredConfig('DB_USER'),
			password: this.getRequiredConfig('DB_PASSWORD'),
			database: this.getRequiredConfig('DB_NAME'),
		};
	}

	getAuthConfig(): AuthConfig {
		return {
			jwt: {
				secret: this.getRequiredConfig('JWT_SECRET'),
				tokenExpirationInMinute: Number(this.getRequiredConfig('JWT_TOKEN_EXPIRATION_IN_MINUTE')),
			},
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
