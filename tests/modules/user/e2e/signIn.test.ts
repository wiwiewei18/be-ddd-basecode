import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { SignInBodySchema } from '@modules/user/useCases/signIn/signInBodySchema';
import type { SignUpBodySchema } from '@modules/user/useCases/signUp/signUpBodySchema';
import { CompositionRoot } from '@shared/compositionRoot';
import { Config } from '@shared/config';
import { RESTfulAPIDriver } from '@shared/http/restfulAPIDriver';

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
    Scenario: Successfully sign in
        Given Unauthenticated user provides an invalid user credential
        When Unauthenticated user attempts to sign in
        Then The user should not be signed in
    `, async () => {
		const signInBodySchema: SignInBodySchema = {
			email: 'invalid-user-credential@mugiwara.com',
			password: 'invalid-user-credential',
		};

		const response = await restfulAPIDriver.post('/sign-in', signInBodySchema);

		expect(response.ok).toBe(false);
	});
});
