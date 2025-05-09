import { CompositionRoot } from '@shared/compositionRoot';
import { Config } from '@shared/config';

const config = new Config();

const compositionRoot = CompositionRoot.create(config);

const webServer = compositionRoot.getWebServer();

export async function bootstrap() {
	webServer.start();
}
