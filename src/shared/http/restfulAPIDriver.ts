import { Config } from '@shared/config';

export class RESTfulAPIDriver {
	private port: number;

	constructor() {
		const config = new Config();
		const webServerConfig = config.getWebServerConfig();
		this.port = webServerConfig.port;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	async post(url: string, data: any) {
		return fetch(`http://localhost:${this.port}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	}
}
