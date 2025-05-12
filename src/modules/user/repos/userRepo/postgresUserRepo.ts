import type { User } from '@modules/user/domain/user/user';
import { UserMap } from '@modules/user/mapper/userMap';
import { type Maybe, Result } from '@shared/core/result';
import type { Database, PostgresClient } from '@shared/database/database';
import { eq } from 'drizzle-orm';
import { userTable } from './user.schema';
import type { UserRepo } from './userRepo';

export class PostgresUserRepo implements UserRepo {
	private client: PostgresClient;

	constructor(database: Database) {
		this.client = database.getClient();
	}

	async save(user: User): Promise<void> {
		const searchedUser = await this.getUserByUserId(user.userId);

		if (searchedUser.isNotFound) {
			await this.client.insert(userTable).values(UserMap.toPersistence(user));
		} else {
			await this.client
				.update(userTable)
				.set(UserMap.toPersistence(user))
				.where(eq(userTable.userId, user.userId));
		}
	}

	async getUserByUserId(userId: string): Promise<Maybe<User>> {
		const rawUsers = await this.client
			.select()
			.from(userTable)
			.limit(1)
			.where(eq(userTable.userId, userId));

		if (!rawUsers[0]) {
			return Result.notFound(`User with user id ${userId} not found`);
		}

		return Result.found(UserMap.toDomain(rawUsers[0]));
	}
}
