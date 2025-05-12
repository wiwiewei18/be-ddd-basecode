import { UserEmail, type UserEmailProps } from '@modules/user/domain/user/userEmail';
import { TextUtil } from '@shared/utils/textUtil';

export class UserEmailBuilder {
	private props: Partial<UserEmailProps>;

	constructor() {
		this.props = {};
	}

	withRandomEmail() {
		this.props.value = `${TextUtil.getRandomText(5)}@mugiwara.com`;
		return this;
	}

	build() {
		return UserEmail.create(this.props.value as string).getValue();
	}
}
