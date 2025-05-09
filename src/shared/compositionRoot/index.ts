import type { Config } from '@shared/config';
import type { Database } from '@shared/database';
import { PostgresDatabase } from '@shared/database/postgres/PostgresDatabase';
import { WebServer } from '@shared/http/webServer';

export class CompositionRoot {
	private static instance: CompositionRoot | null = null;

	private config: Config;
	private webServer: WebServer;
	private database: Database;

	private constructor(config: Config) {
		this.config = config;
		this.webServer = new WebServer(this.config.getWebServerConfig());
		this.database = this.createDatabase();
	}

	static create(config: Config) {
		if (!CompositionRoot.instance) {
			CompositionRoot.instance = new CompositionRoot(config);
		}

		return CompositionRoot.instance;
	}

	getWebServer(): WebServer {
		return this.webServer;
	}

	getDatabase(): Database {
		if (!this.database) return this.createDatabase();

		return this.database;
	}

	private createDatabase(): Database {
		return new PostgresDatabase();
	}
}
