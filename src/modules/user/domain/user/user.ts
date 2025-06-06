import { Guard } from '@shared/core/guard';
import { Result, type SuccessOrFailure } from '@shared/core/result';
import { AggregateRoot } from '@shared/domain/aggregateRoot';
import type { UserEmail } from './userEmail';
import type { UserName } from './userName';
import type { UserPassword } from './userPassword';

export type UserProps = {
	name: UserName;
	email: UserEmail;
	password: UserPassword;
};

export class User extends AggregateRoot<UserProps> {
	get userId() {
		return this._id;
	}

	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	private constructor(props: UserProps, id?: string) {
		super(props, id);
	}

	static create(props: UserProps, id?: string): SuccessOrFailure<User> {
		const nothingGuard = Guard.againstNothingBulk([
			{ argument: props.name, argumentName: 'name' },
			{ argument: props.email, argumentName: 'email' },
			{ argument: props.password, argumentName: 'password' },
		]);
		if (nothingGuard.isFailure) {
			return Result.fail(`${nothingGuard.getErrorValue()} on create User`);
		}

		const user = new User({ ...props }, id);

		const isNewUser = !!id === false;
		if (isNewUser) {
			// todo: raise domain event
		}

		return Result.ok(user);
	}
}
