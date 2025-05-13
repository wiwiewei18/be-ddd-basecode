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

	it(`should return fail when given a less than ${UserPassword.minLength} chars user password`, () => {
		const userPassword = TextUtil.getRandomText(UserPassword.minLength - 1);

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isFailure).toBe(true);
	});

	it(`should return fail when given a more than ${UserPassword.maxLength} chars user password`, () => {
		const userPassword = TextUtil.getRandomText(UserPassword.maxLength + 1);

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.isFailure).toBe(true);
	});

	it('should return hashed user password when given a valid user password', () => {
		const userPassword = '12346578';

		const userPasswordOrError = UserPassword.create({ value: userPassword });

		expect(userPasswordOrError.getValue().getHashedValue() !== userPassword).toBe(true);
	});

	it('should return true when given a correct password', () => {
		const userPassword = '12345678';

		const userPasswordOrError = UserPassword.create({ value: userPassword });
		const hashedUserPassword = userPasswordOrError.getValue().getHashedValue();
		const hashedUserPasswordOrError = UserPassword.create({
			value: hashedUserPassword,
			isHashed: true,
		});

		expect(userPasswordOrError.getValue().comparePassword(userPassword)).toBe(true);
		expect(hashedUserPasswordOrError.getValue().comparePassword(userPassword)).toBe(true);
	});

	it('should return false when given an incorrect password', () => {
		const userPassword = '12345678';
		const inCorrectUserPassword = 'incorrect-user-password';

		const userPasswordOrError = UserPassword.create({ value: userPassword });
		const hashedUserPassword = userPasswordOrError.getValue().getHashedValue();
		const hashedUserPasswordOrError = UserPassword.create({
			value: hashedUserPassword,
			isHashed: true,
		});

		expect(userPasswordOrError.getValue().comparePassword(inCorrectUserPassword)).toBe(false);
		expect(hashedUserPasswordOrError.getValue().comparePassword(inCorrectUserPassword)).toBe(false);
	});
});
