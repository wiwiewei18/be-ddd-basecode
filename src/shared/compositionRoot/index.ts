import type { Config } from '@shared/config';
import { WebServer } from '@shared/http/webServer';

export class CompositionRoot {
	private static instance: CompositionRoot | null = null;

	private config: Config;
	private webServer: WebServer;

	private constructor(config: Config) {
		this.config = config;
		this.webServer = new WebServer(this.config.getWebServerConfig());
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
}
