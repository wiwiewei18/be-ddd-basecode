import type { User } from '@modules/user/domain/user/user';
import type { UserEmail } from '@modules/user/domain/user/userEmail';
import type { Maybe } from '@shared/core/result';

export interface UserRepo {
	save(user: User): Promise<void>;
	getUserByUserId(userId: string): Promise<Maybe<User>>;
	getUserByEmail(email: UserEmail): Promise<Maybe<User>>;
}
