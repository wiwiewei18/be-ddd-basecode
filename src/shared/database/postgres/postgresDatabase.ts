import { Config } from '@shared/config';
import { logger } from '@shared/logger';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import type { Database, PostgresClient } from '../database';
import { databaseSchema } from './schemas';

const config = new Config().getDatabaseConfig();

const postgresConnection = new Client({
	host: config.host,
	database: config.database,
	user: config.user,
	password: config.password,
});

export class PostgresDatabase implements Database {
	private connection: Client;

	constructor() {
		this.connection = postgresConnection;
	}

	async connect(): Promise<void> {
		await this.connection.connect();
		logger.info(`${PostgresDatabase.name} connected`);
	}

	getConnection(): Client {
		return this.connection;
	}

	getClient(): PostgresClient {
		return drizzle(this.connection, { schema: databaseSchema });
	}

	async stop(): Promise<void> {
		await this.connection.end();
		logger.info(`${PostgresDatabase.name} stopped`);
	}
}
