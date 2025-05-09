import { beforeEach, describe, expect, it } from 'bun:test';
import { User, type UserProps } from './user';
import { UserName } from './userName';

describe('User Unit', () => {
	let name: UserName;
	let email: string;
	let password: string;

	beforeEach(() => {
		name = UserName.create('Monkey D Luffy').getValue();
		email = 'monkeydluffy@mugiwara.com';
		password = '1234578';
	});

	it('should return success and the user when given a valid user props', () => {
		const userProps: UserProps = {
			name,
			email,
			password,
		};

		const userOrError = User.create(userProps);

		expect(userOrError.isSuccess).toBe(true);
		const user = userOrError.getValue();
		expect(user.name.equals(name)).toBe(true);
		expect(user.email).toBe(email);
		expect(user.password).toBe(password);
	});

	it('should return fail when given a user props with an empty email', () => {
		const userProps: UserProps = {
			name,
			email: '',
			password,
		};

		const userOrError = User.create(userProps);

		expect(userOrError.isFailure).toBe(true);
	});

	it('should return fail when given a user props with an empty password', () => {
		const userProps: UserProps = {
			name,
			email,
			password: '',
		};

		const userOrError = User.create(userProps);

		expect(userOrError.isFailure).toBe(true);
	});
});
