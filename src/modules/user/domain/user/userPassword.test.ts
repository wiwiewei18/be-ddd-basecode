import { describe, expect, it } from 'bun:test';
import { TextUtil } from '@shared/utils/textUtil';
import { UserPassword } from './userPassword';

describe('UserPassword Unit', () => {
	it('should return success and the user password when given a valid user password', () => {
		const userPassword = '12345678';

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isSuccess).toBe(true);
		expect(userPasswordOrError.getValue().value).toBe(userPassword);
	});

	it('should return fail when given an empty user password', () => {
		const userPassword = '';

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isFailure).toBe(true);
	});

	it(`should return fail when given a less than ${UserPassword.minLength} user password`, () => {
		const userPassword = TextUtil.getRandomText(UserPassword.minLength - 1);

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isFailure).toBe(true);
	});

	it(`should return fail when given a more than ${UserPassword.maxLength} user password`, () => {
		const userPassword = TextUtil.getRandomText(UserPassword.maxLength + 1);

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isFailure).toBe(true);
	});

	it(`should return success and hashed user password when given a valid user password`, () => {
		const userPassword = '12346578';

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isSuccess).toBe(true);
		expect(userPasswordOrError.getValue().getHashedValue() !== userPassword).toBe(true);
	});
});
