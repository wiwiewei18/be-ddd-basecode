import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test';
import { database } from '@shared/bootstrap';
import { UserBuilder } from '../tests/builders/user/userBuilder';
import { InMemoryUserRepo } from './inMemoryUserRepo';
import { PostgresUserRepo } from './postgresUserRepo';
import { userTable } from './user.schema';
import type { UserRepo } from './userRepo';

describe('UserRepo Infra', () => {
	let userRepos: UserRepo[] = [];

	const userToSave = new UserBuilder().withAllRandomDetails().build();

	beforeAll(async () => {
		await database.connect();
	});

	beforeEach(async () => {
		userRepos = [new InMemoryUserRepo(), new PostgresUserRepo(database)];

		await database.getClient().delete(userTable);
	});

	afterAll(async () => {
		await database.getConnection().end();
	});

	it('should save a user when given a valid user', async () => {
		for (const userRepo of userRepos) {
			await userRepo.save(userToSave);
			const savedUser = await userRepo.getUserByUserId(userToSave.userId);

			expect(savedUser.isFound).toBe(true);
		}
	});

	it('should return the user when given a valid user id', async () => {
		for (const userRepo of userRepos) {
			await userRepo.save(userToSave);
			const savedUser = await userRepo.getUserByUserId(userToSave.userId);

			expect(savedUser.isFound).toBe(true);
			const user = savedUser.getValue();
			expect(user.userId).toEqual(user.userId);
			expect(user.name.equals(user.name)).toBe(true);
			expect(user.email.equals(user.email)).toBe(true);
			expect(user.password.equals(user.password)).toBe(true);
		}
	});
});
