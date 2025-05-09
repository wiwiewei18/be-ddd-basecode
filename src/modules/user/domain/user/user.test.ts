import { beforeEach, describe, expect, it } from 'bun:test';
import { User, type UserProps } from './user';
import { UserEmail } from './userEmail';
import { UserName } from './userName';
import { UserPassword } from './userPassword';

describe('User Unit', () => {
	let name: UserName;
	let email: UserEmail;
	let password: UserPassword;

	beforeEach(() => {
		name = UserName.create('Monkey D Luffy').getValue();
		email = UserEmail.create('monkeydluffy@mugiwara.com').getValue();
		password = UserPassword.create({ value: '12345678' }).getValue();
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
});
