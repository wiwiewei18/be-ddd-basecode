import { describe, expect, it } from 'bun:test';
import { UserEmail } from './userEmail';

describe('UserEmail Unit', () => {
	it('should return success and the user email when given a valid user email', () => {
		const userEmail = 'monkeydluffy@mugiwara.com';

		const userEmailOrError = UserEmail.create(userEmail);

		expect(userEmailOrError.isSuccess).toBe(true);
		expect(userEmailOrError.getValue().value).toBe(userEmail);
	});
});
