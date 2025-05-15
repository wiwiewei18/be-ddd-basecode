import type { User } from '@modules/user/domain/user/user';
import type { UserRepo } from '../../userRepo/userRepo';
import { UserBuilder } from '../builders/user/userBuilder';

export class UserFixture {
	private user: User;

	constructor(private userRepo: UserRepo) {
		this.user = new UserBuilder().withAllRandomDetails().build();
	}

	async build() {
		await this.createUser();

		return { user: this.user };
	}

	private async createUser() {
		await this.userRepo.save(this.user);
	}
}
