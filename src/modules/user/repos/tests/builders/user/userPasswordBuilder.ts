import { UserPassword, type UserPasswordProps } from '@modules/user/domain/user/userPassword';
import { TextUtil } from '@shared/utils/textUtil';

export class UserPasswordBuilder {
	private props: Partial<UserPasswordProps>;

	constructor() {
		this.props = {};
	}

	withRandomPassword() {
		this.props.value = TextUtil.getRandomText(UserPassword.minLength);
		return this;
	}

	build() {
		return UserPassword.create(this.props as UserPasswordProps).getValue();
	}
}
