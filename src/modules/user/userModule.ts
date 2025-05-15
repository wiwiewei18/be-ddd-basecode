import type { Config } from '@shared/config';
import type { Database } from '@shared/database';
import type { WebServer } from '@shared/http/webServer';
import { InMemoryUserRepo } from './repos/userRepo/inMemoryUserRepo';
import { PostgresUserRepo } from './repos/userRepo/postgresUserRepo';
import type { UserRepo } from './repos/userRepo/userRepo';
import type { AuthService } from './services/authService/authService';
import { JWTAuthService } from './services/authService/jwtAuthService';
import { SignInController } from './useCases/signIn/signInController';
import { SignInUseCase } from './useCases/signIn/signInUseCase';
import { SignUpController } from './useCases/signUp/signUpController';
import { SignUpUseCase } from './useCases/signUp/signUpUseCase';

export class UserModule {
	private userRepo: UserRepo;

	private authService: AuthService;

	constructor(
		private config: Config,
		private database: Database,
	) {
		this.userRepo = this.createUserRepo();

		this.authService = this.createAuthService();
	}

	static build(config: Config, database: Database) {
		return new UserModule(config, database);
	}

	mountRouter(webServer: WebServer) {
		webServer.setupRoutes([this.createSignUpController(), this.createSignInController()]);
	}

	private createSignUpController() {
		return new SignUpController(this.createSignUpUseCase());
	}

	private createSignInController() {
		return new SignInController(this.createSignInUseCase());
	}

	private createSignUpUseCase() {
		return new SignUpUseCase(this.createUserRepo());
	}

	private createSignInUseCase() {
		return new SignInUseCase(this.createUserRepo(), this.createAuthService());
	}

	private createUserRepo() {
		if (this.userRepo) return this.userRepo;

		return this.config.getEnvironment() === 'test'
			? new InMemoryUserRepo()
			: new PostgresUserRepo(this.database);
	}

	private createAuthService(): AuthService {
		if (this.authService) return this.authService;

		return new JWTAuthService(this.config.getAuthConfig());
	}
}
