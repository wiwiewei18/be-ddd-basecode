import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Client } from 'pg';
import type { databaseSchema } from './postgres/schemas';

export type PostgresClient = NodePgDatabase<typeof databaseSchema>;

export interface Database {
	getConnection(): Client;
	connect(): Promise<void>;
	getClient(): PostgresClient;
	stop(): Promise<void>;
}
