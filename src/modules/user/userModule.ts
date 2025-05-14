import type { Config } from '@shared/config';
import type { Database } from '@shared/database';
import type { WebServer } from '@shared/http/webServer';
import { InMemoryUserRepo } from './repos/userRepo/inMemoryUserRepo';
import { PostgresUserRepo } from './repos/userRepo/postgresUserRepo';
import type { UserRepo } from './repos/userRepo/userRepo';
import { SignUpController } from './useCases/signUp/signUpController';
import { SignUpUseCase } from './useCases/signUp/signUpUseCase';

export class UserModule {
	private userRepo: UserRepo;

	constructor(
		private config: Config,
		private database: Database,
	) {
		this.userRepo = this.createUserRepo();
	}

	static build(config: Config, database: Database) {
		return new UserModule(config, database);
	}

	mountRouter(webServer: WebServer) {
		webServer.setupRoutes([this.createSignUpController()]);
	}

	private createSignUpController() {
		return new SignUpController(this.createSignUpUseCase());
	}

	private createSignUpUseCase() {
		return new SignUpUseCase(this.createUserRepo());
	}

	private createUserRepo() {
		if (this.userRepo) return this.userRepo;

		return this.config.getEnvironment() === 'test'
			? new InMemoryUserRepo()
			: new PostgresUserRepo(this.database);
	}
}
