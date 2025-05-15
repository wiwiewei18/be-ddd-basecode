import { beforeEach, describe, expect, it } from 'bun:test';
import { UserPassword } from '@modules/user/domain/user/userPassword';
import { InMemoryUserRepo } from '@modules/user/repos/userRepo/inMemoryUserRepo';
import { TextUtil } from '@shared/utils/textUtil';
import { type SignUpRequest, type SignUpResponse, SignUpUseCase } from './signUpUseCase';

describe('SignUpUseCase Unit', () => {
	const name = 'Monkey D Luffy';
	const email = 'monkeydluffy@mugiwara.com';
	const password = '13245678';

	let signUpUseCase: SignUpUseCase;

	beforeEach(() => {
		const userRepo = new InMemoryUserRepo();

		signUpUseCase = new SignUpUseCase(userRepo);
	});

	it(`
    Scenario: Successfully sign up
        Given Unauthenticated user provides a valid user
        When Unauthenticated user attempts to sign up
        Then The user should be created successfully
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email,
			password,
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isRight()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with an empty name
        Given Unauthenticated user provides a user with an empty name
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name: '',
			email,
			password,
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with an empty email
        Given Unauthenticated user provides a user with an empty email
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email: '',
			password,
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with an invalid format email
        Given Unauthenticated user provides a user with an invalid format email
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email: 'invalid-format-email',
			password,
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with a taken email
        Given Unauthenticated user provides a user with a taken email
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email,
			password,
		};

		await signUpUseCase.execute(signUpRequest);
		const takenEmailSignUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(takenEmailSignUpResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with an empty password
        Given Unauthenticated user provides a user with an empty password
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email,
			password: '',
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with a less than 8 chars password
        Given Unauthenticated user provides a user with a less than 8 chars password
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email,
			password: TextUtil.getRandomText(UserPassword.minLength - 1),
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isLeft()).toBe(true);
	});

	it(`
    Scenario: Fail to sign up with a more than 50 chars password
        Given Unauthenticated user provides a user with a more than 50 chars password
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpRequest: SignUpRequest = {
			name,
			email,
			password: TextUtil.getRandomText(UserPassword.maxLength + 1),
		};

		const signUpResponse: SignUpResponse = await signUpUseCase.execute(signUpRequest);

		expect(signUpResponse.isLeft()).toBe(true);
	});
});
