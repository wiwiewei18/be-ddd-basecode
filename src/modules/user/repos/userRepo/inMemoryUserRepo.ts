import type { User } from '@modules/user/domain/user/user';
import type { UserEmail } from '@modules/user/domain/user/userEmail';
import { type Maybe, Result } from '@shared/core/result';
import type { UserRepo } from './userRepo';

export class InMemoryUserRepo implements UserRepo {
	private users: User[];

	constructor() {
		this.users = [];
	}

	async save(user: User): Promise<void> {
		this.users.push(user);
	}

	async getUserByUserId(userId: string): Promise<Maybe<User>> {
		const user = this.users.find((user) => user.userId === userId);

		if (!user) {
			return Result.notFound(`User with user id ${userId} not found`);
		}

		return Result.found(user);
	}

	async getUserByEmail(email: UserEmail): Promise<Maybe<User>> {
		const user = this.users.find((user) => user.email.equals(email));

		if (!user) {
			return Result.notFound(`User with email ${email.value} not found`);
		}

		return Result.found(user);
	}
}
