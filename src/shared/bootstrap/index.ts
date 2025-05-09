import { CompositionRoot } from '@shared/compositionRoot';
import { Config } from '@shared/config';

const config = new Config();

const compositionRoot = CompositionRoot.create(config);

const webServer = compositionRoot.getWebServer();

export const database = compositionRoot.getDatabase();

export async function bootstrap() {
	database.connect();
	webServer.start();
}
