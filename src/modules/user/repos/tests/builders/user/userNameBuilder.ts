import { UserName, type UserNameProps } from '@modules/user/domain/user/userName';
import { TextUtil } from '@shared/utils/textUtil';

export class UserNameBuilder {
	private props: Partial<UserNameProps>;

	constructor() {
		this.props = {};
	}

	withRandomName() {
		this.props.value = TextUtil.getRandomText(5);
		return this;
	}

	build() {
		return UserName.create(this.props.value as string).getValue();
	}
}
