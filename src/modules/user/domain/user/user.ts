import { Result, type SuccessOrFailure } from '@shared/core/result';
import { AggregateRoot } from '@shared/domain/aggregateRoot';

export type UserProps = {
	name: string;
	email: string;
	password: string;
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
		const user = new User({ ...props }, id);

		const isNewUser = !!id === false;
		if (isNewUser) {
			// todo: raise domain event
		}

		return Result.ok(user);
	}
}
