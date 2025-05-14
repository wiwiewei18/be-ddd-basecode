import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { UserPassword } from '@modules/user/domain/user/userPassword';
import type { SignUpBodySchema } from '@modules/user/useCases/signUp/signUpBodySchema';
import { CompositionRoot } from '@shared/compositionRoot';
import { Config } from '@shared/config';
import { RESTfulAPIDriver } from '@shared/http/restfulAPIDriver';
import { TextUtil } from '@shared/utils/textUtil';

describe('SignUp E2E', () => {
	const config = new Config();
	const compositionRoot = CompositionRoot.create(config);
	const webServer = compositionRoot.getWebServer();

	let restfulAPIDriver: RESTfulAPIDriver;

	const name = 'Monkey D Luffy';
	const email = 'monkeydluffy@mugiwara.com';
	const password = '13245678';

	beforeAll(async () => {
		await webServer.start();

		restfulAPIDriver = new RESTfulAPIDriver();
	});

	afterAll(async () => {
		await webServer.stop();
	});

	test(`
    Scenario: Successfully sign up
        Given Unauthenticated user provides a valid user
        When Unauthenticated user attempts to sign up
        Then The user should be created successfully
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email,
			password,
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(true);
	});

	test(`
    Scenario: Fail to sign up with an empty name
        Given Unauthenticated user provides a user with an empty name
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name: '',
			email,
			password,
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign up with an empty email
        Given Unauthenticated user provides a user with an empty email
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email: '',
			password,
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign up with an invalid format email
        Given Unauthenticated user provides a user with an invalid format email
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email: 'invalid-format-email',
			password,
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign up with a taken email
        Given Unauthenticated user provides a user with a taken email
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email,
			password,
		};

		await restfulAPIDriver.post('/sign-up', signUpBodySchema);
		const takenEmailResponse = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(takenEmailResponse.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign up with an empty password
        Given Unauthenticated user provides a user with an empty password
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email,
			password: '',
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign up with a less than 8 chars password
        Given Unauthenticated user provides a user with a less than 8 chars password
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email,
			password: TextUtil.getRandomText(UserPassword.minLength - 1),
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign up with a more than 50 chars password
        Given Unauthenticated user provides a user with a more than 50 chars password
        When Unauthenticated user attempts to sign up
        Then The user should be not be created
    `, async () => {
		const signUpBodySchema: SignUpBodySchema = {
			name,
			email,
			password: TextUtil.getRandomText(UserPassword.maxLength + 1),
		};

		const response = await restfulAPIDriver.post('/sign-up', signUpBodySchema);

		expect(response.ok).toBe(false);
	});
});
