import { beforeEach, describe, expect, it } from 'bun:test';
import type { User } from '@modules/user/domain/user/user';
import { UserPassword } from '@modules/user/domain/user/userPassword';
import { UserFixture } from '@modules/user/repos/tests/fixtures/userFixture';
import { InMemoryUserRepo } from '@modules/user/repos/userRepo/inMemoryUserRepo';
import type { UserRepo } from '@modules/user/repos/userRepo/userRepo';
import type { AuthService } from '@modules/user/services/authService/authService';
import { JWTAuthService } from '@modules/user/services/authService/jwtAuthService';
import { Config } from '@shared/config';
import { TextUtil } from '@shared/utils/textUtil';
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
    Scenario: Fail to sign in with an invalid email
        Given Unauthenticated user provides an invalid email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: 'invalid-user-email@mugiwara.com',
			password: user.password.value,
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign in with an invalid password
        Given Unauthenticated user provides an invalid password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: user.email.value,
			password: 'invalid-user-password',
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign in with an empty email
        Given Unauthenticated user provides an user with an empty email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: '',
			password: user.password.value,
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign in with an invalid format email
        Given Unauthenticated user provides an user with an invalid format email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: 'invalid-format-email',
			password: user.password.value,
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign in with an empty password
        Given Unauthenticated user provides an user with an empty password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: user.email.value,
			password: '',
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign in with a less than 8 chars password
        Given Unauthenticated user provides an user with a less than 8 chars password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: user.email.value,
			password: TextUtil.getRandomText(UserPassword.minLength - 1),
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign in with a more than 50 chars password
        Given Unauthenticated user provides an user with a more than 50 chars password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInRequest: SignInRequest = {
			email: user.email.value,
			password: TextUtil.getRandomText(UserPassword.maxLength + 1),
		};

		const signInResponse: SignInResponse = await signInUseCase.execute(signInRequest);

		expect(signInResponse.isLeft()).toBe(true);
	});
});
