import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { UserPassword } from '@modules/user/domain/user/userPassword';
import type { SignInBodySchema } from '@modules/user/useCases/signIn/signInBodySchema';
import type { SignUpBodySchema } from '@modules/user/useCases/signUp/signUpBodySchema';
import { CompositionRoot } from '@shared/compositionRoot';
import { Config } from '@shared/config';
import { RESTfulAPIDriver } from '@shared/http/restfulAPIDriver';
import { TextUtil } from '@shared/utils/textUtil';

describe('SignIn E2E', () => {
	const config = new Config();
	const compositionRoot = CompositionRoot.create(config);
	const webServer = compositionRoot.getWebServer();

	let restfulAPIDriver: RESTfulAPIDriver;

	const name = 'Monkey D Luffy';
	const email = 'monkeydluffy@mugiwara.com';
	const password = '12345678';

	beforeAll(async () => {
		await webServer.start();

		restfulAPIDriver = new RESTfulAPIDriver();

		const signUpBodySchema: SignUpBodySchema = {
			name,
			email,
			password,
		};

		await restfulAPIDriver.post('/sign-up', signUpBodySchema);
	});

	afterAll(async () => {
		await webServer.stop();
	});

	test(`
    Scenario: Successfully sign in
        Given Unauthenticated user provides a valid user credential
        When Unauthenticated user attempts to sign in
        Then The user should be signed in successfully
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email,
			password,
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(true);
	});

	test(`
    Scenario: Fail to sign in with an invalid email
        Given Unauthenticated user provides an invalid email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email: 'invalid-user-email@mugiwara.com',
			password,
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign in with an invalid password
        Given Unauthenticated user provides an invalid password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email,
			password: 'invalid-user-password',
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign in with an empty email
        Given Unauthenticated user provides an user with an empty email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email: '',
			password,
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign in with an invalid format email
        Given Unauthenticated user provides an user with an invalid format email
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email: 'invalid-format-email',
			password,
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
	Scenario: Fail to sign in with an empty password
        Given Unauthenticated user provides an user with an empty password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email,
			password: '',
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign in with a less than 8 chars password
        Given Unauthenticated user provides an user with a less than 8 chars password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email,
			password: TextUtil.getRandomText(UserPassword.minLength - 1),
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});

	test(`
    Scenario: Fail to sign in with a more than 50 chars password
        Given Unauthenticated user provides an user with a more than 50 chars password
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email,
			password: TextUtil.getRandomText(UserPassword.maxLength + 1),
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});
});
