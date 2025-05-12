import { User, type UserProps } from '@modules/user/domain/user/user';
import { UserEmailBuilder } from './userEmailBuilder';
import { UserNameBuilder } from './userNameBuilder';
import { UserPasswordBuilder } from './userPasswordBuilder';

export class UserBuilder {
	private props: Partial<UserProps>;

	constructor() {
		this.props = {};
	}

	withAllRandomDetails() {
		this.props = {
			name: new UserNameBuilder().withRandomName().build(),
			email: new UserEmailBuilder().withRandomEmail().build(),
			password: new UserPasswordBuilder().withRandomPassword().build(),
		};
		return this;
	}

	build() {
		return User.create(this.props as UserProps).getValue();
	}
}
