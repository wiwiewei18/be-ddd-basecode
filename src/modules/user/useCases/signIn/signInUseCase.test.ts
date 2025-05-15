import { beforeEach, describe, expect, it } from 'bun:test';
import type { User } from '@modules/user/domain/user/user';
import { UserFixture } from '@modules/user/repos/tests/fixtures/userFixture';
import { InMemoryUserRepo } from '@modules/user/repos/userRepo/inMemoryUserRepo';
import type { UserRepo } from '@modules/user/repos/userRepo/userRepo';
import type { AuthService } from '@modules/user/services/authService/authService';
import { JWTAuthService } from '@modules/user/services/authService/jwtAuthService';
import { Config } from '@shared/config';
import { type SignInRequest, type SignInResponse, SignInUseCase } from './signInUseCase';

describe('SignUpUseCase Unit', () => {
	let userRepo: UserRepo;

	let authService: AuthService;

	let signInUseCase: SignInUseCase;

	let userFixture: UserFixture;

	let user: User;

	beforeEach(async () => {
		userRepo = new InMemoryUserRepo();

		const config = new Config();
		authService = new JWTAuthService(config.getAuthConfig());

		userFixture = new UserFixture(userRepo);
		const userFixtureResult = await userFixture.build();
		user = userFixtureResult.user;

		signInUseCase = new SignInUseCase(userRepo, authService);
	});

	it(`
    Scenario: Successfully sign in
        Given Unauthenticated user provides a valid user credential
        When Unauthenticated user attempts to sign in
        Then The user should be signed in successfully
    `, async () => {
		const signInRequest: SignInRequest = {
			email: user.email.value,
			password: user.password.value,
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isRight()).toBe(true);
	});

	it(`
    Scenario: Successfully sign in
        Given Unauthenticated user provides an invalid user credential
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: 'invalid-user-credential@mugiwara.com',
			password: 'invalid-user-credential',
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});
});
