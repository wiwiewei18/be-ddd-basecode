import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	userId: varchar('user_id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
});

export type UserModelSchema = InferSelectModel<typeof userTable>;
