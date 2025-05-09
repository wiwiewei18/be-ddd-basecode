import { describe, expect, it } from 'bun:test';
import { User, type UserProps } from './user';

describe('User Unit', () => {
	it('should return success and the user when given a valid user props', () => {
		const name = 'Monkey D Luffy';
		const email = 'monkeydluffy@mugiwara.com';
		const password = '1234578';
		const userProps: UserProps = {
			name,
			email,
			password,
		};

		const userOrError = User.create(userProps);

		expect(userOrError.isSuccess).toBe(true);
		const user = userOrError.getValue();
		expect(user.name).toBe(name);
		expect(user.email).toBe(email);
		expect(user.password).toBe(password);
	});
});
