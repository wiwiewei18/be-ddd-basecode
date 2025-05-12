import { Config } from '@shared/config';
import { defineConfig } from 'drizzle-kit';

const config = new Config().getDatabaseConfig();

export default defineConfig({
	dbCredentials: {
		host: config.host,
		user: config.user,
		password: config.password,
		database: config.database,
		ssl: false,
	},
	schema: './src/modules/**/*schema.ts',
	dialect: 'postgresql',
	out: './src/shared/database/postgres/migrations',
});
