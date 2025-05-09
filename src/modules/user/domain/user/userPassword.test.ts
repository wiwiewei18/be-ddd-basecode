import { describe, expect, it } from 'bun:test';
import { UserPassword } from './userPassword';

describe('UserPassword Unit', () => {
	it('should return success and the user password when given a valid user password', () => {
		const userPassword = '12345678';

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isSuccess).toBe(true);
		expect(userPasswordOrError.getValue().value).toBe(userPassword);
	});
});
