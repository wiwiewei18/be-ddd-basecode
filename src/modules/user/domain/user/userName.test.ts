import { describe, expect, it } from 'bun:test';
import { UserName } from './userName';

describe('UserName Unit', () => {
	it('should return success and the user name when given a valid user name', () => {
		const userName = 'Monkey D Luffy';

		const userNameOrError = UserName.create(userName);

		expect(userNameOrError.isSuccess).toBe(true);
		expect(userNameOrError.getValue().value).toBe(userName);
	});

	it('should return fail when given an empty user name', () => {
		const userName = '';

		const userNameOrError = UserName.create(userName);

		expect(userNameOrError.isFailure).toBe(true);
	});
});
